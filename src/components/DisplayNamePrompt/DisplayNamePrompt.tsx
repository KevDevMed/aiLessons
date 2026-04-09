import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useNamePromptStore } from '../../stores/useNamePromptStore';
import styles from './DisplayNamePrompt.module.css';

const MAX_NAME_LEN = 20;

export function DisplayNamePrompt() {
  const isOpen = useNamePromptStore((s) => s.isOpen);
  const closePrompt = useNamePromptStore((s) => s.close);
  const consumePending = useNamePromptStore((s) => s.consumePending);

  const ensureDeviceId = usePlayerStore((s) => s.ensureDeviceId);
  const setDisplayName = usePlayerStore((s) => s.setDisplayName);

  const registerPlayer = useMutation(api.leaderboards.registerOrUpdatePlayer);
  const submitScore = useMutation(api.leaderboards.submitScore);

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setError(null);
      setBusy(false);
      // Defer focus to the next frame so the modal is mounted.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const handleSave = useCallback(async () => {
    const trimmed = value.trim();
    if (trimmed.length < 1) {
      setError('Please enter a name.');
      return;
    }
    if (trimmed.length > MAX_NAME_LEN) {
      setError(`Name must be ${MAX_NAME_LEN} characters or fewer.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const deviceId = ensureDeviceId();
      await registerPlayer({ deviceId, displayName: trimmed });
      setDisplayName(trimmed);
      const pending = consumePending();
      if (pending) {
        try {
          await submitScore({
            deviceId,
            gameId: pending.gameId,
            score: pending.score,
            detail: pending.detail,
          });
        } catch {
          // Swallow: leaderboard write failures should not block the prompt.
        }
      }
      closePrompt();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save name.');
      setBusy(false);
    }
  }, [
    value,
    ensureDeviceId,
    registerPlayer,
    setDisplayName,
    consumePending,
    submitScore,
    closePrompt,
  ]);

  const handleCancel = useCallback(() => {
    consumePending();
    closePrompt();
  }, [consumePending, closePrompt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!busy) void handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    },
    [busy, handleSave, handleCancel],
  );

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.dialog}>
        <div className={styles.header}>Pick a player name</div>
        <div className={styles.body}>
          <p className={styles.lead}>
            This is how your score will appear on the leaderboards.
            You can change it later from any game's Game Over screen.
          </p>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={value}
            maxLength={MAX_NAME_LEN}
            placeholder="Your name"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={busy}
          />
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSave}
            disabled={busy}
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
