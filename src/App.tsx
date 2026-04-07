import { useEffect } from 'react';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import WindowLayer from './components/WindowManager/WindowLayer';
import ContextMenu from './components/ContextMenu/ContextMenu';
import PowerOverlay from './components/PowerOverlay/PowerOverlay';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppStore } from './stores/useAppStore';
import { useDesktopStore } from './stores/useDesktopStore';
import { useStartMenuStore } from './stores/useStartMenuStore';
import { APP_REGISTRY } from './utils/appRegistry';
import { applyAccentColor } from './utils/colorUtils';

function App() {
  useKeyboardShortcuts();

  // Register all apps on mount
  useEffect(() => {
    const registerApp = useAppStore.getState().registerApp;
    Object.values(APP_REGISTRY).forEach((def) => {
      registerApp(def);
    });
  }, []);

  // Apply stored accent color on mount
  useEffect(() => {
    const color = useDesktopStore.getState().accentColor;
    applyAccentColor(color);
  }, []);

  // Close start menu on click outside
  const handleClick = () => {
    const { isOpen, close } = useStartMenuStore.getState();
    if (isOpen) close();
  };

  return (
    <div
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
      onClick={handleClick}
    >
      <Desktop />
      <WindowLayer />
      <StartMenu />
      <Taskbar />
      <ContextMenu />
      <PowerOverlay />
    </div>
  );
}

export default App;
