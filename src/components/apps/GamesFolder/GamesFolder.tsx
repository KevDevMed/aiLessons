import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { AppProps } from '../../../types/app';
import styles from './GamesFolder.module.css';

type ViewMode = 'icons' | 'list';

const GAMES = [
  { id: 'snake', name: 'Snake', icon: '🐍', date: '3/10/2026 2:00 PM', size: '1.2 MB' },
  { id: 'tetris', name: 'Tetris', icon: '🧱', date: '3/10/2026 2:00 PM', size: '0.8 MB' },
  { id: 'brick-breaker', name: 'Brick Breaker', icon: '🏓', date: '3/10/2026 2:00 PM', size: '1.0 MB' },
  { id: 'doom', name: 'DOOM', icon: '💀', date: '3/10/2026 2:00 PM', size: '64 MB' },
  { id: 'flappy-bird', name: 'Flappy Bird', icon: '🐤', date: '3/10/2026 2:00 PM', size: '0.5 MB' },
  { id: 'leaderboards', name: 'Leaderboards', icon: '🏆', date: '4/9/2026 12:00 PM', size: '0.2 MB' },
];

const sidebarItems = [
  { label: 'Quick Access', icon: '⭐', action: 'file-explorer' },
  { label: 'This PC', icon: '💻', action: 'file-explorer', children: [
    { label: 'Desktop', icon: '🖥️', action: 'file-explorer' },
    { label: 'Documents', icon: '📄', action: 'file-explorer' },
    { label: 'Downloads', icon: '⬇️', action: 'file-explorer' },
    { label: 'Pictures', icon: '🖼️', action: 'file-explorer' },
    { label: 'Music', icon: '🎵', action: 'file-explorer' },
    { label: 'Videos', icon: '🎬', action: 'file-explorer' },
  ]},
  { label: 'Network', icon: '🌐', action: 'file-explorer' },
];

export function GamesFolder({ windowId }: AppProps) {
  const launchApp = useAppStore((s) => s.launchApp);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('icons');
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(
    (gameId: string) => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        launchApp(gameId);
      } else {
        setSelectedId(gameId);
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
        }, 300);
      }
    },
    [launchApp]
  );

  const handleSidebarClick = useCallback((appId: string) => {
    launchApp(appId);
  }, [launchApp]);

  return (
    <div className={styles.folder}>
      <div className={styles.toolbar}>
        <button className={styles.navBtn} disabled title="Back">←</button>
        <button className={styles.navBtn} disabled title="Forward">→</button>
        <button className={styles.navBtn} onClick={() => launchApp('file-explorer')} title="Up">↑</button>
        <div className={styles.pathBar}>This PC &gt; Games</div>
        <button
          className={`${styles.viewToggle} ${viewMode === 'icons' ? styles.viewToggleActive : ''}`}
          onClick={() => setViewMode('icons')}
          title="Icon view"
        >
          ⊞
        </button>
        <button
          className={`${styles.viewToggle} ${viewMode === 'list' ? styles.viewToggleActive : ''}`}
          onClick={() => setViewMode('list')}
          title="List view"
        >
          ☰
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          {sidebarItems.map((section) => (
            <div key={section.label} className={styles.sidebarSection}>
              <div
                className={styles.sidebarItem}
                onClick={() => handleSidebarClick(section.action)}
              >
                <span className={styles.sidebarIcon}>{section.icon}</span>
                <span>{section.label}</span>
              </div>
              {section.children?.map((child) => (
                <div
                  key={child.label}
                  className={styles.sidebarItem}
                  onClick={() => handleSidebarClick(child.action)}
                  style={{ paddingLeft: 32 }}
                >
                  <span className={styles.sidebarIcon}>{child.icon}</span>
                  <span>{child.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {viewMode === 'icons' ? (
          <div className={styles.content}>
            <div className={styles.grid}>
              {GAMES.map((game) => (
                <div
                  key={game.id}
                  className={`${styles.item} ${selectedId === game.id ? styles.itemSelected : ''}`}
                  onClick={() => handleClick(game.id)}
                >
                  <span className={styles.icon}>{game.icon}</span>
                  <span className={styles.name}>{game.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.contentList}>
            <div className={styles.listHeader}>
              <span>Name</span>
              <span>Date Modified</span>
              <span>Type</span>
              <span>Size</span>
            </div>
            {GAMES.map((game) => (
              <div
                key={game.id}
                className={`${styles.listItem} ${selectedId === game.id ? styles.listItemSelected : ''}`}
                onClick={() => handleClick(game.id)}
              >
                <div className={styles.listItemName}>
                  <span className={styles.listItemIcon}>{game.icon}</span>
                  <span className={styles.listItemText}>{game.name}</span>
                </div>
                <span className={styles.listItemMeta}>{game.date}</span>
                <span className={styles.listItemMeta}>Application</span>
                <span className={styles.listItemMeta}>{game.size}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
