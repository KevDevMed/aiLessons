import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
  type ActionCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";

// `process` is available in Convex actions but not in the default types.
declare const process: { env: Record<string, string | undefined> };

const NEWS_API_URL = "https://newsapi.org/v2/everything";
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const QUERY =
  '("artificial intelligence" OR AI OR LLM OR OpenAI OR Anthropic OR Nvidia OR Microsoft) ' +
  'AND (business OR enterprise OR company OR startup OR funding OR earnings OR market)';
const NEWS_DOMAINS = [
  "techcrunch.com",
  "reuters.com",
  "cnbc.com",
  "theverge.com",
  "venturebeat.com",
  "wsj.com",
  "ft.com",
  "bloomberg.com",
  "axios.com",
].join(",");
const PAGE_SIZE = 5;
const LIST_LIMIT_CEILING = 50;
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;
const MAX_LEARNING_ITEMS = 6;

const learningItemValidator = v.object({
  english: v.string(),
  kind: v.union(v.literal("word"), v.literal("phrase"), v.literal("expression")),
  spanishMeaning: v.string(),
  spanishExplanation: v.string(),
  pronunciationHint: v.optional(v.string()),
  articleExample: v.optional(v.string()),
  exampleTranslation: v.optional(v.string()),
});

const articleValidator = v.object({
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
});

type RawArticle = {
  title: string | null;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: { id: string | null; name: string };
  author: string | null;
  publishedAt: string;
  content: string | null;
};

type NewsApiResponse = {
  status: string;
  totalResults?: number;
  articles?: RawArticle[];
  code?: string;
  message?: string;
};

type StoredArticle = {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  source: string;
  author?: string;
  publishedAt: string;
  content?: string;
  analysisScore?: number;
  analysisSummary?: string;
  analysisWhyItMatters?: string;
  analysisOpinion?: string;
  analysisModel?: string;
  analysisGeneratedAt?: number;
  analysisError?: string;
  learningSpanishSummary?: string;
  learningItems?: StoredLearningItem[];
};

type StoredLearningItem = {
  english: string;
  kind: "word" | "phrase" | "expression";
  spanishMeaning: string;
  spanishExplanation: string;
  pronunciationHint?: string;
  articleExample?: string;
  exampleTranslation?: string;
};

type GeminiLearningItem = {
  english?: string;
  kind?: string;
  spanishMeaning?: string;
  spanishExplanation?: string;
  pronunciationHint?: string;
  articleExample?: string;
  exampleTranslation?: string;
};

type GeminiAnalysisResult = {
  url: string;
  relevanceScore?: number;
  summary?: string;
  whyItMatters?: string;
  opinion?: string;
  spanishSummary?: string;
  learningItems?: GeminiLearningItem[];
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  modelVersion?: string;
};

