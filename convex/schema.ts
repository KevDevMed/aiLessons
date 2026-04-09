import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const learningItemValidator = v.object({
  english: v.string(),
  kind: v.union(v.literal("word"), v.literal("phrase"), v.literal("expression")),
  spanishMeaning: v.string(),
  spanishExplanation: v.string(),
  pronunciationHint: v.optional(v.string()),
  articleExample: v.optional(v.string()),
  exampleTranslation: v.optional(v.string()),
});

export const gameIdValidator = v.union(
  v.literal("snake"),
  v.literal("tetris"),
  v.literal("brick-breaker"),
  v.literal("flappy-bird"),
  v.literal("doom"),
);

export const scoreDetailValidator = v.optional(
  v.object({
    level: v.optional(v.number()),
    lines: v.optional(v.number()),
    lives: v.optional(v.number()),
    kills: v.optional(v.number()),
    totalEnemies: v.optional(v.number()),
    killPct: v.optional(v.number()),
    levelCompleted: v.optional(v.boolean()),
  }),
);

export default defineSchema({
  articles: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    url: v.string(),
    urlToImage: v.optional(v.string()),
    source: v.string(),
    author: v.optional(v.string()),
    publishedAt: v.string(),
    content: v.optional(v.string()),
    analysisScore: v.optional(v.number()),
    analysisSummary: v.optional(v.string()),
    analysisWhyItMatters: v.optional(v.string()),
    analysisOpinion: v.optional(v.string()),
    analysisModel: v.optional(v.string()),
    analysisGeneratedAt: v.optional(v.number()),
    analysisError: v.optional(v.string()),
    learningSpanishSummary: v.optional(v.string()),
    learningItems: v.optional(v.array(learningItemValidator)),
    // Legacy columns kept as optional so existing docs still validate.
    // No code reads or writes these anymore — they will disappear once the
    // last pre-existing row is overwritten. Safe to drop in a future pass
    // after running a one-time migration to unset them.
    category: v.optional(v.string()),
    fetchedAt: v.optional(v.number()),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_fetchedAt", ["fetchedAt"])
    .index("by_url", ["url"]),

  players: defineTable({
    deviceId: v.string(), // client-generated UUID stored in localStorage
    displayName: v.string(),
    isDev: v.boolean(), // true only for the seeded "Kevin the supreme dev" row
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_deviceId", ["deviceId"]),

  scores: defineTable({
    playerId: v.id("players"),
    gameId: gameIdValidator,
    score: v.number(), // normalized single metric, higher is better
    detail: scoreDetailValidator,
    updatedAt: v.number(),
  })
    // Upsert best: at most one row per (player, game).
    .index("by_player_game", ["playerId", "gameId"])
    // Leaderboard scan: range over all scores for a game, sorted asc by score.
    .index("by_game_score", ["gameId", "score"]),
});
