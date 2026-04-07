import { useEffect } from 'react';
import { useStartMenuStore } from '../stores/useStartMenuStore';
import { useWindowStore } from '../stores/useWindowStore';
import { useAppStore } from '../stores/useAppStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;

      // Alt+F4: close focused window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        const { activeWindowId, closeWindow } = useWindowStore.getState();
        if (activeWindowId) closeWindow(activeWindowId);
        return;
      }

      // Meta+D: show desktop / restore
      if (meta && e.key === 'd') {
        e.preventDefault();
        const store = useWindowStore.getState();
        const allMinimized = Object.values(store.windows).every((w) => w.isMinimized);
        if (allMinimized) {
          store.restoreAll();
        } else {
          store.minimizeAll();
        }
        return;
      }

      // Meta+E: open File Explorer
      if (meta && e.key === 'e') {
        e.preventDefault();
        useAppStore.getState().launchApp('file-explorer');
        return;
      }

      // Meta+ArrowLeft/Right: snap
      if (meta && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        const { activeWindowId, snapWindow } = useWindowStore.getState();
        if (activeWindowId) {
          snapWindow(activeWindowId, e.key === 'ArrowLeft' ? 'left' : 'right');
        }
        return;
      }

      // Meta+ArrowUp: maximize
      if (meta && e.key === 'ArrowUp') {
        e.preventDefault();
        const { activeWindowId, maximizeWindow } = useWindowStore.getState();
        if (activeWindowId) maximizeWindow(activeWindowId);
        return;
      }

      // Meta+ArrowDown: restore/minimize
      if (meta && e.key === 'ArrowDown') {
        e.preventDefault();
        const store = useWindowStore.getState();
        if (store.activeWindowId) {
          const win = store.windows[store.activeWindowId];
          if (win?.isMaximized) {
            store.unmaximizeWindow(store.activeWindowId);
          } else {
            store.minimizeWindow(store.activeWindowId);
          }
        }
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
