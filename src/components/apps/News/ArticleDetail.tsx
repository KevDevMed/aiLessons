import type { Doc } from '../../../../convex/_generated/dataModel';
import styles from './NewsApp.module.css';

type Article = Doc<'articles'>;

interface Props {
  article: Article | null | undefined;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: Props) {
  if (article === undefined) {
    return <div className={styles.placeholder}>Loading…</div>;
  }
  if (article === null) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h2 className={styles.emptyTitle}>Article not found</h2>
        <p className={styles.emptyText}>This article may have been removed.</p>
        <button type="button" className={styles.fetchBtn} onClick={onBack}>
          ‹ Back
        </button>
      </div>
    );
  }

  return (
    <article className={styles.detail}>
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          alt=""
          className={styles.detailImage}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <h1 className={styles.detailTitle}>{article.title}</h1>
      <div className={styles.detailMeta}>
        <strong>{article.source}</strong>
        {article.author && <span> · {article.author}</span>}
        <span> · {new Date(article.publishedAt).toLocaleString()}</span>
      </div>
      {(article.analysisSummary || article.analysisWhyItMatters || article.analysisOpinion) && (
        <section className={styles.analysisBox}>
          <div className={styles.analysisHeader}>
            <h2 className={styles.analysisTitle}>AI analysis</h2>
            {typeof article.analysisScore === 'number' && (
              <span className={styles.analysisScore}>{article.analysisScore}/100 relevance</span>
            )}
          </div>
          {article.analysisSummary && (
            <p className={styles.analysisRow}>
              <strong>Summary:</strong> {article.analysisSummary}
            </p>
          )}
          {article.analysisWhyItMatters && (
            <p className={styles.analysisRow}>
              <strong>Why it matters:</strong> {article.analysisWhyItMatters}
            </p>
          )}
          {article.analysisOpinion && (
            <p className={styles.analysisRow}>
              <strong>Opinion:</strong> {article.analysisOpinion}
            </p>
          )}
        </section>
      )}
      {article.description && (
        <p className={styles.detailLede}>{article.description}</p>
      )}
      {article.content && (
        <p className={styles.detailContent}>{article.content}</p>
      )}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.openLink}
      >
        Open original article →
      </a>
    </article>
  );
}
