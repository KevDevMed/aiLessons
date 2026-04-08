import type { Doc } from '../../../../convex/_generated/dataModel';
import styles from './NewsApp.module.css';

type Article = Doc<'articles'>;

interface Props {
  articles: Article[] | undefined;
  onOpen: (article: Article) => void;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  if (diff < 60_000) return 'just now';
  const min = Math.floor(diff / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ArticleList({ articles, onOpen }: Props) {
  if (articles === undefined) {
    return <div className={styles.placeholder}>Loading articles…</div>;
  }

  if (articles.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📰</div>
        <h2 className={styles.emptyTitle}>No articles yet</h2>
        <p className={styles.emptyText}>
          Fresh business and AI news are fetched automatically once every 24 hours.
          Check back soon.
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {articles.map((a) => (
        <li
          key={a._id}
          className={styles.card}
          onClick={() => onOpen(a)}
          role="button"
          tabIndex={0}
        >
          {a.urlToImage ? (
            <img
              className={styles.cardImage}
              src={a.urlToImage}
              alt=""
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className={`${styles.cardImage} ${styles.cardImagePlaceholder}`}>📰</div>
          )}
          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{a.title}</h3>
            <div className={styles.cardMeta}>
              <span className={styles.cardSource}>{a.source}</span>
              <span className={styles.cardDot}>·</span>
              <span>{relativeTime(a.publishedAt)}</span>
              {typeof a.analysisScore === 'number' && (
                <>
                  <span className={styles.cardDot}>·</span>
                  <span className={styles.cardScore}>{a.analysisScore}/100 relevance</span>
                </>
              )}
            </div>
            {a.analysisSummary && <p className={styles.cardSummary}>{a.analysisSummary}</p>}
            {a.analysisWhyItMatters ? (
              <p className={styles.cardInsight}>{a.analysisWhyItMatters}</p>
            ) : (
              a.description && <p className={styles.cardDesc}>{a.description}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
