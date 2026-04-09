// Leaderboards: per-game best-score tables + "beat the dev" challenge.
//
// Identity model: each client mints an anonymous UUID ("deviceId") in
// localStorage and passes it to every mutation/query as an opaque token.
// This is a KNOWING deviation from convex/_generated/ai/guidelines.md, which
// recommends deriving identity via ctx.auth.getUserIdentity(). That guideline
// assumes an auth provider is configured — this project has none (no
// auth.config.ts, no ConvexProviderWithAuth). Adding a real auth stack is
// overkill for a playful portfolio site where the leaderboard is cosmetic.
// The tradeoff: a motivated user can forge a deviceId via DevTools. We
// mitigate with score clamping and best-only upserts; full tamper-resistance
// would require real auth.

import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { gameIdValidator, scoreDetailValidator } from "./schema";

// ============================================================
// CONSTANTS
// ============================================================

const DEV_DEVICE_ID = "dev:kevin-the-supreme-dev";
const DEV_DISPLAY_NAME = "Kevin the supreme dev";

const MIN_NAME_LEN = 1;
const MAX_NAME_LEN = 20;
const LEADERBOARD_HARD_LIMIT = 20;
const LEADERBOARD_SCAN_LIMIT = 200;

type GameId =
  | "snake"
  | "tetris"
  | "brick-breaker"
  | "flappy-bird"
  | "doom";

const GAME_IDS: GameId[] = [
  "snake",
  "tetris",
  "brick-breaker",
  "flappy-bird",
  "doom",
];

const SCORE_CEILINGS: Record<GameId, number> = {
  snake: 10_000,
  tetris: 9_999_999,
  "brick-breaker": 1_000_000,
  "flappy-bird": 10_000,
  doom: 1_000_000,
};

type ScoreDetail = {
  level?: number;
  lines?: number;
  lives?: number;
  kills?: number;
  totalEnemies?: number;
  killPct?: number;
  levelCompleted?: boolean;
};

// Placeholder targets for "Kevin the supreme dev". Tune after playing each
// game once — edit this object and re-run `npx convex dev`; the idempotent
// seedDevPlayer mutation will patch the existing dev rows in place.
const DEV_SCORES: Record<GameId, { score: number; detail?: ScoreDetail }> = {
  snake: { score: 250 },
  tetris: { score: 18_000, detail: { level: 6, lines: 42 } },
  "brick-breaker": { score: 850, detail: { level: 4, lives: 2 } },
  "flappy-bird": { score: 22 },
  doom: {
    score: 3750,
    detail: {
      level: 4,
      kills: 35,
      totalEnemies: 40,
      killPct: 87.5,
      levelCompleted: true,
    },
  },
};

// ============================================================
// HELPERS
// ============================================================