function trimTo(value: string | undefined, maxLength: number): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length <= maxLength
    ? trimmed
    : `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}

function clampScore(score: number | undefined): number | undefined {
  if (typeof score !== "number" || Number.isNaN(score)) return undefined;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeLearningKind(
  kind: string | undefined,
  english: string,
): StoredLearningItem["kind"] {
  if (kind === "word" || kind === "phrase" || kind === "expression") {
    return kind;
  }
  return english.includes(" ") ? "phrase" : "word";
}

function normalizeLearningItems(
  items: GeminiLearningItem[] | undefined,
): StoredLearningItem[] | undefined {
  if (!items?.length) return undefined;

  const results: StoredLearningItem[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const english = trimTo(item.english, 80);
    const spanishMeaning = trimTo(item.spanishMeaning, 110);
    const spanishExplanation = trimTo(item.spanishExplanation, 180);
    if (!english || !spanishMeaning || !spanishExplanation) {
      continue;
    }

    const normalizedKey = english.toLowerCase();
    if (seen.has(normalizedKey)) {
      continue;
    }
    seen.add(normalizedKey);

    results.push({
      english,
      kind: normalizeLearningKind(item.kind, english),
      spanishMeaning,
      spanishExplanation,
      pronunciationHint: trimTo(item.pronunciationHint, 80),
      articleExample: trimTo(item.articleExample, 140),
      exampleTranslation: trimTo(item.exampleTranslation, 160),
    });

    if (results.length >= MAX_LEARNING_ITEMS) {
      break;
    }
  }

  return results.length > 0 ? results : undefined;
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Gemini response did not include JSON.");
    }
    return JSON.parse(match[0]);
  }
}

async function analyzeArticlesWithGemini(
  articles: StoredArticle[],
): Promise<{ results: Map<string, GeminiAnalysisResult>; modelVersion: string }> {
  if (articles.length === 0) {
    return { results: new Map(), modelVersion: GEMINI_MODELS[0] };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Run: npx convex env set GEMINI_API_KEY <key>",
    );
  }

  const prompt = [
    "You analyze business and AI news for a compact news reader aimed at Spanish-speaking readers who are learning English.",
    "The source articles are written in English but your analysis must be written in plain Spanish so the reader can understand it quickly.",
    "Return JSON only.",
    'Use this shape: {"articles":[{"url":"string","relevanceScore":0-100,"summary":"string","whyItMatters":"string","opinion":"string","spanishSummary":"string","learningItems":[{"english":"string","kind":"word|phrase|expression","spanishMeaning":"string","spanishExplanation":"string","pronunciationHint":"string","articleExample":"string","exampleTranslation":"string"}]}]}',
    "Rules:",
    "- Analyze every article provided.",
    "- relevanceScore should reflect how relevant the article is to both AI and business impact.",
    "- summary must be one short sentence IN SPANISH, under 140 characters.",
    "- whyItMatters must be one short sentence IN SPANISH, under 160 characters.",
    "- opinion must be one short sentence IN SPANISH, under 160 characters, and should be a practical take for operators or investors.",
    "- spanishSummary must be one short sentence in plain Spanish, under 180 characters. It may restate the summary from a different angle.",
    "- learningItems should contain 3 to 6 useful entries when the article supports it.",
    "- Prefer a mixed set of reusable business, AI, and news expressions rather than filler beginner words.",
    '- kind must always be one of "word", "phrase", or "expression".',
    "- english MUST stay in English (it is the vocabulary the learner is studying).",
    "- articleExample MUST stay in English and quote or tightly paraphrase article wording, under 140 characters.",
    "- spanishMeaning must be a concise Spanish translation or meaning.",
    "- spanishExplanation must explain usage in plain Spanish, under 180 characters.",
    "- pronunciationHint should be easy for a Spanish speaker to read aloud.",
    "- exampleTranslation should translate the example into Spanish, under 160 characters.",
    "- Do not invent facts.",
    "",
    JSON.stringify(
      {
        articles: articles.map((article) => ({
          url: article.url,
          title: article.title,
          source: article.source,
          description: article.description ?? null,
          content: article.content ?? null,
          publishedAt: article.publishedAt,
        })),
      },
      null,
      2,
    ),
  ].join("\n");

  let lastError: Error | undefined;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(
        `${GEMINI_API_BASE_URL}/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        lastError = new Error(
          `Gemini request failed for ${model}: ${response.status} ${response.statusText} ${body}`,
        );

        if (response.status >= 500 && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1200));
          continue;
        }

        break;
      }

      const data = (await response.json()) as GeminiGenerateContentResponse;
      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();

      if (!text) {
        lastError = new Error(`Gemini response did not contain text for ${model}.`);
        break;
      }

      const parsed = parseJsonObject(text) as {
        articles?: GeminiAnalysisResult[];
      };
      const results = new Map<string, GeminiAnalysisResult>();

      for (const result of parsed.articles ?? []) {
        if (!result?.url) continue;
        results.set(result.url, result);
      }

      return {
        results,
        modelVersion: data.modelVersion ?? model,
      };
    }
  }

  throw lastError ?? new Error("Gemini request failed for all configured models.");
}

