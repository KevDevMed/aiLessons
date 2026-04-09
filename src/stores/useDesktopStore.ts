import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type IconSize = 'large' | 'medium' | 'small';
export type SortBy = 'name' | 'size' | 'type' | 'date';
export type PowerState = 'on' | 'sleeping' | 'restarting' | 'shuttingDown';

interface DesktopStore {
  iconSize: IconSize;
  sortBy: SortBy;
  accentColor: string;
  powerState: PowerState;
  iconPositions: Record<string, { x: number; y: number }>;
  deletedAppIds: string[];

  setIconSize: (size: IconSize) => void;
  setSortBy: (sort: SortBy) => void;
  setAccentColor: (color: string) => void;
  setPowerState: (state: PowerState) => void;
  setIconPosition: (appId: string, x: number, y: number) => void;
  clearIconPositions: () => void;
  deleteApp: (appId: string) => void;
  restoreApp: (appId: string) => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      iconSize: 'medium',
      sortBy: 'name',
      accentColor: '#0078D4',
      powerState: 'on',
      iconPositions: {},
      deletedAppIds: [],

      setIconSize: (iconSize) => set({ iconSize }),
      setSortBy: (sortBy) => set({ sortBy, iconPositions: {} }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setPowerState: (powerState) => set({ powerState }),
      setIconPosition: (appId, x, y) =>
        set((state) => ({
          iconPositions: { ...state.iconPositions, [appId]: { x, y } },
        })),
      clearIconPositions: () => set({ iconPositions: {} }),
      deleteApp: (appId) =>
        set((state) =>
          state.deletedAppIds.includes(appId)
            ? state
            : { deletedAppIds: [...state.deletedAppIds, appId] }
        ),
      restoreApp: (appId) =>
        set((state) => ({
          deletedAppIds: state.deletedAppIds.filter((id) => id !== appId),
        })),
    }),
    {
      name: 'ailessons-desktop',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        iconSize: state.iconSize,
        sortBy: state.sortBy,
        accentColor: state.accentColor,
        iconPositions: state.iconPositions,
        deletedAppIds: state.deletedAppIds,
        // powerState is intentionally not persisted
      }),
    }
  )
);
