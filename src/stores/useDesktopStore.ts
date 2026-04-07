import { create } from 'zustand';

export type IconSize = 'large' | 'medium' | 'small';
export type SortBy = 'name' | 'size' | 'type' | 'date';
export type PowerState = 'on' | 'sleeping' | 'restarting' | 'shuttingDown';

interface DesktopStore {
  iconSize: IconSize;
  sortBy: SortBy;
  accentColor: string;
  powerState: PowerState;
  iconPositions: Record<string, { x: number; y: number }>;

  setIconSize: (size: IconSize) => void;
  setSortBy: (sort: SortBy) => void;
  setAccentColor: (color: string) => void;
  setPowerState: (state: PowerState) => void;
  setIconPosition: (appId: string, x: number, y: number) => void;
  clearIconPositions: () => void;
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  iconSize: 'medium',
  sortBy: 'name',
  accentColor: '#0078D4',
  powerState: 'on',
  iconPositions: {},

  setIconSize: (iconSize) => set({ iconSize }),
  setSortBy: (sortBy) => set({ sortBy, iconPositions: {} }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setPowerState: (powerState) => set({ powerState }),
  setIconPosition: (appId, x, y) =>
    set((state) => ({
      iconPositions: { ...state.iconPositions, [appId]: { x, y } },
    })),
  clearIconPositions: () => set({ iconPositions: {} }),
}));
