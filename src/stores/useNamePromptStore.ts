import { create } from 'zustand';
import type { GameId, ScoreDetail } from '../utils/gameMeta';

type PendingSubmit = {
  gameId: GameId;
  score: number;
  detail?: ScoreDetail;
};

interface NamePromptStore {
  isOpen: boolean;
  pendingSubmit: PendingSubmit | null;

  open: () => void;
  close: () => void;
  setPendingSubmit: (submit: PendingSubmit | null) => void;
  consumePending: () => PendingSubmit | null;
}

export const useNamePromptStore = create<NamePromptStore>((set, get) => ({
  isOpen: false,
  pendingSubmit: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setPendingSubmit: (pendingSubmit) => set({ pendingSubmit }),
  consumePending: () => {
    const p = get().pendingSubmit;
    if (p) set({ pendingSubmit: null });
    return p;
  },
}));