function sanitizeDisplayName(raw: string): string | null {
  const stripped = raw
    // Strip ASCII control characters. Build the regex via String.fromCharCode
    // to avoid embedding a control-char literal in the source.
    .replace(new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}]`, "g"), "")
    .trim();
  if (stripped.length < MIN_NAME_LEN) return null;
  return stripped.slice(0, MAX_NAME_LEN);
}

function sanitizeScore(gameId: GameId, raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  const ceiling = SCORE_CEILINGS[gameId];
  return Math.max(0, Math.min(Math.round(raw), ceiling));
}

// ============================================================
// MUTATIONS
// ============================================================

export const registerOrUpdatePlayer = mutation({
  args: {
    deviceId: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, { deviceId, displayName }): Promise<Id<"players">> => {
    const name = sanitizeDisplayName(displayName);
    if (!name) {
      throw new Error("Display name must be 1-20 characters.");
    }
    if (deviceId === DEV_DEVICE_ID) {
      throw new Error("Reserved device id.");
    }
    const now = Date.now();
    const existing = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();
    if (existing) {
      // Never flip isDev from a client call.
      await ctx.db.patch(existing._id, { displayName: name, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("players", {
      deviceId,
      displayName: name,
      isDev: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const submitScore = mutation({
  args: {
    deviceId: v.string(),
    gameId: gameIdValidator,
    score: v.number(),
    detail: scoreDetailValidator,
  },
  handler: async (
    ctx,
    { deviceId, gameId, score, detail },
  ): Promise<{ isNewBest: boolean; best: number }> => {
    // Never throw on a leaderboard submission — the calling game must not
    // crash if the backend rejects a value. All failure paths return a
    // safe no-op result.
    const clamped = sanitizeScore(gameId, score);

    // Dev scores are seed-only. Silently ignore any client attempt to post
    // under the reserved deviceId.
    if (deviceId === DEV_DEVICE_ID) {
      return { isNewBest: false, best: 0 };
    }

    let player = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();

    // Fallback: player submitted a score before the name prompt finished.
    // Create a placeholder row so we don't drop the score; the name prompt
    // will patch the displayName on next save.
    if (!player) {
      const now = Date.now();
      const id = await ctx.db.insert("players", {
        deviceId,
        displayName: "Player",
        isDev: false,
        createdAt: now,
        updatedAt: now,
      });
      player = await ctx.db.get(id);
      if (!player) return { isNewBest: false, best: 0 };
    }

    if (player.isDev) {
      return { isNewBest: false, best: 0 };
    }

    const existing = await ctx.db
      .query("scores")
      .withIndex("by_player_game", (q) =>
        q.eq("playerId", player!._id).eq("gameId", gameId),
      )
      .first();

    const now = Date.now();
    if (!existing) {
      await ctx.db.insert("scores", {
        playerId: player._id,
        gameId,
        score: clamped,
        detail,
        updatedAt: now,
      });
      return { isNewBest: true, best: clamped };
    }

    if (clamped > existing.score) {
      await ctx.db.patch(existing._id, {
        score: clamped,
        detail,
        updatedAt: now,
      });
      return { isNewBest: true, best: clamped };
    }
    return { isNewBest: false, best: existing.score };
  },
});

// Public idempotent wrapper — called once on app mount so Kevin's row and
// target scores always exist. Safe under React StrictMode double-invocation.
export const ensureDevSeeded = mutation({
  args: {},
  handler: async (ctx): Promise<null> => {
    await ctx.runMutation(internal.leaderboards.seedDevPlayer, {});
    return null;
  },
});

// ============================================================
// INTERNAL
// ============================================================

export const seedDevPlayer = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    let dev = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", DEV_DEVICE_ID))
      .first();

    if (!dev) {
      const id = await ctx.db.insert("players", {
        deviceId: DEV_DEVICE_ID,
        displayName: DEV_DISPLAY_NAME,
        isDev: true,
        createdAt: now,
        updatedAt: now,
      });
      dev = await ctx.db.get(id);
    } else if (dev.displayName !== DEV_DISPLAY_NAME || !dev.isDev) {
      await ctx.db.patch(dev._id, {
        displayName: DEV_DISPLAY_NAME,
        isDev: true,
        updatedAt: now,
      });
      dev = await ctx.db.get(dev._id);
    }
    if (!dev) return null;

    for (const gameId of GAME_IDS) {
      const seed = DEV_SCORES[gameId];
      const existing = await ctx.db
        .query("scores")
        .withIndex("by_player_game", (q) =>
          q.eq("playerId", dev!._id).eq("gameId", gameId),
        )
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          score: seed.score,
          detail: seed.detail,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("scores", {
          playerId: dev._id,
          gameId,
          score: seed.score,
          detail: seed.detail,
          updatedAt: now,
        });
      }
    }
    return null;
  },
});

// ============================================================
// QUERIES
// ============================================================

type LeaderboardRow = {
  rank: number;
  playerId: Id<"players">;
  displayName: string;
  isDev: boolean;
  score: number;
  detail: ScoreDetail | null;
  updatedAt: number;
};

export const getLeaderboard = query({
  args: {
    gameId: gameIdValidator,
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { gameId, limit }): Promise<LeaderboardRow[]> => {
    const take = Math.max(
      1,
      Math.min(limit ?? LEADERBOARD_HARD_LIMIT, LEADERBOARD_HARD_LIMIT),
    );
    const rows = await ctx.db
      .query("scores")
      .withIndex("by_game_score", (q) => q.eq("gameId", gameId))
      .take(LEADERBOARD_SCAN_LIMIT);
    rows.sort((a, b) => b.score - a.score);
    const top = rows.slice(0, take);
    const players = await Promise.all(
      top.map((r) => ctx.db.get(r.playerId)),
    );
    return top.map((r, i) => ({
      rank: i + 1,
      playerId: r.playerId,
      displayName: players[i]?.displayName ?? "Unknown",
      isDev: players[i]?.isDev ?? false,
      score: r.score,
      detail: (r.detail as ScoreDetail | undefined) ?? null,
      updatedAt: r.updatedAt,
    }));
  },
});

export const getPlayerBest = query({
  args: {
    deviceId: v.string(),
    gameId: gameIdValidator,
  },
  handler: async (
    ctx,
    { deviceId, gameId },
  ): Promise<{
    score: number;
    detail: ScoreDetail | null;
    rank: number | null;
  } | null> => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();
    if (!player) return null;

    const best = await ctx.db
      .query("scores")
      .withIndex("by_player_game", (q) =>
        q.eq("playerId", player._id).eq("gameId", gameId),
      )
      .first();
    if (!best) return null;

    // Rank: fetch top scan, sort, find this player's row.
    const rows = await ctx.db
      .query("scores")
      .withIndex("by_game_score", (q) => q.eq("gameId", gameId))
      .take(LEADERBOARD_SCAN_LIMIT);
    rows.sort((a, b) => b.score - a.score);
    const idx = rows.findIndex((r) => r.playerId === player._id);
    const rank = idx >= 0 ? idx + 1 : null;

    return {
      score: best.score,
      detail: (best.detail as ScoreDetail | undefined) ?? null,
      rank,
    };
  },
});

export const getBeatDevStatus = query({
  args: {
    deviceId: v.string(),
    gameId: gameIdValidator,
  },
  handler: async (
    ctx,
    { deviceId, gameId },
  ): Promise<{
    devScore: number | null;
    devDetail: ScoreDetail | null;
    devDisplayName: string;
    playerScore: number | null;
    playerBeatDev: boolean;
  }> => {
    const dev = await ctx.db
      .query("players")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", DEV_DEVICE_ID))
      .first();

    let devScore: number | null = null;
    let devDetail: ScoreDetail | null = null;
    if (dev) {
      const row = await ctx.db
        .query("scores")
        .withIndex("by_player_game", (q) =>
          q.eq("playerId", dev._id).eq("gameId", gameId),
        )
        .first();
      if (row) {
        devScore = row.score;
        devDetail = (row.detail as ScoreDetail | undefined) ?? null;
      }
    }

    let playerScore: number | null = null;
    if (deviceId && deviceId !== DEV_DEVICE_ID) {
      const player = await ctx.db
        .query("players")
        .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
        .first();
      if (player) {
        const row = await ctx.db
          .query("scores")
          .withIndex("by_player_game", (q) =>
            q.eq("playerId", player._id).eq("gameId", gameId),
          )
          .first();
        if (row) playerScore = row.score;
      }
    }

    return {
      devScore,
      devDetail,
      devDisplayName: dev?.displayName ?? DEV_DISPLAY_NAME,
      playerScore,
      playerBeatDev:
        playerScore !== null && devScore !== null && playerScore > devScore,
    };
  },
});

export const getAllLeaderboards = query({
  args: { limit: v.optional(v.number()) },
  handler: async (
    ctx,
    { limit },
  ): Promise<Record<GameId, LeaderboardRow[]>> => {
    const take = Math.max(
      1,
      Math.min(limit ?? LEADERBOARD_HARD_LIMIT, LEADERBOARD_HARD_LIMIT),
    );
    const result = {} as Record<GameId, LeaderboardRow[]>;
    for (const gameId of GAME_IDS) {
      const rows = await ctx.db
        .query("scores")
        .withIndex("by_game_score", (q) => q.eq("gameId", gameId))
        .take(LEADERBOARD_SCAN_LIMIT);
      rows.sort((a, b) => b.score - a.score);
      const top = rows.slice(0, take);
      const players = await Promise.all(
        top.map((r) => ctx.db.get(r.playerId)),
      );
      result[gameId] = top.map((r, i) => ({
        rank: i + 1,
        playerId: r.playerId,
        displayName: players[i]?.displayName ?? "Unknown",
        isDev: players[i]?.isDev ?? false,
        score: r.score,
        detail: (r.detail as ScoreDetail | undefined) ?? null,
        updatedAt: r.updatedAt,
      }));
    }
    return result;
  },
});
