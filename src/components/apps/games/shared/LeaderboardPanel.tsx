import { useMemo } from 'react';
import { useAppStore } from '../../../../stores/useAppStore';
import { usePlayerStore } from '../../../../stores/usePlayerStore';
import { useSubmitScore } from '../../../../hooks/useSubmitScore';
import type { GameId } from '../../../../utils/gameMeta';
import styles from './LeaderboardPanel.module.css';

interface Props {
  gameId: GameId;
  /** Number of top rows to show. Defaults to 5. */
  topRowCount?: number;
}

/**
 * Compact leaderboard panel rendered inside each game's game-over overlay.
 * Shows: personal best + rank, Kevin's target + beat-the-dev flag, top-N rows
 * with the dev highlighted, and a link to open the full Leaderboards app.
 */
export function LeaderboardPanel({ gameId, topRowCount = 5 }: Props) {
  const { beatDev, playerBest, topRows } = useSubmitScore(gameId);
  const launchApp = useAppStore((s) => s.launchApp);
  const deviceDisplayName = usePlayerStore((s) => s.displayName);

  const visibleRows = useMemo(
    () => (topRows ?? []).slice(0, topRowCount),
    [topRows, topRowCount],
  );

  const playerBeatDev = beatDev?.playerBeatDev ?? false;
  const devScore = beatDev?.devScore ?? null;
  const devName = beatDev?.devDisplayName ?? 'Kevin the supreme dev';

  return (
    <div className={styles.panel}>
      <div className={styles.statRow}>
        <div className={styles.stat}>
          <div className={styles.label}>Your best</div>
          <div className={styles.value}>
            {playerBest ? playerBest.score : '—'}
            {playerBest?.rank != null && (
              <span className={styles.rank}>#{playerBest.rank}</span>
            )}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.label}>👑 {devName}</div>
          <div className={styles.value}>{devScore ?? '—'}</div>
        </div>
      </div>

      <div
        className={`${styles.beatFlag} ${
          playerBeatDev ? styles.beatFlagWin : styles.beatFlagGoal
        }`}
      >
        {playerBeatDev ? 'BEAT THE DEV ✓' : 'BEAT THE DEV →'}
      </div>

      {visibleRows.length > 0 && (
        <div className={styles.table}>
          {visibleRows.map((row) => {
            const isYou =
              !row.isDev &&
              deviceDisplayName != null &&
              row.displayName === deviceDisplayName;
            return (
              <div
                key={row.playerId}
                className={`${styles.row} ${row.isDev ? styles.rowDev : ''} ${
                  isYou ? styles.rowYou : ''
                }`}
              >
                <span className={styles.rowRank}>#{row.rank}</span>
                <span className={styles.rowName}>
                  {row.isDev && <span className={styles.crown}>👑</span>}
                  {row.displayName}
                </span>
                <span className={styles.rowScore}>{row.score}</span>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className={styles.openBtn}
        onClick={() => launchApp('leaderboards')}
      >
        View full leaderboards
      </button>
    </div>
  );
}
