import { useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useNamePromptStore } from '../stores/useNamePromptStore';
import type { GameId, ScoreDetail } from '../utils/gameMeta';

/**
 * Shared hook used by every game to submit scores and subscribe to the
 * relevant leaderboard queries.
 *
 * On the first submission per device (when no display name has been chosen
 * yet) the hook buffers the pending submission and opens the name prompt
 * modal. The modal is responsible for calling `registerOrUpdatePlayer`,
 * persisting the name, and flushing the buffered submission.
 */
export function useSubmitScore(gameId: GameId) {
  const deviceId = usePlayerStore((s) => s.ensureDeviceId());
  const displayName = usePlayerStore((s) => s.displayName);

  const submit = useMutation(api.leaderboards.submitScore);

  const beatDev = useQuery(api.leaderboards.getBeatDevStatus, {
    deviceId,
    gameId,
  });
  const playerBest = useQuery(api.leaderboards.getPlayerBest, {
    deviceId,
    gameId,
  });
  const topRows = useQuery(api.leaderboards.getLeaderboard, {
    gameId,
    limit: 10,
  });

  const submitScore = useCallback(
    async (score: number, detail?: ScoreDetail) => {
      if (!displayName) {
        useNamePromptStore.getState().setPendingSubmit({ gameId, score, detail });
        useNamePromptStore.getState().open();
        return;
      }
      try {
        await submit({ deviceId, gameId, score, detail });
      } catch {
        // Swallow errors — games must not crash on leaderboard failures.
      }
    },
    [submit, deviceId, gameId, displayName],
  );

  return { submitScore, beatDev, playerBest, topRows };
}
