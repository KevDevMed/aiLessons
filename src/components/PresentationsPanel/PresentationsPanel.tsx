import { useState, useCallback, useRef } from 'react';
import styles from './PresentationsPanel.module.css';
import {
  presentationFolders,
  presentationDocuments,
  PresentationResource,
} from '../../data/presentationFolders';
import { useAppStore } from '../../stores/useAppStore';
import { AppProps } from '../../types/app';

type ViewMode = 'icons' | 'list';

const typeLabels: Record<string, string> = {
  presentation: 'Presentation',
  document: 'Document',
  tool: 'Application',
  link: 'Shortcut',
};

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

export default function PresentationsPanel({ windowId }: AppProps) {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('icons');
  const launchApp = useAppStore((s) => s.launchApp);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleAction(action: string) {
    const appStore = useAppStore.getState();
    if (action === 'launch:presentation') {
      appStore.launchApp('presentation');
    } else if (action === 'launch:presentation2') {
      appStore.launchApp('presentation2');
    } else if (action.startsWith('open-notepad:')) {
      const contentKey = action.replace('open-notepad:', '');
      const content = presentationDocuments[contentKey] || '';
      appStore.launchApp('notepad', { content });
    } else if (action.startsWith('open-media:')) {
      const fileName = action.replace('open-media:', '');
      appStore.launchApp('media-player', { fileName });
    } else if (action.startsWith('launch:')) {
      const appId = action.replace('launch:', '');
      appStore.launchApp(appId);
    }
  }

  const handleFolderClick = useCallback(
    (folderId: string) => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        setCurrentFolder(folderId);
        setSelectedItem(null);
      } else {
        setSelectedItem(folderId);
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
        }, 300);
      }
    },
    []
  );

  const handleFileClick = useCallback(
    (resource: PresentationResource) => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
        handleAction(resource.action);
      } else {
        setSelectedItem(resource.name);
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null;
        }, 300);
      }
    },
    []
  );

  const goBack = useCallback(() => {
    setCurrentFolder(null);
    setSelectedItem(null);
  }, []);

  const handleSidebarClick = useCallback((appId: string) => {
    launchApp(appId);
  }, [launchApp]);

  const folder = currentFolder
    ? presentationFolders.find((f) => f.id === currentFolder)
    : null;

  const pathText = currentFolder && folder
    ? `This PC > Lessons > ${folder.name}`
    : 'This PC > Lessons';

  return (
    <div className={styles.folder}>
      <div className={styles.toolbar}>
        <button
          className={styles.navBtn}
          disabled={!currentFolder}
          onClick={goBack}
          title="Back"
        >
          ←
        </button>
        <button className={styles.navBtn} disabled title="Forward">→</button>
        <button
          className={styles.navBtn}
          onClick={() => currentFolder ? goBack() : launchApp('file-explorer')}
          title="Up"
        >
          ↑
        </button>
        <div className={styles.pathBar}>{pathText}</div>
        <button
          className={`${styles.viewToggle} ${viewMode === 'icons' ? styles.viewToggleActive : ''}`}
          onClick={() => setViewMode('icons')}
          title="Icon view"
        >
          ⊞
        </button>
        <button
          className={`${styles.viewToggle} ${viewMode === 'list' ? styles.viewToggleActive : ''}`}
          onClick={() => setViewMode('list')}
          title="List view"
        >
          ☰
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          {sidebarItems.map((section) => (
            <div key={section.label} className={styles.sidebarSection}>
              <div
                className={styles.sidebarItem}
                onClick={() => handleSidebarClick(section.action)}
              >
                <span className={styles.sidebarIcon}>{section.icon}</span>
                <span>{section.label}</span>
              </div>
              {section.children?.map((child) => (
                <div
                  key={child.label}
                  className={styles.sidebarItem}
                  onClick={() => handleSidebarClick(child.action)}
                  style={{ paddingLeft: 32 }}
                >
                  <span className={styles.sidebarIcon}>{child.icon}</span>
                  <span>{child.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {currentFolder && folder ? (
          viewMode === 'icons' ? (
            <div className={styles.content}>
              <div className={styles.grid}>
                {folder.resources.map((resource) => (
                  <div
                    key={resource.name}
                    className={`${styles.item} ${selectedItem === resource.name ? styles.itemSelected : ''}`}
                    onClick={() => handleFileClick(resource)}
                  >
                    <span className={styles.icon}>{resource.icon}</span>
                    <span className={styles.name}>{resource.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.contentList}>
              <div className={styles.listHeader}>
                <span>Name</span>
                <span>Type</span>
                <span>Description</span>
              </div>
              {folder.resources.map((resource) => (
                <div
                  key={resource.name}
                  className={`${styles.listItem} ${selectedItem === resource.name ? styles.listItemSelected : ''}`}
                  onClick={() => handleFileClick(resource)}
                >
                  <div className={styles.listItemName}>
                    <span className={styles.listItemIcon}>{resource.icon}</span>
                    <span className={styles.listItemText}>{resource.name}</span>
                  </div>
                  <span className={styles.listItemMeta}>{typeLabels[resource.type] || resource.type}</span>
                  <span className={styles.listItemMeta}>{resource.description}</span>
                </div>
              ))}
            </div>
          )
        ) : (
          viewMode === 'icons' ? (
            <div className={styles.content}>
              <div className={styles.grid}>
                {presentationFolders.map((f) => (
                  <div
                    key={f.id}
                    className={`${styles.item} ${selectedItem === f.id ? styles.itemSelected : ''}`}
                    onClick={() => handleFolderClick(f.id)}
                  >
                    <span className={styles.icon}>📁</span>
                    <span className={styles.name}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.contentList}>
              <div className={styles.listHeader}>
                <span>Name</span>
                <span>Type</span>
                <span>Items</span>
              </div>
              {presentationFolders.map((f) => (
                <div
                  key={f.id}
                  className={`${styles.listItem} ${selectedItem === f.id ? styles.listItemSelected : ''}`}
                  onClick={() => handleFolderClick(f.id)}
                >
                  <div className={styles.listItemName}>
                    <span className={styles.listItemIcon}>📁</span>
                    <span className={styles.listItemText}>{f.name}</span>
                  </div>
                  <span className={styles.listItemMeta}>File folder</span>
                  <span className={styles.listItemMeta}>{f.resources.length} items</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
