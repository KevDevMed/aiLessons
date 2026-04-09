import { memo, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowStore } from '../../stores/useWindowStore';
import { useAppStore } from '../../stores/useAppStore';
import WindowTitleBar from './WindowTitleBar';
import styles from './Window.module.css';

interface WindowProps {
  windowId: string;
  zIndex: number;
}

function WindowInner({ windowId, zIndex }: WindowProps) {
  const win = useWindowStore((s) => s.windows[windowId]);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const resizeWindow = useWindowStore((s) => s.resizeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  // Subscribe to just this app's definition so registering new apps doesn't
  // re-render every open window. Assigning the component to a local keeps
  // the lint rule about "components created during render" happy.
  const appDef = useAppStore((s) => (win ? s.registry[win.appId] : undefined));
  const AppComponent = appDef?.component;

  const rndPosition = useMemo(
    () =>
      win?.isMaximized
        ? { x: 0, y: 0 }
        : { x: win?.x ?? 0, y: win?.y ?? 0 },
    [win?.isMaximized, win?.x, win?.y]
  );

  const rndSize = useMemo(
    () =>
      win?.isMaximized
        ? { width: '100%', height: '100%' }
        : { width: win?.width ?? 0, height: win?.height ?? 0 },
    [win?.isMaximized, win?.width, win?.height]
  );

  if (!win || win.isMinimized) return null;

  return (
    <Rnd
      position={rndPosition}
      size={rndSize}
      minWidth={win.minWidth}
      minHeight={win.minHeight}
      dragHandleClassName="win-titlebar-drag"
      enableResizing={!win.isMaximized}
      disableDragging={win.isMaximized}
      onDragStop={(_e, d) => moveWindow(win.id, d.x, d.y)}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        resizeWindow(win.id, ref.offsetWidth, ref.offsetHeight);
        moveWindow(win.id, pos.x, pos.y);
      }}
      onMouseDown={() => focusWindow(win.id)}
      style={{ zIndex }}
      bounds="parent"
    >
      <div
        className={`${styles.window} ${win.isFocused ? styles.focused : styles.unfocused}`}
        style={{ width: '100%', height: '100%' }}
      >
        <WindowTitleBar
          windowId={win.id}
          title={win.title}
          icon={win.icon}
          isFocused={win.isFocused}
          isMaximized={win.isMaximized}
        />
        <div className={styles.content}>
          {AppComponent && <AppComponent windowId={win.id} />}
        </div>
      </div>
    </Rnd>
  );
}

const Window = memo(WindowInner);
export default Window;
