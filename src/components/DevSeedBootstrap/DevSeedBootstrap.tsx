import { useEffect, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

/**
 * Fires `ensureDevSeeded` once on app mount so "Kevin the supreme dev" and
 * his target scores always exist. The server mutation is idempotent, so
 * React StrictMode double-invocation is harmless — we also guard with a ref
 * to avoid a second network round-trip.
 */
export function DevSeedBootstrap() {
  const ensureDevSeeded = useMutation(api.leaderboards.ensureDevSeeded);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    ensureDevSeeded({}).catch(() => {
      // Silently ignore — the leaderboard UI gracefully handles a missing
      // dev row by showing the default placeholder name.
    });
  }, [ensureDevSeeded]);

  return null;
}
