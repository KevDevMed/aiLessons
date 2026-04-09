import { useState, useCallback, useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { useMenuStore } from '../../stores/useMenuStore';
import { useStartMenuStore } from '../../stores/useStartMenuStore';
import { useDesktopStore, IconSize } from '../../stores/useDesktopStore';
import { useTrashStore } from '../../stores/useTrashStore';
import DesktopIcon from './DesktopIcon';
import styles from './Desktop.module.css';

const CELL_SIZES: Record<IconSize, { w: number; h: number }> = {
  large: { w: 104, h: 104 },
  medium: { w: 84, h: 88 },
  small: { w: 64, h: 72 },
};

function getDefaultPosition(index: number, iconSize: IconSize): { x: number; y: number } {
  const cell = CELL_SIZES[iconSize];
  const margin = 12;
  const desktopHeight = window.innerHeight - 40 - margin * 2;
  const maxRows = Math.max(1, Math.floor(desktopHeight / cell.h));
  const col = Math.floor(index / maxRows);
  const row = index % maxRows;
  return {
    x: margin + col * cell.w,
    y: margin + row * cell.h,
  };
}

export default function Desktop() {
  const registry = useAppStore((s) => s.registry);
  const launchApp = useAppStore((s) => s.launchApp);
  const showMenu = useMenuStore((s) => s.show);
  const closeStartMenu = useStartMenuStore((s) => s.close);
  const iconSize = useDesktopStore((s) => s.iconSize);
  const sortBy = useDesktopStore((s) => s.sortBy);
  const setIconSize = useDesktopStore((s) => s.setIconSize);
  const setSortBy = useDesktopStore((s) => s.setSortBy);
  const iconPositions = useDesktopStore((s) => s.iconPositions);
  const setIconPosition = useDesktopStore((s) => s.setIconPosition);
  const deletedAppIds = useDesktopStore((s) => s.deletedAppIds);
  const deleteApp = useDesktopStore((s) => s.deleteApp);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const desktopApps = useMemo(() => {
    const apps = Object.values(registry).filter(
      (a) => !a.hiddenFromDesktop && !deletedAppIds.includes(a.id)
    );
    switch (sortBy) {
      case 'name':
        return apps.sort((a, b) => a.name.localeCompare(b.name));
      case 'type':
        return apps.sort((a, b) => a.id.localeCompare(b.id));
      case 'size':
        return apps.sort((a, b) => (b.defaultWidth * b.defaultHeight) - (a.defaultWidth * a.defaultHeight));
      case 'date':
        return apps.sort((a, b) => b.id.localeCompare(a.id));
      default:
        return apps;
    }
  }, [registry, sortBy, deletedAppIds]);

  const handleIconContextMenu = useCallback(
    (e: React.MouseEvent, appId: string, appName: string, appIcon: string) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedAppId(appId);
      const isRecycleBin = appId === 'recycle-bin';
      const menuItems = [
        {
          id: 'open',
          label: 'Open',
          icon: '',
          action: () => launchApp(appId),
        },
        { id: 'div-icon-1', label: '', divider: true },
      ];
      if (isRecycleBin) {
        menuItems.push({
          id: 'empty-trash',
          label: 'Empty Recycle Bin',
          icon: '',
          action: () => useTrashStore.getState().emptyTrash(),
        });
      } else {
        menuItems.push({
          id: 'delete',
          label: 'Delete',
          icon: '',
          action: () => {
            const now = new Date();
            const dateStr = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
            useTrashStore.getState().addItem({
              id: `trash-app-${appId}-${Date.now()}`,
              name: appName,
              icon: appIcon,
              type: 'app',
              deletedAt: dateStr,
              originalLocation: 'Desktop',
              size: '—',
              appId,
            });
            deleteApp(appId);
            setSelectedAppId(null);
          },
        });
      }
      showMenu(e.clientX, e.clientY, menuItems);
    },
    [launchApp, showMenu, deleteApp]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      showMenu(e.clientX, e.clientY, [
        {
          id: 'view',
          label: 'View',
          icon: '',
          children: [
            { id: 'large-icons', label: `Large icons${iconSize === 'large' ? ' ✓' : ''}`, action: () => setIconSize('large') },
            { id: 'medium-icons', label: `Medium icons${iconSize === 'medium' ? ' ✓' : ''}`, action: () => setIconSize('medium') },
            { id: 'small-icons', label: `Small icons${iconSize === 'small' ? ' ✓' : ''}`, action: () => setIconSize('small') },
          ],
        },
        {
          id: 'sort',
          label: 'Sort by',
          icon: '',
          children: [
            { id: 'sort-name', label: `Name${sortBy === 'name' ? ' ✓' : ''}`, action: () => setSortBy('name') },
            { id: 'sort-size', label: `Size${sortBy === 'size' ? ' ✓' : ''}`, action: () => setSortBy('size') },
            { id: 'sort-type', label: `Item type${sortBy === 'type' ? ' ✓' : ''}`, action: () => setSortBy('type') },
            { id: 'sort-date', label: `Date modified${sortBy === 'date' ? ' ✓' : ''}`, action: () => setSortBy('date') },
          ],
        },
        { id: 'div-1', label: '', divider: true },
        {
          id: 'refresh',
          label: 'Refresh',
          icon: '',
          action: () => window.location.reload(),
        },
        { id: 'div-2', label: '', divider: true },
        {
          id: 'display',
          label: 'Display settings',
          icon: '',
          action: () => launchApp('settings'),
        },
        {
          id: 'personalize',
          label: 'Personalize',
          icon: '',
          action: () => launchApp('settings'),
        },
      ]);
    },
    [showMenu, launchApp, iconSize, sortBy, setIconSize, setSortBy]
  );

  const handleClick = useCallback(() => {
    setSelectedAppId(null);
    closeStartMenu();
  }, [closeStartMenu]);

  // Stable per-icon callbacks: each takes appId as an argument so the same
  // function reference can serve every icon. DesktopIcon is memoized and
  // partially-applies these in its own handlers.
  const handleIconSelect = useCallback((appId: string) => {
    setSelectedAppId(appId);
  }, []);

  const handleIconLaunch = useCallback(
    (appId: string) => {
      launchApp(appId);
      setSelectedAppId(null);
    },
    [launchApp]
  );

  const handleIconDragEnd = useCallback(
    (appId: string, x: number, y: number) => {
      setIconPosition(appId, x, y);
    },
    [setIconPosition]
  );

  return (
    <div className={styles.desktop} onContextMenu={handleContextMenu} onClick={handleClick}>
      <div className={styles.iconGrid}>
        {desktopApps.map((app, index) => {
          const pos = iconPositions[app.id] || getDefaultPosition(index, iconSize);
          return (
            <DesktopIcon
              key={app.id}
              appId={app.id}
              icon={app.icon}
              label={app.name}
              selected={selectedAppId === app.id}
              iconSize={iconSize}
              x={pos.x}
              y={pos.y}
              onSelect={handleIconSelect}
              onLaunch={handleIconLaunch}
              onDragEnd={handleIconDragEnd}
              onContextMenu={handleIconContextMenu}
            />
          );
        })}
      </div>
    </div>
  );
}
