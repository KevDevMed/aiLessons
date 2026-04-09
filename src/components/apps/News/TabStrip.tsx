import type { Tab } from './types';
import styles from './NewsApp.module.css';
import { useNewsCopy } from './copy';

interface Props {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

function truncate(s: string, max = 24): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export function TabStrip({ tabs, activeId, onSelect, onClose }: Props) {
  const copy = useNewsCopy();
  const tabLabel = (tab: Tab): string =>
    tab.kind === 'home' ? copy.tabHome : tab.title;
  return (
    <div className={styles.tabStrip} role="tablist">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        const closable = tab.kind !== 'home';
        return (
          <div
            key={tab.id}
            className={`${styles.tab} ${active ? styles.tabActive : ''}`}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(tab.id);
                return;
              }
              if (
                closable &&
                (event.key === 'Delete' ||
                  event.key === 'Backspace' ||
                  (event.key.toLowerCase() === 'w' && (event.ctrlKey || event.metaKey)))
              ) {
                event.preventDefault();
                onClose(tab.id);
              }
            }}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
          >
            <span className={styles.tabIcon} aria-hidden>
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
                aria-label={copy.tabCloseAria(tabLabel(tab))}
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
