import { create } from 'zustand';

interface StartMenuStore {
  isOpen: boolean;
  searchQuery: string;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setSearch: (q: string) => void;
}

export const useStartMenuStore = create<StartMenuStore>((set) => ({
  isOpen: false,
  searchQuery: '',
  toggle: () => set((s) => ({ isOpen: !s.isOpen, searchQuery: '' })),
  open: () => set({ isOpen: true, searchQuery: '' }),
  close: () => set({ isOpen: false, searchQuery: '' }),
  setSearch: (q) => set({ searchQuery: q }),
}));
