import { useState, useCallback, useRef } from 'react';
import styles from './PresentationsPanel.module.css';
import {
  presentationFolders,
  presentationDocuments,
  PresentationResource,
} from '../../data/presentationFolders';
import { useAppStore } from '../../stores/useAppStore';
import { AppProps } from '../../types/app';

export default function PresentationsPanel({ windowId }: AppProps) {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleAction(action: string) {
    const appStore = useAppStore.getState();
    if (action === 'launch:presentation') {
      appStore.launchApp('presentation');
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

  const folder = currentFolder
    ? presentationFolders.find((f) => f.id === currentFolder)
    : null;

  return (
    <div className={styles.explorer}>
      {currentFolder && folder ? (
        <>
          <div className={styles.toolbar}>
            <button className={styles.navBtn} onClick={goBack} title="Back">
              ←
            </button>
            <div className={styles.pathBar}>
              Lessons &gt; {folder.name}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.grid}>
              {folder.resources.map((resource) => (
                <div
                  key={resource.name}
                  className={`${styles.fileItem} ${selectedItem === resource.name ? styles.fileItemSelected : ''}`}
                  onClick={() => handleFileClick(resource)}
                >
                  <span className={styles.fileIcon}>{resource.icon}</span>
                  <span className={styles.fileName}>{resource.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.toolbar}>
            <div className={styles.pathBar}>Lessons</div>
          </div>
          <div className={styles.content}>
            <div className={styles.grid}>
              {presentationFolders.map((f) => (
                <div
                  key={f.id}
                  className={`${styles.fileItem} ${selectedItem === f.id ? styles.fileItemSelected : ''}`}
                  onClick={() => handleFolderClick(f.id)}
                >
                  <span className={styles.fileIcon}>📁</span>
                  <span className={styles.fileName}>{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
