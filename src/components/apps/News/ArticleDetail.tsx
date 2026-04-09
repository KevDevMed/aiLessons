import { useState } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import styles from './NewsApp.module.css';
import { useNewsCopy } from './copy';

type Article = Doc<'articles'>;
type LearningItem = NonNullable<Article['learningItems']>[number];

interface Props {
  article: Article | null | undefined;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: Props) {
  const copy = useNewsCopy();

  if (article === undefined) {
    return <div className={styles.placeholder}>{copy.loadingArticles}</div>;
  }
  if (article === null) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h2 className={styles.emptyTitle}>{copy.articleNotFoundTitle}</h2>
        <p className={styles.emptyText}>{copy.articleNotFoundText}</p>
        <button type="button" className={styles.fetchBtn} onClick={onBack}>
          {copy.back}
        </button>
      </div>
    );
  }

  const learningItems = article.learningItems ?? [];

  return (
    <article className={styles.detail}>
      {article.urlToImage && <DetailImage src={article.urlToImage} />}
      <h1 className={styles.detailTitle}>{article.title}</h1>
      <div className={styles.detailMeta}>
        <strong>{article.source}</strong>
        {article.author && <span> · {article.author}</span>}
        <span> · {new Date(article.publishedAt).toLocaleString(copy.locale)}</span>
      </div>
      {(article.learningSpanishSummary || learningItems.length > 0) && (
        <section className={styles.lessonBox}>
          <div className={styles.lessonHeader}>
            <div className={styles.lessonIntro}>
              <h2 className={styles.lessonTitle}>{copy.guidedReadingTitle}</h2>
              <p className={styles.lessonSubtitle}>{copy.guidedReadingSubtitle}</p>
            </div>
            {learningItems.length > 0 && (
              <span className={styles.lessonCount}>
                {copy.learningItemsCount(learningItems.length)}
              </span>
            )}
          </div>
          {article.learningSpanishSummary && (
            <div className={styles.lessonSummaryBox}>
              <div className={styles.lessonSectionLabel}>{copy.summaryLabel}</div>
              <p className={styles.lessonSummary}>{article.learningSpanishSummary}</p>
            </div>
          )}
          {learningItems.length > 0 && (
            <section className={styles.lessonItemsSection}>
              <div className={styles.lessonSectionLabel}>{copy.vocabularyTitle}</div>
              <div className={styles.lessonGrid}>
                {learningItems.map((item, index) => (
                  <LessonCard key={`${item.english}-${index}`} item={item} />
                ))}
              </div>
            </section>
          )}
        </section>
      )}
      {(article.analysisSummary || article.analysisWhyItMatters || article.analysisOpinion) && (
        <section className={styles.analysisBox}>
          <div className={styles.analysisHeader}>
            <h2 className={styles.analysisTitle}>{copy.analysisTitle}</h2>
            {typeof article.analysisScore === 'number' && (
              <span className={styles.analysisScore}>
                {copy.relevanceLabel(article.analysisScore)}
              </span>
            )}
          </div>
          {article.analysisSummary && (
            <p className={styles.analysisRow}>
              <strong>{copy.analysisSummaryLabel}:</strong> {article.analysisSummary}
            </p>
          )}
          {article.analysisWhyItMatters && (
            <p className={styles.analysisRow}>
              <strong>{copy.whyItMattersLabel}:</strong> {article.analysisWhyItMatters}
            </p>
          )}
          {article.analysisOpinion && (
            <p className={styles.analysisRow}>
              <strong>{copy.opinionLabel}:</strong> {article.analysisOpinion}
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
        {copy.openOriginal}
      </a>
    </article>
  );

  function LessonCard({ item }: { item: LearningItem }) {
    return (
      <article className={styles.lessonCard}>
        <div className={styles.lessonCardHeader}>
          <h3 className={styles.lessonWord}>{item.english}</h3>
          <span className={styles.lessonKind}>{copy.kindLabel(item.kind)}</span>
        </div>
        {item.pronunciationHint && (
          <p className={styles.lessonMeta}>
            <strong>{copy.pronunciationLabel}:</strong> {item.pronunciationHint}
          </p>
        )}
        <p className={styles.lessonMeta}>
          <strong>{copy.meaningLabel}:</strong> {item.spanishMeaning}
        </p>
        <p className={styles.lessonMeta}>
          <strong>{copy.usageLabel}:</strong> {item.spanishExplanation}
        </p>
        {(item.articleExample || item.exampleTranslation) && (
          <div className={styles.lessonExampleBox}>
            {item.articleExample && (
              <p className={styles.lessonExample}>
                <strong>{copy.inArticleLabel}:</strong> "{item.articleExample}"
              </p>
            )}
            {item.exampleTranslation && (
              <p className={styles.lessonExampleTranslation}>
                <strong>{copy.translationLabel}:</strong> {item.exampleTranslation}
              </p>
            )}
          </div>
        )}
      </article>
    );
  }
}

function DetailImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt=""
      className={styles.detailImage}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
