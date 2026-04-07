import { useState, useCallback } from 'react';
import { AppProps } from '../../../types/app';
import { useAppStore } from '../../../stores/useAppStore';
import { useTrashStore, TrashItem } from '../../../stores/useTrashStore';
import styles from './RecycleBin.module.css';

const sidebarItems = [
  { label: 'Quick Access', icon: '⭐', action: 'file-explorer' },
  { label: 'This PC', icon: '💻', action: 'file-explorer', children: [
    { label: 'Desktop', icon: '🖥️', action: 'file-explorer' },
    { label: 'Documents', icon: '📄', action: 'file-explorer' },
    { label: 'Downloads', icon: '⬇️', action: 'file-explorer' },
    { label: 'Pictures', icon: '🖼️', action: 'file-explorer' },
    { label: 'Music', icon: '🎵', action: 'file-explorer' },
    { label: 'Videos', icon: '🎬', action: 'file-explorer' },
  ]},
  { label: 'Network', icon: '🌐', action: 'file-explorer' },
];

export function RecycleBin({ windowId }: AppProps) {
  const items = useTrashStore((s) => s.items);
  const removeItem = useTrashStore((s) => s.removeItem);
  const restoreItem = useTrashStore((s) => s.restoreItem);
  const emptyTrash = useTrashStore((s) => s.emptyTrash);
  const launchApp = useAppStore((s) => s.launchApp);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: TrashItem } | null>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent, item: TrashItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(item.id);
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleRestore = useCallback(() => {
    if (contextMenu) {
      restoreItem(contextMenu.item.id);
      setContextMenu(null);
      setSelectedId(null);
    }
  }, [contextMenu, restoreItem]);

  const handleOpen = useCallback(() => {
    if (contextMenu) {
      const item = contextMenu.item;
      if (item.fileContent) {
        launchApp('notepad', { content: item.fileContent });
      } else if (item.ext === 'exe') {
        launchApp('notepad', { content: `Cannot open "${item.name}"\n\nThis file type is not supported.` });
      } else if (!item.ext) {
        launchApp('notepad', { content: `[Empty Folder]\n\n"${item.name}" contains no viewable files.` });
      } else {
        launchApp('notepad', { content: `"${item.name}"\n\nNo preview available for this file.` });
      }
      setContextMenu(null);
    }
  }, [contextMenu, launchApp]);

  const handleDeletePermanently = useCallback(() => {
    if (contextMenu) {
      removeItem(contextMenu.item.id);
      setContextMenu(null);
      setSelectedId(null);
    }
  }, [contextMenu, removeItem]);

  const handleEmptyTrash = useCallback(() => {
    emptyTrash();
    setSelectedId(null);
  }, [emptyTrash]);

  const selectedItem = items.find((i) => i.id === selectedId);

  const handleSidebarClick = useCallback((appId: string) => {
    launchApp(appId);
  }, [launchApp]);

  return (
    <div className={styles.recycleBin} onClick={() => { setSelectedId(null); closeContextMenu(); }}>
      <div className={styles.toolbar} onClick={(e) => e.stopPropagation()}>
        <button className={styles.navBtn} disabled title="Back">←</button>
        <button className={styles.navBtn} disabled title="Forward">→</button>
        <button className={styles.navBtn} disabled title="Up">↑</button>
        <button
          className={styles.toolbarBtn}
          onClick={handleEmptyTrash}
          disabled={items.length === 0}
        >
          Empty Recycle Bin
        </button>
        <button
          className={styles.toolbarBtn}
          onClick={() => {
            if (selectedItem) {
              restoreItem(selectedItem.id);
              setSelectedId(null);
            }
          }}
          disabled={!selectedItem}
        >
          Restore
        </button>
        <div className={styles.pathBar}>Recycle Bin</div>
      </div>

      <div className={styles.body}>
        <div className={styles.sidebar}>
          {sidebarItems.map((section) => (
            <div key={section.label} className={styles.sidebarSection}>
              <div
                className={styles.sidebarItem}
                onClick={(e) => { e.stopPropagation(); handleSidebarClick(section.action); }}
              >
                <span className={styles.sidebarIcon}>{section.icon}</span>
                <span>{section.label}</span>
              </div>
              {section.children?.map((child) => (
                <div
                  key={child.label}
                  className={styles.sidebarItem}
                  onClick={(e) => { e.stopPropagation(); handleSidebarClick(child.action); }}
                  style={{ paddingLeft: 32 }}
                >
                  <span className={styles.sidebarIcon}>{child.icon}</span>
                  <span>{child.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.content} onContextMenu={(e) => e.preventDefault()}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🗑️</div>
              <div className={styles.emptyText}>Recycle Bin is empty</div>
            </div>
          ) : (
            <>
              <div className={styles.listHeader}>
                <span>Name</span>
                <span>Date Deleted</span>
                <span>Original Location</span>
                <span>Size</span>
              </div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.listItem} ${selectedId === item.id ? styles.listItemSelected : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(item.id);
                  }}
                  onDoubleClick={() => {
                    if (item.fileContent) {
                      launchApp('notepad', { content: item.fileContent });
                    } else if (!item.ext) {
                      launchApp('notepad', { content: `[Empty Folder]\n\n"${item.name}" contains no viewable files.` });
                    } else {
                      launchApp('notepad', { content: `"${item.name}"\n\nNo preview available for this file.` });
                    }
                  }}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <div className={styles.listItemName}>
                    <span className={styles.listItemIcon}>{item.icon}</span>
                    <span className={styles.listItemText}>{item.name}</span>
                  </div>
                  <span className={styles.listItemMeta}>{item.deletedAt}</span>
                  <span className={styles.listItemMeta}>{item.originalLocation}</span>
                  <span className={styles.listItemMeta}>{item.size}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className={styles.statusBar}>
        <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        {selectedItem && <span>Selected: {selectedItem.name}</span>}
      </div>

      {contextMenu && (
        <>
          <div className={styles.contextOverlay} onClick={closeContextMenu} onContextMenu={(e) => { e.preventDefault(); closeContextMenu(); }} />
          <div className={styles.contextMenu} style={{ left: contextMenu.x, top: contextMenu.y }}>
            <div className={styles.contextMenuItem} onClick={handleOpen}>
              Open
            </div>
            <div className={styles.contextDivider} />
            <div className={styles.contextMenuItem} onClick={handleRestore}>
              Restore
            </div>
            <div className={styles.contextDivider} />
            <div className={`${styles.contextMenuItem} ${styles.dangerItem}`} onClick={handleDeletePermanently}>
              Delete permanently
            </div>
          </div>
        </>
      )}
    </div>
  );
}
