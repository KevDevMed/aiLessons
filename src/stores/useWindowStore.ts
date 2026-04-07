import { create } from 'zustand';
import { WindowState, SnapZone } from '../types/window';

interface WindowStore {
  windows: Record<string, WindowState>;
  order: string[];
  activeWindowId: string | null;

  openWindow: (config: Omit<WindowState, 'isFocused'> & { initialData?: Record<string, unknown> }) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  unmaximizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  snapWindow: (id: string, zone: SnapZone) => void;
  minimizeAll: () => void;
  restoreAll: () => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  order: [],
  activeWindowId: null,

  openWindow: (config) => {
    set((state) => {
      if (state.windows[config.id]) {
        // Already exists, just focus
        return state;
      }
      const newWindows = {
        ...state.windows,
        [config.id]: { ...config, isFocused: true },
      };
      // Unfocus all others
      Object.keys(newWindows).forEach((key) => {
        if (key !== config.id) {
          newWindows[key] = { ...newWindows[key], isFocused: false };
        }
      });
      return {
        windows: newWindows,
        order: [...state.order, config.id],
        activeWindowId: config.id,
      };
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const { [id]: _, ...rest } = state.windows;
      const newOrder = state.order.filter((wid) => wid !== id);
      const newActiveId = newOrder.length > 0 ? newOrder[newOrder.length - 1] : null;
      // Focus the new top window
      if (newActiveId && rest[newActiveId]) {
        rest[newActiveId] = { ...rest[newActiveId], isFocused: true };
      }
      return {
        windows: rest,
        order: newOrder,
        activeWindowId: newActiveId,
      };
    });
  },

  focusWindow: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;

      const newOrder = [...state.order.filter((wid) => wid !== id), id];
      const newWindows = { ...state.windows };
      Object.keys(newWindows).forEach((key) => {
        newWindows[key] = { ...newWindows[key], isFocused: key === id };
      });
      return {
        windows: newWindows,
        order: newOrder,
        activeWindowId: id,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win || win.isMinimized) return state;

      const newWindows = {
        ...state.windows,
        [id]: { ...win, isMinimized: true, isFocused: false },
      };
      // Focus next window in order
      const remaining = state.order.filter(
        (wid) => wid !== id && !state.windows[wid]?.isMinimized
      );
      const newActiveId = remaining.length > 0 ? remaining[remaining.length - 1] : null;
      if (newActiveId && newWindows[newActiveId]) {
        newWindows[newActiveId] = { ...newWindows[newActiveId], isFocused: true };
      }
      return {
        windows: newWindows,
        activeWindowId: newActiveId,
      };
    });
  },

  restoreWindow: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;

      const newWindows = { ...state.windows };
      Object.keys(newWindows).forEach((key) => {
        newWindows[key] = { ...newWindows[key], isFocused: key === id };
      });
      newWindows[id] = { ...newWindows[id], isMinimized: false, isFocused: true };

      const newOrder = [...state.order.filter((wid) => wid !== id), id];
      return {
        windows: newWindows,
        order: newOrder,
        activeWindowId: id,
      };
    });
  },

  maximizeWindow: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win || win.isMaximized) return state;

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isMaximized: true,
            isSnapped: null,
            savedRect: { x: win.x, y: win.y, width: win.width, height: win.height },
          },
        },
      };
    });
  },

  unmaximizeWindow: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win || !win.isMaximized) return state;

      const rect = win.savedRect || { x: 100, y: 100, width: 800, height: 600 };
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isMaximized: false,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            savedRect: null,
          },
        },
      };
    });
  },

  toggleMaximize: (id) => {
    const win = get().windows[id];
    if (!win) return;
    if (win.isMaximized) {
      get().unmaximizeWindow(id);
    } else {
      get().maximizeWindow(id);
    }
  },

  moveWindow: (id, x, y) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, x, y },
        },
      };
    });
  },

  resizeWindow: (id, width, height) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      return {
        windows: {
          ...state.windows,
          [id]: { ...win, width, height },
        },
      };
    });
  },

  snapWindow: (id, zone) => {
    if (!zone) return;
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight - 40; // taskbar

      const savedRect = win.savedRect || { x: win.x, y: win.y, width: win.width, height: win.height };

      let x = 0, y = 0, width = screenW, height = screenH;

      switch (zone) {
        case 'left':
          width = screenW / 2;
          break;
        case 'right':
          x = screenW / 2;
          width = screenW / 2;
          break;
        case 'top':
          // maximize
          break;
        case 'top-left':
          width = screenW / 2;
          height = screenH / 2;
          break;
        case 'top-right':
          x = screenW / 2;
          width = screenW / 2;
          height = screenH / 2;
          break;
        case 'bottom-left':
          y = screenH / 2;
          width = screenW / 2;
          height = screenH / 2;
          break;
        case 'bottom-right':
          x = screenW / 2;
          y = screenH / 2;
          width = screenW / 2;
          height = screenH / 2;
          break;
      }

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...win,
            isSnapped: zone,
            isMaximized: zone === 'top',
            savedRect,
            x, y, width, height,
          },
        },
      };
    });
  },

  minimizeAll: () => {
    set((state) => {
      const newWindows = { ...state.windows };
      Object.keys(newWindows).forEach((key) => {
        newWindows[key] = { ...newWindows[key], isMinimized: true, isFocused: false };
      });
      return { windows: newWindows, activeWindowId: null };
    });
  },

  restoreAll: () => {
    set((state) => {
      const newWindows = { ...state.windows };
      Object.keys(newWindows).forEach((key) => {
        newWindows[key] = { ...newWindows[key], isMinimized: false };
      });
      const last = state.order[state.order.length - 1];
      if (last && newWindows[last]) {
        newWindows[last] = { ...newWindows[last], isFocused: true };
      }
      return { windows: newWindows, activeWindowId: last || null };
    });
  },
}));