async function fetchAndStore(
  ctx: ActionCtx,
): Promise<{ inserted: number; skipped: number; total: number }> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEWS_API_KEY is not set. Run: npx convex env set NEWS_API_KEY <key>",
    );
  }

  const url =
    `${NEWS_API_URL}` +
    `?q=${encodeURIComponent(QUERY)}` +
    `&domains=${encodeURIComponent(NEWS_DOMAINS)}` +
    `&searchIn=title,description` +
    `&language=en` +
    `&sortBy=publishedAt` +
    `&pageSize=${PAGE_SIZE}` +
    `&apiKey=${apiKey}`;

  const response = await fetch(url, {
    headers: { "User-Agent": "harp-ai-news/1.0" },
  });

  if (!response.ok) {
    throw new Error(
      `NewsAPI request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as NewsApiResponse;

  if (data.status !== "ok") {
    throw new Error(
      `NewsAPI error: ${data.code ?? "unknown"} ${data.message ?? ""}`,
    );
  }

  const raw = data.articles ?? [];

  const articles = raw
    .filter((a) => a.title && a.url && a.title !== "[Removed]")
    .map((a) => ({
      title: a.title!,
      description: a.description ?? undefined,
      url: a.url,
      urlToImage: a.urlToImage ?? undefined,
      source: a.source?.name ?? "Unknown",
      author: a.author ?? undefined,
      publishedAt: a.publishedAt,
      content: a.content ?? undefined,
    })) satisfies StoredArticle[];

  let enrichedArticles: StoredArticle[] = articles;
  let globalAnalysisError: string | undefined;

  try {
    const {
      results: analysisByUrl,
      modelVersion,
    } = await analyzeArticlesWithGemini(articles);
    const analysisGeneratedAt = Date.now();

    enrichedArticles = articles.map((article) => {
      const analysis = analysisByUrl.get(article.url);
      if (!analysis) {
        return {
          ...article,
          analysisError: "No analysis returned for this article.",
        };
      }
      return {
        ...article,
        analysisScore: clampScore(analysis.relevanceScore),
        analysisSummary: trimTo(analysis.summary, 140),
        analysisWhyItMatters: trimTo(analysis.whyItMatters, 160),
        analysisOpinion: trimTo(analysis.opinion, 160),
        analysisModel: modelVersion,
        analysisGeneratedAt,
        learningSpanishSummary: trimTo(analysis.spanishSummary, 180),
        learningItems: normalizeLearningItems(analysis.learningItems),
      };
    });
  } catch (error) {
    globalAnalysisError =
      error instanceof Error ? error.message : String(error);
    console.error("Gemini article analysis failed:", error);
    enrichedArticles = articles.map((article) => ({
      ...article,
      analysisError: globalAnalysisError,
    }));
  }

  const result = await ctx.runMutation(internal.news.insertArticles, {
    articles: enrichedArticles,
  });

  // If every article failed analysis, surface a structural failure so the
  // cron run shows up as errored in the Convex dashboard (instead of quietly
  // writing five empty rows for days).
  if (
    enrichedArticles.length > 0 &&
    enrichedArticles.every((a) => a.analysisError !== undefined)
  ) {
    throw new Error(
      `News ingest succeeded but Gemini analysis failed for all ${enrichedArticles.length} articles: ${globalAnalysisError ?? "no analysis returned"}`,
    );
  }

  return { ...result, total: enrichedArticles.length };
}

/**
 * Internal action invoked by the daily cron.
 */
export const fetchAINews = internalAction({
  args: {},
  handler: async (ctx): Promise<{ inserted: number; skipped: number; total: number }> => {
    return await fetchAndStore(ctx);
  },
});

/**
 * Public action for manual refreshes from the client or CLI.
 */
export const refreshNews = action({
  args: {},
  handler: async (ctx): Promise<{ inserted: number; skipped: number; total: number }> => {
    return await fetchAndStore(ctx);
  },
});

/**
 * Internal mutation that dedupes by URL and inserts new articles.
 */
export const insertArticles = internalMutation({
  args: { articles: v.array(articleValidator) },
  handler: async (ctx, { articles }) => {
    let inserted = 0;
    let skipped = 0;
    const fetchedAt = Date.now();

    for (const article of articles) {
      const existing = await ctx.db
        .query("articles")
        .withIndex("by_url", (q) => q.eq("url", article.url))
        .first();

      if (existing) {
        // Clear stale analysis fields when re-analyzing; patch lets undefined
        // fields overwrite existing values.
        await ctx.db.patch(existing._id, {
          title: article.title,
          description: article.description,
          urlToImage: article.urlToImage,
          source: article.source,
          author: article.author,
          publishedAt: article.publishedAt,
          content: article.content,
          analysisScore: article.analysisScore,
          analysisSummary: article.analysisSummary,
          analysisWhyItMatters: article.analysisWhyItMatters,
          analysisOpinion: article.analysisOpinion,
          analysisModel: article.analysisModel,
          analysisGeneratedAt: article.analysisGeneratedAt,
          analysisError: article.analysisError,
          learningSpanishSummary: article.learningSpanishSummary,
          learningItems: article.learningItems,
          fetchedAt,
          category: "ai",
        });
        skipped++;
        continue;
      }

      await ctx.db.insert("articles", {
        ...article,
        fetchedAt,
        category: "ai",
      });
      inserted++;
    }

    return { inserted, skipped };
  },
});

/**
 * Public query: list articles ordered by relevance score, then publishedAt desc.
 *
 * `limit` is clamped to LIST_LIMIT_CEILING. The sort is applied in-memory
 * after the fetch, so the ceiling also bounds the sort work per call.
 */
export const listArticles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const take = Math.max(1, Math.min(limit ?? PAGE_SIZE, LIST_LIMIT_CEILING));
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_fetchedAt")
      .order("desc")
      .take(take);

    return articles.sort((a, b) => {
      const scoreDelta = (b.analysisScore ?? -1) - (a.analysisScore ?? -1);
      if (scoreDelta !== 0) return scoreDelta;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
  },
});

/**
 * Public query: fetch a single article by id.
 */
export const getArticle = query({
  args: { id: v.id("articles") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/**
 * Internal mutation: wipe every article row. Used by `resetAndRefetch`
 * for a clean slate when the Gemini prompt changes and stale
 * English-era analysis shouldn't linger alongside fresh Spanish output.
 */
export const wipeAllArticles = internalMutation({
  args: {},
  handler: async (ctx): Promise<{ deleted: number }> => {
    const rows = await ctx.db.query("articles").collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return { deleted: rows.length };
  },
});

/**
 * Public action: wipe all stored articles and immediately fetch a
 * fresh batch from NewsAPI + Gemini. Trigger via:
 *   npx convex run news:resetAndRefetch
 *
 * Destructive. Use after changing the Gemini prompt so the UI shows
 * only freshly-analyzed articles instead of a mix.
 */
export const resetAndRefetch = action({
  args: {},
  handler: async (
    ctx,
  ): Promise<{
    deleted: number;
    inserted: number;
    skipped: number;
    total: number;
  }> => {
    const { deleted } = await ctx.runMutation(
      internal.news.wipeAllArticles,
      {},
    );
    const result = await fetchAndStore(ctx);
    return { deleted, ...result };
  },
});

/**
 * Internal query: pull every stored article in the shape
 * `analyzeArticlesWithGemini` expects. Used by the re-analysis action
 * to rewrite existing English analysis fields into Spanish.
 */
export const listAllForReanalysis = internalQuery({
  args: {},
  handler: async (ctx): Promise<StoredArticle[]> => {
    const rows = await ctx.db.query("articles").collect();
    return rows.map((row) => ({
      title: row.title,
      description: row.description,
      url: row.url,
      urlToImage: row.urlToImage,
      source: row.source,
      author: row.author,
      publishedAt: row.publishedAt,
      content: row.content,
    }));
  },
});

/**
 * Public action: re-run Gemini analysis on every existing article using
 * the current prompt and patch the results in place. Trigger via:
 *   npx convex run news:reanalyzeAllArticles
 *
 * This is needed after changing the Gemini prompt (e.g. language
 * switches) so stored articles pick up the new style without waiting
 * for the daily cron to happen to refetch them.
 */
export const reanalyzeAllArticles = action({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ analyzed: number; total: number; model?: string }> => {
    const articles: StoredArticle[] = await ctx.runQuery(
      internal.news.listAllForReanalysis,
      {},
    );
    if (articles.length === 0) {
      return { analyzed: 0, total: 0 };
    }

    const { results, modelVersion } = await analyzeArticlesWithGemini(articles);
    const analysisGeneratedAt = Date.now();

    const enriched: StoredArticle[] = articles.map((article) => {
      const analysis = results.get(article.url);
      if (!analysis) {
        return {
          ...article,
          analysisError: "No analysis returned for this article.",
        };
      }
      return {
        ...article,
        analysisScore: clampScore(analysis.relevanceScore),
        analysisSummary: trimTo(analysis.summary, 140),
        analysisWhyItMatters: trimTo(analysis.whyItMatters, 160),
        analysisOpinion: trimTo(analysis.opinion, 160),
        analysisModel: modelVersion,
        analysisGeneratedAt,
        analysisError: undefined,
        learningSpanishSummary: trimTo(analysis.spanishSummary, 180),
        learningItems: normalizeLearningItems(analysis.learningItems),
      };
    });

    await ctx.runMutation(internal.news.insertArticles, { articles: enriched });

    const analyzed = enriched.filter((a) => a.analysisError === undefined).length;
    return { analyzed, total: enriched.length, model: modelVersion };
  },
});
