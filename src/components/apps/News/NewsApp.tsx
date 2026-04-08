import { useState, useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Tab, ArticleId } from './types';
import { TabStrip } from './TabStrip';
import { BrowserChrome } from './BrowserChrome';
import { ArticleList } from './ArticleList';
import { ArticleDetail } from './ArticleDetail';
import styles from './NewsApp.module.css';

const HOME_ID = 'home';

function makeTabId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function NewsApp() {
  const articles = useQuery(api.news.listArticles, { limit: 5 });

  const [tabs, setTabs] = useState<Tab[]>(() => [{ kind: 'home', id: HOME_ID }]);
  const [activeId, setActiveId] = useState<string>(HOME_ID);

  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  const openArticle = useCallback((articleId: ArticleId, title: string) => {
    setTabs((ts) => {
      const existing = ts.find(
        (t) => t.kind === 'article' && t.articleId === articleId,
      );
      if (existing) {
        setActiveId(existing.id);
        return ts;
      }
      const fresh: Tab = {
        kind: 'article',
        id: makeTabId(),
        articleId,
        title,
      };
      setActiveId(fresh.id);
      return [...ts, fresh];
    });
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      if (id === HOME_ID) return;
      setTabs((ts) => {
        const idx = ts.findIndex((t) => t.id === id);
        if (idx === -1) return ts;
        const filtered = ts.filter((t) => t.id !== id);
        if (id === activeId) {
          const next = filtered[Math.max(0, idx - 1)] ?? filtered[0];
          setActiveId(next.id);
        }
        return filtered;
      });
    },
    [activeId],
  );

  const address = useMemo(() => {
    if (activeTab.kind === 'home') return 'news://ai/latest';
    return `news://ai/article/${activeTab.articleId}`;
  }, [activeTab]);

  const selectedArticle = useMemo(() => {
    if (activeTab.kind !== 'article') return null;
    return articles?.find((a) => a._id === activeTab.articleId) ?? null;
  }, [activeTab, articles]);

  return (
    <div className={styles.news}>
      <TabStrip
        tabs={tabs}
        activeId={activeId}
        onSelect={setActiveId}
        onClose={closeTab}
      />
      <BrowserChrome address={address} />
      <div className={styles.content}>
        {activeTab.kind === 'home' ? (
          <ArticleList
            articles={articles}
            onOpen={(article) => openArticle(article._id, article.title)}
          />
        ) : (
          <ArticleDetail
            article={articles === undefined ? undefined : selectedArticle}
            onBack={() => setActiveId(HOME_ID)}
          />
        )}
      </div>
    </div>
  );
}
