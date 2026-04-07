import { useAppStore } from '../../stores/useAppStore';
import { useWindowStore } from '../../stores/useWindowStore';
import styles from './TaskbarApps.module.css';

export default function TaskbarApps() {
  const registry = useAppStore((s) => s.registry);
  const pinnedTaskbar = useAppStore((s) => s.pinnedTaskbar);
  const launchApp = useAppStore((s) => s.launchApp);
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  const windowList = Object.values(windows);
  const runningAppIds = new Set(windowList.map((w) => w.appId));

  // Combine pinned + non-pinned running apps
  const pinnedSet = new Set(pinnedTaskbar);
  const nonPinnedRunning = [...runningAppIds].filter((id) => !pinnedSet.has(id));
  const allAppIds = [...pinnedTaskbar, ...nonPinnedRunning];

  const handleClick = (appId: string) => {
    const appWindows = windowList.filter((w) => w.appId === appId);

    if (appWindows.length === 0) {
      launchApp(appId);
      return;
    }

    const focused = appWindows.find((w) => w.isFocused && !w.isMinimized);
    if (focused) {
      minimizeWindow(focused.id);
      return;
    }

    const minimized = appWindows.find((w) => w.isMinimized);
    if (minimized) {
      restoreWindow(minimized.id);
      return;
    }

    // Running but not focused, focus the first one
    focusWindow(appWindows[0].id);
  };

  return (
    <div className={styles.container}>
      {allAppIds.map((appId) => {
        const app = registry[appId];
        if (!app) return null;

        const appWindows = windowList.filter((w) => w.appId === appId);
        const isRunning = appWindows.length > 0;
        const isFocused = appWindows.some((w) => w.isFocused && !w.isMinimized);

        return (
          <button
            key={appId}
            className={`${styles.appButton} ${isFocused ? styles.focused : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(appId);
            }}
            title={app.name}
          >
            <span>{app.icon}</span>
            {isRunning && (
              <span
                className={`${styles.indicator} ${isFocused ? styles.focusedIndicator : ''}`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
