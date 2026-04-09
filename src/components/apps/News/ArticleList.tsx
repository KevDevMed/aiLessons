import { useState } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import styles from './NewsApp.module.css';
import { useNewsCopy } from './copy';

type Article = Doc<'articles'>;

interface Props {
  articles: Article[] | undefined;
  onOpen: (article: Article) => void;
}

function relativeTime(iso: string, copy: ReturnType<typeof useNewsCopy>): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  if (diff < 60_000) return copy.now;
  const min = Math.floor(diff / 60_000);
  if (min < 60) return copy.minutesAgo(min);
  const hr = Math.floor(min / 60);
  if (hr < 24) return copy.hoursAgo(hr);
  const days = Math.floor(hr / 24);
  if (days < 30) return copy.daysAgo(days);
  return new Date(iso).toLocaleDateString(copy.locale);
}

export function ArticleList({ articles, onOpen }: Props) {
  const copy = useNewsCopy();

  if (articles === undefined) {
    return <div className={styles.placeholder}>{copy.loadingArticles}</div>;
  }

  if (articles.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📰</div>
        <h2 className={styles.emptyTitle}>{copy.noArticlesTitle}</h2>
        <p className={styles.emptyText}>{copy.noArticlesText}</p>
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
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpen(a);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <CardImage src={a.urlToImage} />
          <div className={styles.cardBody}>
            <h3 className={styles.cardTitle}>{a.title}</h3>
            <div className={styles.cardMeta}>
              <span className={styles.cardSource}>{a.source}</span>
              <span className={styles.cardDot}>·</span>
              <span>{relativeTime(a.publishedAt, copy)}</span>
              {typeof a.analysisScore === 'number' ? (
                <>
                  <span className={styles.cardDot}>·</span>
                  <span className={styles.cardScore}>
                    {copy.relevanceLabel(a.analysisScore)}
                  </span>
                </>
              ) : a.analysisError ? (
                <>
                  <span className={styles.cardDot}>·</span>
                  <span
                    className={styles.cardScoreMissing}
                    title={a.analysisError}
                  >
                    {copy.analysisUnavailableLabel}
                  </span>
                </>
              ) : null}
              {!!a.learningItems?.length && (
                <>
                  <span className={styles.cardDot}>·</span>
                  <span className={styles.cardLearningTag}>
                    {copy.cardLearningCount(a.learningItems.length)}
                  </span>
                </>
              )}
            </div>
            {a.learningSpanishSummary ? (
              <p className={styles.cardSpanishSummary}>{a.learningSpanishSummary}</p>
            ) : (
              a.analysisSummary && <p className={styles.cardSummary}>{a.analysisSummary}</p>
            )}
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

function CardImage({ src }: { src: string | undefined }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${styles.cardImage} ${styles.cardImagePlaceholder}`} aria-hidden>
        📰
      </div>
    );
  }
  return (
    <img
      className={styles.cardImage}
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
