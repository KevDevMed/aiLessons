import type { Id } from '../../../../convex/_generated/dataModel';

export type ArticleId = Id<'articles'>;

export type Tab =
  | { kind: 'home'; id: string }
  | { kind: 'article'; id: string; articleId: ArticleId; title: string };
