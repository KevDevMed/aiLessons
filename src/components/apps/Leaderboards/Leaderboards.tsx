import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { AppProps } from '../../../types/app';
import { usePlayerStore } from '../../../stores/usePlayerStore';
import { GAME_IDS, GAME_META, type GameId, type ScoreDetail } from '../../../utils/gameMeta';
import styles from './Leaderboards.module.css';

type LeaderboardRow = {
  rank: number;
  playerId: string;
  displayName: string;
  isDev: boolean;
  score: number;
  detail: ScoreDetail | null;
  updatedAt: number;
};

function formatDetail(gameId: GameId, detail: ScoreDetail | null): string {
  if (!detail) return '';
  switch (gameId) {
    case 'tetris': {
      const parts: string[] = [];
      if (detail.level != null) parts.push(`L${detail.level}`);
      if (detail.lines != null) parts.push(`${detail.lines} lines`);
      return parts.join(' · ');
    }
    case 'brick-breaker': {
      const parts: string[] = [];
      if (detail.level != null) parts.push(`L${detail.level}`);
      return parts.join(' · ');
    }
    case 'doom': {
      const parts: string[] = [];
      if (detail.level != null) parts.push(`L${detail.level}`);
      if (detail.kills != null && detail.totalEnemies != null) {
        parts.push(`${detail.kills}/${detail.totalEnemies}`);
      }
      if (detail.levelCompleted) parts.push('✓');
      return parts.join(' · ');
    }
    default:
      return '';
  }
}

export function Leaderboards({ windowId: _windowId }: AppProps) {
  const [selectedGame, setSelectedGame] = useState<GameId>('snake');
  const deviceDisplayName = usePlayerStore((s) => s.displayName);
  const deviceId = usePlayerStore((s) => s.deviceId);

  const board = useQuery(api.leaderboards.getLeaderboard, {
    gameId: selectedGame,
    limit: 20,
  });
  const beatDev = useQuery(
    api.leaderboards.getBeatDevStatus,
    deviceId ? { deviceId, gameId: selectedGame } : 'skip',
  );

  const rows: LeaderboardRow[] = (board as LeaderboardRow[] | undefined) ?? [];
  const meta = GAME_META[selectedGame];
  const beatWin = beatDev?.playerBeatDev ?? false;

  return (
    <div className={styles.app}>
      <div className={styles.toolbar}>
        <div className={styles.titleBar}>
          <span className={styles.trophy}>🏆</span>
          <span>Leaderboards</span>
        </div>
        <div className={styles.breadcrumb}>
          Games &gt; {meta.name}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarLabel}>Games</div>
          {GAME_IDS.map((id) => {
            const m = GAME_META[id];
            const active = id === selectedGame;
            return (
              <button
                key={id}
                type="button"
                className={`${styles.sidebarItem} ${active ? styles.sidebarItemActive : ''}`}
                onClick={() => setSelectedGame(id)}
              >
                <span className={styles.sidebarIcon}>{m.icon}</span>
                <span className={styles.sidebarName}>{m.name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <div className={styles.gameTitle}>
                <span className={styles.gameIcon}>{meta.icon}</span>
                {meta.name}
              </div>
              <div className={styles.gameSub}>Top 20 — higher is better</div>
            </div>
            <div
              className={`${styles.beatBanner} ${
                beatWin ? styles.beatBannerWin : styles.beatBannerGoal
              }`}
            >
              <div className={styles.beatLabel}>Beat the dev</div>
              <div className={styles.beatValue}>
                {beatDev?.devScore != null
                  ? `Kevin: ${beatDev.devScore}`
                  : 'Kevin: —'}
              </div>
              <div className={styles.beatFlag}>
                {beatWin ? 'DEFEATED ✓' : 'CHALLENGE →'}
              </div>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <div className={styles.tableHeader}>
              <span>Rank</span>
              <span>Player</span>
              <span>Details</span>
              <span className={styles.scoreCol}>Score</span>
            </div>
            {board === undefined && (
              <div className={styles.empty}>Loading…</div>
            )}
            {board !== undefined && rows.length === 0 && (
              <div className={styles.empty}>
                No scores yet. Play {meta.name} to be the first!
              </div>
            )}
            {rows.map((row) => {
              const isYou =
                !row.isDev &&
                deviceDisplayName != null &&
                row.displayName === deviceDisplayName;
              const detail = formatDetail(selectedGame, row.detail);
              return (
                <div
                  key={row.playerId}
                  className={`${styles.tableRow} ${
                    row.isDev ? styles.tableRowDev : ''
                  } ${isYou ? styles.tableRowYou : ''}`}
                >
                  <span className={styles.rankCell}>#{row.rank}</span>
                  <span className={styles.nameCell}>
                    {row.isDev && <span className={styles.crown}>👑</span>}
                    {row.displayName}
                    {isYou && <span className={styles.youTag}>YOU</span>}
                  </span>
                  <span className={styles.detailCell}>{detail}</span>
                  <span className={styles.scoreCell}>{row.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
