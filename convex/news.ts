import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
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
const GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

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
};

type GeminiAnalysisResult = {
  url: string;
  relevanceScore?: number;
  summary?: string;
  whyItMatters?: string;
  opinion?: string;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
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
): Promise<Map<string, GeminiAnalysisResult>> {
  if (articles.length === 0) {
    return new Map();
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Run: npx convex env set GEMINI_API_KEY <key>",
    );
  }

  const prompt = [
    "You analyze business and AI news for a compact news reader.",
    "Return JSON only.",
    'Use this shape: {"articles":[{"url":"string","relevanceScore":0-100,"summary":"string","whyItMatters":"string","opinion":"string"}]}',
    "Rules:",
    "- Analyze every article provided.",
    "- relevanceScore should reflect how relevant the article is to both AI and business impact.",
    "- summary must be one short sentence, under 140 characters.",
    "- whyItMatters must be one short sentence, under 160 characters.",
    "- opinion must be one short sentence, under 160 characters, and should be a practical take for operators or investors.",
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

  const response = await fetch(
    `${GEMINI_API_BASE_URL}/${GEMINI_MODEL}:generateContent`,
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
    throw new Error(
      `Gemini request failed: ${response.status} ${response.statusText} ${body}`,
    );
  }

  const data = (await response.json()) as GeminiGenerateContentResponse;
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini response did not contain text.");
  }

  const parsed = parseJsonObject(text) as {
    articles?: GeminiAnalysisResult[];
  };
  const results = new Map<string, GeminiAnalysisResult>();

  for (const result of parsed.articles ?? []) {
    if (!result?.url) continue;
    results.set(result.url, result);
  }

  return results;
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

  let enrichedArticles = articles;

  try {
    const analysisByUrl = await analyzeArticlesWithGemini(articles);
    const analysisGeneratedAt = Date.now();

    enrichedArticles = articles.map((article) => {
      const analysis = analysisByUrl.get(article.url);
      return {
        ...article,
        analysisScore: clampScore(analysis?.relevanceScore),
        analysisSummary: trimTo(analysis?.summary, 140),
        analysisWhyItMatters: trimTo(analysis?.whyItMatters, 160),
        analysisOpinion: trimTo(analysis?.opinion, 160),
        analysisModel: analysis ? GEMINI_MODEL : undefined,
        analysisGeneratedAt: analysis ? analysisGeneratedAt : undefined,
      };
    });
  } catch (error) {
    console.error("Gemini article analysis failed:", error);
  }

  const result = await ctx.runMutation(internal.news.insertArticles, {
    articles: enrichedArticles,
  });

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
 * Public action the client calls when the user clicks "Refresh".
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
        await ctx.db.patch(existing._id, {
          title: article.title,
          description: article.description,
          urlToImage: article.urlToImage,
          source: article.source,
          author: article.author,
          publishedAt: article.publishedAt,
          content: article.content,
          category: "ai",
          fetchedAt,
          analysisScore: article.analysisScore,
          analysisSummary: article.analysisSummary,
          analysisWhyItMatters: article.analysisWhyItMatters,
          analysisOpinion: article.analysisOpinion,
          analysisModel: article.analysisModel,
          analysisGeneratedAt: article.analysisGeneratedAt,
        });
        skipped++;
        continue;
      }

      await ctx.db.insert("articles", {
        ...article,
        category: "ai",
        fetchedAt,
      });
      inserted++;
    }

    return { inserted, skipped };
  },
});

/**
 * Public query: list articles ordered by publishedAt desc.
 */
export const listArticles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_fetchedAt")
      .order("desc")
      .take(Math.min(limit ?? PAGE_SIZE, PAGE_SIZE));

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
