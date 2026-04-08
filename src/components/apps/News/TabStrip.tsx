import type { Tab } from './types';
import styles from './NewsApp.module.css';

interface Props {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

function truncate(s: string, max = 24): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

function tabLabel(tab: Tab): string {
  return tab.kind === 'home' ? 'Home' : tab.title;
}

export function TabStrip({ tabs, activeId, onSelect, onClose }: Props) {
  return (
    <div className={styles.tabStrip}>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const closable = tab.kind !== 'home';
        return (
          <div
            key={tab.id}
            className={`${styles.tab} ${active ? styles.tabActive : ''}`}
            onClick={() => onSelect(tab.id)}
            role="button"
            tabIndex={0}
          >
            <span className={styles.tabIcon}>
              {tab.kind === 'home' ? '🏠' : '📰'}
            </span>
            <span className={styles.tabTitle}>{truncate(tabLabel(tab))}</span>
            {closable && (
              <button
                type="button"
                className={styles.tabClose}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                aria-label="Close tab"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
