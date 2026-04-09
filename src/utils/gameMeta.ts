// Single source of truth for the set of games that have leaderboards.
// Keep in sync with the gameIdValidator in convex/schema.ts.

export const GAME_IDS = [
  'snake',
  'tetris',
  'brick-breaker',
  'flappy-bird',
  'doom',
] as const;

export type GameId = (typeof GAME_IDS)[number];

export const GAME_META: Record<GameId, { name: string; icon: string }> = {
  snake: { name: 'Snake', icon: '🐍' },
  tetris: { name: 'Tetris', icon: '🧱' },
  'brick-breaker': { name: 'Brick Breaker', icon: '🏓' },
  'flappy-bird': { name: 'Flappy Bird', icon: '🐤' },
  doom: { name: 'DOOM', icon: '💀' },
};

export type ScoreDetail = {
  level?: number;
  lines?: number;
  lives?: number;
  kills?: number;
  totalEnemies?: number;
  killPct?: number;
  levelCompleted?: boolean;
};
