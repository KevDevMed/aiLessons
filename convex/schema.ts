import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    category: v.string(),
    fetchedAt: v.number(),
    analysisScore: v.optional(v.number()),
    analysisSummary: v.optional(v.string()),
    analysisWhyItMatters: v.optional(v.string()),
    analysisOpinion: v.optional(v.string()),
    analysisModel: v.optional(v.string()),
    analysisGeneratedAt: v.optional(v.number()),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_fetchedAt", ["fetchedAt"])
    .index("by_url", ["url"]),
});
