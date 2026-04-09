import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PlayerStore {
  deviceId: string | null;
  displayName: string | null;

  // Mints a UUID on first call if none exists. Returns the stable device id.
  ensureDeviceId: () => string;
  setDisplayName: (name: string) => void;
}

function mintDeviceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID.
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      deviceId: null,
      displayName: null,

      ensureDeviceId: () => {
        const current = get().deviceId;
        if (current) return current;
        const fresh = mintDeviceId();
        set({ deviceId: fresh });
        return fresh;
      },

      setDisplayName: (displayName) => set({ displayName }),
    }),
    {
      name: 'ailessons-player',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        deviceId: state.deviceId,
        displayName: state.displayName,
      }),
    }
  )
);
