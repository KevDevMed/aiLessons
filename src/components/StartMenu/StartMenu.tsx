import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { useStartMenuStore } from '../../stores/useStartMenuStore';
import { useDesktopStore } from '../../stores/useDesktopStore';
import styles from './StartMenu.module.css';

export default function StartMenu() {
  const isOpen = useStartMenuStore((s) => s.isOpen);
  const close = useStartMenuStore((s) => s.close);
  const registry = useAppStore((s) => s.registry);
  const pinnedTiles = useAppStore((s) => s.pinnedTiles);
  const launchApp = useAppStore((s) => s.launchApp);

  const [powerMenuOpen, setPowerMenuOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    },
    [isOpen, close]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleLaunch = useCallback(
    (appId: string) => {
      launchApp(appId);
      close();
    },
    [launchApp, close]
  );

  // Sort apps alphabetically and group by first letter
  const appGroups = useMemo(() => {
    const apps = Object.values(registry).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const groups: Record<string, typeof apps> = {};
    apps.forEach((app) => {
      const letter = app.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(app);
    });
    return groups;
  }, [registry]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={close} />
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.body}>
          {/* App list column */}
          <div className={styles.appListColumn}>
            {Object.entries(appGroups).map(([letter, apps]) => (
              <div key={letter}>
                <div className={styles.letterHeader}>{letter}</div>
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className={styles.appItem}
                    onClick={() => handleLaunch(app.id)}
                  >
                    <span className={styles.appItemIcon}>{app.icon}</span>
                    <span className={styles.appItemName}>{app.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Tiles column */}
          <div className={styles.tilesColumn}>
            <div className={styles.tilesGrid}>
              {pinnedTiles.map((tile) => {
                const app = registry[tile.appId];
                if (!app) return null;

                let sizeClass = styles.tileMedium;
                if (tile.size === 'small') sizeClass = styles.tileSmall;
                else if (tile.size === 'wide') sizeClass = styles.tileWide;
                else if (tile.size === 'large') sizeClass = styles.tileLarge;

                return (
                  <div
                    key={tile.appId}
                    className={`${styles.tile} ${sizeClass}`}
                    onClick={() => handleLaunch(tile.appId)}
                  >
                    <span className={styles.tileIcon}>{app.icon}</span>
                    {tile.size !== 'small' && (
                      <span className={styles.tileName}>{app.name}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <div style={{ position: 'relative' }}>
            <button
              className={styles.powerButton}
              title="Power"
              onClick={(e) => {
                e.stopPropagation();
                setPowerMenuOpen((prev) => !prev);
              }}
            >
              <svg
                className={styles.powerIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </button>
            {powerMenuOpen && (
              <div className={styles.powerMenu} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.powerMenuItem}
                  onClick={() => {
                    useDesktopStore.getState().setPowerState('sleeping');
                    setPowerMenuOpen(false);
                    close();
                  }}
                >
                  <span className={styles.powerMenuIcon}>🌙</span>
                  <span>Sleep</span>
                </button>
                <button
                  className={styles.powerMenuItem}
                  onClick={() => {
                    useDesktopStore.getState().setPowerState('restarting');
                    setPowerMenuOpen(false);
                    close();
                  }}
                >
                  <span className={styles.powerMenuIcon}>🔄</span>
                  <span>Restart</span>
                </button>
                <button
                  className={styles.powerMenuItem}
                  onClick={() => {
                    useDesktopStore.getState().setPowerState('shuttingDown');
                    setPowerMenuOpen(false);
                    close();
                  }}
                >
                  <span className={styles.powerMenuIcon}>⏻</span>
                  <span>Shut down</span>
                </button>
              </div>
            )}
          </div>
          <div className={styles.userArea}>
            <div className={styles.userAvatar}>U</div>
            <span className={styles.userName}>User</span>
          </div>
        </div>
      </div>
    </>
  );
}
