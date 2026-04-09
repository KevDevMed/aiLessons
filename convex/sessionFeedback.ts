// Anonymous post-session feedback collection.
//
// Identity model: students submit using the opaque `deviceId` minted by
// `src/stores/usePlayerStore.ts` and persisted to localStorage. This mirrors
// the deviceId pattern used by `convex/leaderboards.ts` and is the same
// KNOWING deviation from convex/_generated/ai/guidelines.md documented there
// (no auth provider is configured for this project). Tradeoff: a motivated
// user can forge a deviceId via DevTools to submit multiple times. We mitigate
// by upserting on (sessionKey, deviceId) and rejecting malformed payloads,
// which is sufficient for a teacher-feedback widget.

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Keep in sync with the QUESTIONS constant in
// src/components/Desktop/SessionFeedbackWidget.tsx.
const MAX_QUESTIONS = 5;
const MAX_OPTION_INDEX = 4; // 5-option scale: indices 0..4
const QUESTION_ID_RE = /^q[1-5]$/;

// Cap the aggregate scan at 500 rows. If a single session ever exceeds this,
// replace the scan with a denormalized counter document updated on submit.
const SUMMARY_SCAN_LIMIT = 500;

// ============================================================
// MUTATIONS
// ============================================================

export const submitFeedback = mutation({
  args: {
    sessionKey: v.string(),
    deviceId: v.string(),
    answers: v.array(
      v.object({
        questionId: v.string(),
        optionIndex: v.number(),
      }),
    ),
  },
  handler: async (ctx, { sessionKey, deviceId, answers }): Promise<null> => {
    const trimmedSession = sessionKey.trim();
    const trimmedDevice = deviceId.trim();
    if (!trimmedSession || !trimmedDevice) {
      throw new Error("sessionKey and deviceId are required.");
    }
    if (answers.length === 0 || answers.length > MAX_QUESTIONS) {
      throw new Error(`answers must contain 1-${MAX_QUESTIONS} entries.`);
    }

    const seen = new Set<string>();
    for (const a of answers) {
      if (!QUESTION_ID_RE.test(a.questionId)) {
        throw new Error(`Invalid questionId: ${a.questionId}`);
      }
      if (seen.has(a.questionId)) {
        throw new Error(`Duplicate questionId: ${a.questionId}`);
      }
      seen.add(a.questionId);
      if (
        !Number.isInteger(a.optionIndex) ||
        a.optionIndex < 0 ||
        a.optionIndex > MAX_OPTION_INDEX
      ) {
        throw new Error(
          `optionIndex for ${a.questionId} must be an integer 0..${MAX_OPTION_INDEX}.`,
        );
      }
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("sessionFeedback")
      .withIndex("by_session_device", (q) =>
        q.eq("sessionKey", trimmedSession).eq("deviceId", trimmedDevice),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        answers,
        submittedAt: now,
      });
      return null;
    }

    await ctx.db.insert("sessionFeedback", {
      sessionKey: trimmedSession,
      deviceId: trimmedDevice,
      answers,
      submittedAt: now,
    });
    return null;
  },
});

// ============================================================
// QUERIES
// ============================================================

export const hasSubmittedFeedback = query({
  args: {
    sessionKey: v.string(),
    deviceId: v.string(),
  },
  handler: async (ctx, { sessionKey, deviceId }): Promise<boolean> => {
    const trimmedSession = sessionKey.trim();
    const trimmedDevice = deviceId.trim();
    if (!trimmedSession || !trimmedDevice) return false;

    const existing = await ctx.db
      .query("sessionFeedback")
      .withIndex("by_session_device", (q) =>
        q.eq("sessionKey", trimmedSession).eq("deviceId", trimmedDevice),
      )
      .unique();
    return existing !== null;
  },
});

type FeedbackSummary = {
  totalResponses: number;
  counts: Record<string, number[]>;
};

export const getFeedbackSummary = query({
  args: {
    sessionKey: v.string(),
  },
  handler: async (ctx, { sessionKey }): Promise<FeedbackSummary> => {
    const rows = await ctx.db
      .query("sessionFeedback")
      .withIndex("by_sessionKey", (q) => q.eq("sessionKey", sessionKey))
      .take(SUMMARY_SCAN_LIMIT);

    const counts: Record<string, number[]> = {};
    for (const row of rows) {
      for (const a of row.answers) {
        if (!counts[a.questionId]) {
          counts[a.questionId] = new Array(MAX_OPTION_INDEX + 1).fill(0);
        }
        if (
          a.optionIndex >= 0 &&
          a.optionIndex <= MAX_OPTION_INDEX
        ) {
          counts[a.questionId][a.optionIndex]++;
        }
      }
    }

    return {
      totalResponses: rows.length,
      counts,
    };
  },
});
