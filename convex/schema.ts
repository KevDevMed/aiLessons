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
});
