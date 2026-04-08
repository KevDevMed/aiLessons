# News Gemini Enrichment Design

## Scope

Reduce the News app to a single feed of up to 5 business-and-AI articles.

## Data Flow

1. Convex fetches up to 5 articles from NewsAPI using the existing AI/business query.
2. Convex sends those same 5 articles to Gemini for lightweight analysis.
3. Gemini returns a short summary, why the story matters, a brief opinion, and a relevance score.
4. Convex stores the article plus the optional Gemini fields.
5. The News UI shows the top 5 latest items with the Gemini analysis inline.

## Decisions

- Gemini only analyzes the 5 articles already selected by NewsAPI.
- Analysis failures must not block article ingestion.
- The requested model string is `gemini-3.1-flash-lite-preview`; if Google rejects it, article fetching still succeeds and analysis stays empty.

## UI

- List view shows the relevance score plus Gemini summary/importance when available.
- Detail view shows a dedicated analysis section with summary, why it matters, and opinion.

## Risks

- The requested Gemini model name was not verified in the public docs during implementation planning.
- Existing duplicate articles should be patched with fresh analysis instead of silently ignored.
