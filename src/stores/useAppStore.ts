import { create } from 'zustand';
import { AppDefinition, TileSize } from '../types/app';
import { useWindowStore } from './useWindowStore';

interface AppStore {
  registry: Record<string, AppDefinition>;
  pinnedTaskbar: string[];
  pinnedTiles: Array<{ appId: string; size: TileSize }>;

  registerApp: (def: AppDefinition) => void;
  launchApp: (appId: string, initialData?: Record<string, unknown>) => void;
  getRunningApps: () => string[];
}

let windowCounter = 0;

export const useAppStore = create<AppStore>((set, get) => ({
  registry: {},
  pinnedTaskbar: ['file-explorer', 'notepad', 'calculator', 'terminal'],
  pinnedTiles: [
    { appId: 'file-explorer', size: 'medium' },
    { appId: 'notepad', size: 'medium' },
    { appId: 'calculator', size: 'small' },
    { appId: 'settings', size: 'medium' },
    { appId: 'terminal', size: 'medium' },
  ],

  registerApp: (def) => {
    set((state) => ({
      registry: { ...state.registry, [def.id]: def },
    }));
  },

  launchApp: (appId, initialData) => {
    const { registry } = get();
    const def = registry[appId];
    if (!def) return;

    const windowStore = useWindowStore.getState();

    // For singleton apps, focus existing window
    if (def.singleton) {
      const existing = Object.values(windowStore.windows).find((w) => w.appId === appId);
      if (existing) {
        if (existing.isMinimized) {
          windowStore.restoreWindow(existing.id);
        } else {
          windowStore.focusWindow(existing.id);
        }
        return;
      }
    }

    windowCounter++;
    const windowId = `${appId}-${windowCounter}`;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight - 40;
    const x = Math.max(20, (screenW - def.defaultWidth) / 2 + (windowCounter % 5) * 20);
    const y = Math.max(20, (screenH - def.defaultHeight) / 2 + (windowCounter % 5) * 20);

    windowStore.openWindow({
      id: windowId,
      appId,
      title: def.name,
      icon: def.icon,
      x,
      y,
      width: def.defaultWidth,
      height: def.defaultHeight,
      minWidth: def.minWidth,
      minHeight: def.minHeight,
      isMinimized: false,
      isMaximized: false,
      isSnapped: null,
      savedRect: null,
      initialData,
    });
  },

  getRunningApps: () => {
    const windows = useWindowStore.getState().windows;
    const running = new Set<string>();
    Object.values(windows).forEach((w) => running.add(w.appId));
    return Array.from(running);
  },
}));
