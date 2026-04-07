import { useState, useCallback, useRef } from 'react';
import { useAppStore } from '../../../stores/useAppStore';
import { AppProps } from '../../../types/app';
import styles from './GamesFolder.module.css';

const GAMES = [
  { id: 'snake', name: 'Snake', icon: '🐍' },
  { id: 'tetris', name: 'Tetris', icon: '🧱' },
  { id: 'brick-breaker', name: 'Brick Breaker', icon: '🏓' },
  { id: 'doom', name: 'DOOM', icon: '💀' },
];

export function GamesFolder({ windowId }: AppProps) {
  const launchApp = useAppStore((s) => s.launchApp);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  return (
    <div className={styles.folder}>
      <div className={styles.toolbar}>
        <div className={styles.pathBar}>Games</div>
      </div>
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
    </div>
  );
}
