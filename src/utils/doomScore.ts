// Normalize Doom's multi-dimensional state (level reached, kills, completion
// status) into a single comparable score. Used by the leaderboard.
//
// Formula: level*1000 + (levelCompleted?500:0) + kills*50 + killPct*200
//
// - Level is the primary axis (a run that reached level 3 beats one at level 1).
// - Completing a level strictly beats dying in it at the same level number.
// - Kills give a continuous secondary axis so two runs at the same level/state
//   can still rank against each other.
// - killPct rewards thorough clears without dominating the score.

export function computeDoomScore(args: {
  level: number; // 1-based level number reached at end of run
  kills: number;
  totalEnemies: number;
  levelCompleted: boolean;
}): number {
  const safeLevel = Math.max(1, Math.floor(args.level));
  const levelBonus = (safeLevel - 1) * 1000;
  const completionBonus = args.levelCompleted ? 500 : 0;
  const killValue = Math.max(0, args.kills) * 50;
  const purityBonus =
    args.totalEnemies > 0
      ? Math.round((Math.max(0, args.kills) / args.totalEnemies) * 200)
      : 0;
  return levelBonus + completionBonus + killValue + purityBonus;
}
