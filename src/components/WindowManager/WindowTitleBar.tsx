import { useCallback } from 'react';
import { useWindowStore } from '../../stores/useWindowStore';
import styles from './WindowTitleBar.module.css';

interface WindowTitleBarProps {
  windowId: string;
  title: string;
  icon: string;
  isFocused: boolean;
  isMaximized: boolean;
}

export default function WindowTitleBar({ windowId, title, icon, isFocused, isMaximized }: WindowTitleBarProps) {
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleMaximize(windowId);
    },
    [windowId, toggleMaximize]
  );

  return (
    <div className={styles.titleBar}>
      <div
        className={`${styles.dragArea} win-titlebar-drag`}
        onDoubleClick={handleDoubleClick}
      >
        <span className={styles.appIcon}>{icon}</span>
        <span className={`${styles.title} ${!isFocused ? styles.titleInactive : ''}`}>
          {title}
        </span>
      </div>
      <div className={styles.controls}>
        {/* Minimize */}
        <button
          className={styles.controlButton}
          onClick={(e) => {
            e.stopPropagation();
            minimizeWindow(windowId);
          }}
          aria-label="Minimize"
        >
          <svg className={styles.controlIcon} viewBox="0 0 10 10">
            <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>

        {/* Maximize / Restore */}
        <button
          className={styles.controlButton}
          onClick={(e) => {
            e.stopPropagation();
            toggleMaximize(windowId);
          }}
          aria-label={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? (
            <svg className={styles.controlIcon} viewBox="0 0 10 10">
              <rect x="2" y="0" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" />
              <rect x="0" y="2" width="8" height="8" fill="var(--win-bg-titlebar)" stroke="currentColor" strokeWidth="1" />
            </svg>
          ) : (
            <svg className={styles.controlIcon} viewBox="0 0 10 10">
              <rect x="0" y="0" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </button>

        {/* Close */}
        <button
          className={`${styles.controlButton} ${styles.closeButton}`}
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(windowId);
          }}
          aria-label="Close"
        >
          <svg className={styles.controlIcon} viewBox="0 0 10 10">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
