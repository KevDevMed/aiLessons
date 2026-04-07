import { useState, useCallback, useMemo } from 'react';
import { AppProps } from '../../../types/app';
import { useAppStore } from '../../../stores/useAppStore';
import { useTrashStore } from '../../../stores/useTrashStore';
import styles from './FileExplorer.module.css';

type ViewMode = 'icons' | 'list';

interface FsItem {
  name: string;
  type: 'folder' | 'file';
  ext?: string;
  appId?: string;
  customIcon?: string;
}

const mockFs: Record<string, FsItem[]> = {
  'This PC': [
    { name: 'Desktop', type: 'folder' },
    { name: 'Documents', type: 'folder' },
    { name: 'Downloads', type: 'folder' },
    { name: 'Pictures', type: 'folder' },
    { name: 'Music', type: 'folder' },
    { name: 'Videos', type: 'folder' },
  ],
  'Documents': [
    { name: 'Work', type: 'folder' },
    { name: 'Projects', type: 'folder' },
    { name: 'notes.txt', type: 'file', ext: 'txt' },
    { name: 'readme.txt', type: 'file', ext: 'txt' },
    { name: 'report.xlsx', type: 'file', ext: 'xlsx' },
    { name: 'resume.pdf', type: 'file', ext: 'pdf' },
    { name: 'letter.docx', type: 'file', ext: 'docx' },
  ],
  'Downloads': [
    { name: 'installer.exe', type: 'file', ext: 'exe' },
    { name: 'archive.zip', type: 'file', ext: 'zip' },
  ],
  'Pictures': [
    { name: 'Screenshots', type: 'folder' },
    { name: 'Vacation', type: 'folder' },
    { name: 'wallpaper.png', type: 'file', ext: 'png' },
    { name: 'profile-photo.jpg', type: 'file', ext: 'jpg' },
  ],
  'Music': [
    { name: 'playlist.m3u', type: 'file', ext: 'm3u' },
    { name: 'Bohemian Rhapsody.mp3', type: 'file', ext: 'mp3' },
    { name: 'Hotel California.mp3', type: 'file', ext: 'mp3' },
    { name: 'Stairway to Heaven.flac', type: 'file', ext: 'flac' },
    { name: 'Take On Me.wav', type: 'file', ext: 'wav' },
  ],
  'Videos': [
    { name: 'tutorial.mp4', type: 'file', ext: 'mp4' },
    { name: 'screen-recording.mp4', type: 'file', ext: 'mp4' },
  ],
  'Projects': [
    { name: 'my-app', type: 'folder' },
    { name: 'website', type: 'folder' },
    { name: 'README.md', type: 'file', ext: 'md' },
  ],
  'my-app': [
    { name: 'index.ts', type: 'file', ext: 'ts' },
    { name: 'package.json', type: 'file', ext: 'json' },
  ],
  'website': [
    { name: 'index.html', type: 'file', ext: 'html' },
    { name: 'styles.css', type: 'file', ext: 'css' },
  ],
  'Work': [
    { name: 'quarterly-report.xlsx', type: 'file', ext: 'xlsx' },
    { name: 'meeting-notes.txt', type: 'file', ext: 'txt' },
    { name: 'budget.xlsx', type: 'file', ext: 'xlsx' },
  ],
  'Screenshots': [
    { name: 'screenshot-01.png', type: 'file', ext: 'png' },
    { name: 'screenshot-02.png', type: 'file', ext: 'png' },
  ],
  'Vacation': [
    { name: 'beach-sunset.jpg', type: 'file', ext: 'jpg' },
    { name: 'mountain-view.jpg', type: 'file', ext: 'jpg' },
  ],
};

const mockFileContent: Record<string, string> = {
  'readme.txt': 'Welcome to SecondSession Desktop!\nThis is a Windows 10 simulation built for educational purposes.',
  'notes.txt': 'Meeting notes:\n- Review project timeline\n- Discuss AI tools integration\n- Set up development environments',
  'meeting-notes.txt': 'Q4 Planning Meeting\n\nAttendees: Team Lead, Dev 1, Dev 2\n\n- Budget review: approved\n- Team allocation: 3 devs on AI tools\n- Deadline: end of quarter',
  'README.md': '# My App\n\nA sample project created during the AI Tools workshop.\n\n## Getting Started\n\nnpm install\nnpm start',
  'index.ts': 'console.log("Hello from my-app!");\n\nexport function main() {\n  return "Hello World";\n}',
  'package.json': '{\n  "name": "my-app",\n  "version": "1.0.0",\n  "main": "index.ts"\n}',
  'index.html': '<!DOCTYPE html>\n<html>\n<head><title>My Website</title></head>\n<body>\n  <h1>Welcome</h1>\n</body>\n</html>',
  'styles.css': 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
  'playlist.m3u': '#EXTM3U\n#EXTINF:180,Song 1\nsong1.mp3\n#EXTINF:240,Song 2\nsong2.mp3',
  'resume.pdf': '[PDF Document — resume.pdf]\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nJohn Smith\nSoftware Engineer\n\nExperience:\n  2020–Present  Senior Developer at TechCorp\n  2018–2020     Developer at StartupXYZ\n\nEducation:\n  B.S. Computer Science, State University\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPages: 2  |  Size: 156 KB',
  'letter.docx': '[Word Document — letter.docx]\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nDear Hiring Manager,\n\nI am writing to express my interest in the\nSoftware Engineer position at your company.\n\nWith five years of experience in full-stack\ndevelopment, I am confident I would be a\nstrong addition to your team.\n\nBest regards,\nJohn Smith\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPages: 1  |  Size: 24 KB',
};

const mockFileSizes: Record<string, string> = {
  'Desktop': '—', 'Documents': '—', 'Downloads': '—', 'Pictures': '—', 'Music': '—', 'Videos': '—',
  'Work': '—', 'Projects': '—', 'Screenshots': '—', 'Vacation': '—', 'my-app': '—', 'website': '—',
  'notes.txt': '0.2 KB', 'readme.txt': '0.1 KB', 'report.xlsx': '245 KB', 'resume.pdf': '156 KB',
  'letter.docx': '24 KB', 'installer.exe': '48.3 MB', 'archive.zip': '12.7 MB',
  'wallpaper.png': '2.4 MB', 'profile-photo.jpg': '1.8 MB',
  'playlist.m3u': '0.1 KB', 'Bohemian Rhapsody.mp3': '8.2 MB', 'Hotel California.mp3': '9.1 MB',
  'Stairway to Heaven.flac': '42.5 MB', 'Take On Me.wav': '35.1 MB',
  'tutorial.mp4': '128 MB', 'screen-recording.mp4': '67 MB',
  'README.md': '0.1 KB', 'index.ts': '0.1 KB', 'package.json': '0.1 KB',
  'index.html': '0.1 KB', 'styles.css': '0.1 KB',
  'quarterly-report.xlsx': '312 KB', 'meeting-notes.txt': '0.3 KB', 'budget.xlsx': '189 KB',
  'screenshot-01.png': '1.2 MB', 'screenshot-02.png': '1.5 MB',
  'beach-sunset.jpg': '3.4 MB', 'mountain-view.jpg': '4.1 MB',
};

const mockFileDates: Record<string, string> = {
  'Desktop': '4/7/2026 8:00 AM', 'Documents': '4/5/2026 3:12 PM', 'Downloads': '4/6/2026 11:45 AM',
  'Pictures': '3/28/2026 5:30 PM', 'Music': '3/15/2026 9:22 AM', 'Videos': '3/20/2026 2:00 PM',
  'Work': '4/4/2026 6:01 PM', 'Projects': '4/3/2026 10:15 AM',
  'Screenshots': '3/25/2026 4:44 PM', 'Vacation': '2/14/2026 7:30 PM',
  'my-app': '4/1/2026 11:00 AM', 'website': '3/30/2026 3:30 PM',
  'notes.txt': '4/5/2026 2:30 PM', 'readme.txt': '3/10/2026 9:00 AM',
  'report.xlsx': '4/2/2026 4:15 PM', 'resume.pdf': '1/15/2026 10:00 AM',
  'letter.docx': '1/20/2026 11:30 AM', 'installer.exe': '4/6/2026 11:45 AM',
  'archive.zip': '4/1/2026 8:20 AM',
  'wallpaper.png': '3/5/2026 12:00 PM', 'profile-photo.jpg': '2/28/2026 3:00 PM',
  'playlist.m3u': '3/10/2026 7:00 PM', 'Bohemian Rhapsody.mp3': '1/1/2026 12:00 AM',
  'Hotel California.mp3': '1/1/2026 12:00 AM', 'Stairway to Heaven.flac': '1/1/2026 12:00 AM',
  'Take On Me.wav': '1/1/2026 12:00 AM',
  'tutorial.mp4': '3/18/2026 1:00 PM', 'screen-recording.mp4': '3/20/2026 2:00 PM',
  'README.md': '4/3/2026 10:30 AM', 'index.ts': '4/1/2026 11:15 AM',
  'package.json': '4/1/2026 11:00 AM', 'index.html': '3/30/2026 3:45 PM',
  'styles.css': '3/30/2026 4:00 PM',
  'quarterly-report.xlsx': '4/4/2026 5:30 PM', 'meeting-notes.txt': '4/4/2026 6:01 PM',
  'budget.xlsx': '4/2/2026 9:00 AM',
  'screenshot-01.png': '3/22/2026 10:10 AM', 'screenshot-02.png': '3/25/2026 4:44 PM',
  'beach-sunset.jpg': '2/10/2026 6:45 PM', 'mountain-view.jpg': '2/12/2026 8:30 AM',
};

// Map Windows-style paths from trash items to FileExplorer folder keys
function trashLocationToFolder(loc: string): string {
  const map: Record<string, string> = {
    'C:\\Users\\Me\\Desktop': 'Desktop',
    'C:\\Users\\Me\\Documents': 'Documents',
    'C:\\Users\\Me\\Documents\\Work': 'Work',
    'C:\\Users\\Me\\Downloads': 'Downloads',
    'C:\\Users\\Me\\Pictures': 'Pictures',
    'C:\\Users\\Me\\Music': 'Music',
    'C:\\Users\\Me\\Videos': 'Videos',
  };
  return map[loc] || 'Documents';
}

function getIcon(item: FsItem): string {
  if (item.customIcon) return item.customIcon;
  if (item.type === 'folder') return '📁';
  switch (item.ext) {
    case 'txt': return '📄';
    case 'md': return '📝';
    case 'xlsx': return '📊';
    case 'exe': return '⚙️';
    case 'zip': return '🗜️';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp': return '🖼️';
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'webm': return '🎬';
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'ogg':
    case 'aac':
    case 'm3u': return '🎵';
    case 'pdf': return '📕';
    case 'docx':
    case 'doc': return '📘';
    case 'ts':
    case 'js': return '📜';
    case 'json': return '⚙️';
    case 'css': return '🎨';
    case 'html': return '🌐';
    default: return '📄';
  }
}

const sidebarItems = [
  { label: 'Quick Access', icon: '⭐', path: 'This PC' },
  { label: 'This PC', icon: '💻', path: 'This PC', children: [
    { label: 'Desktop', icon: '🖥️', path: 'Desktop' },
    { label: 'Documents', icon: '📄', path: 'Documents' },
    { label: 'Downloads', icon: '⬇️', path: 'Downloads' },
    { label: 'Pictures', icon: '🖼️', path: 'Pictures' },
    { label: 'Music', icon: '🎵', path: 'Music' },
    { label: 'Videos', icon: '🎬', path: 'Videos' },
  ]},
  { label: 'Network', icon: '🌐', path: 'This PC' },
];

const HIDDEN_IDS = ['presentation', 'spreadsheet', 'image-viewer', 'media-player'];

export function FileExplorer({ windowId }: AppProps) {
  const registry = useAppStore((s) => s.registry);
  const restoredItems = useTrashStore((s) => s.restoredItems);
  const [currentPath, setCurrentPath] = useState('This PC');
  const [history, setHistory] = useState<string[]>(['This PC']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('icons');
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const navigateTo = useCallback((path: string) => {
    setCurrentPath(path);
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(path);
      return newHistory;
    });
    setHistoryIndex((i) => i + 1);
  }, [historyIndex]);

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const goUp = useCallback(() => {
    if (currentPath !== 'This PC') {
      navigateTo('This PC');
    }
  }, [currentPath, navigateTo]);

  const handleItemDblClick = useCallback((item: FsItem) => {
    if (item.appId) {
      const appStore = useAppStore.getState();
      appStore.launchApp(item.appId);
      return;
    }
    if (item.type === 'folder' && mockFs[item.name]) {
      navigateTo(item.name);
      return;
    }
    if (item.type === 'file') {
      const appStore = useAppStore.getState();
      // Check if this is a restored trash item with its own content
      const restored = restoredItems.find((r) => r.name === item.name);
      const content = mockFileContent[item.name] || restored?.fileContent;
      const textExts = ['txt', 'md', 'ts', 'js', 'json', 'css', 'html', 'm3u'];
      const audioExts = ['mp3', 'wav', 'flac', 'ogg', 'aac'];
      const videoExts = ['mp4', 'avi', 'mkv', 'webm'];
      const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
      if (item.ext && textExts.includes(item.ext)) {
        appStore.launchApp('notepad', {
          content: content || 'File contents...',
        });
      } else if (item.ext === 'xlsx') {
        appStore.launchApp('spreadsheet', { fileName: item.name });
      } else if (item.ext && imageExts.includes(item.ext)) {
        appStore.launchApp('image-viewer', { fileName: item.name });
      } else if (item.ext && (audioExts.includes(item.ext) || videoExts.includes(item.ext))) {
        appStore.launchApp('media-player', { fileName: item.name });
      } else if (item.ext === 'pdf' || item.ext === 'docx' || item.ext === 'doc' || item.ext === 'pptx') {
        appStore.launchApp('notepad', {
          content: content || `[${item.ext?.toUpperCase()} Document — ${item.name}]\n\nThis document type is not fully supported in the simulation.`,
        });
      } else if (item.ext === 'exe' || item.ext === 'zip') {
        appStore.launchApp('notepad', {
          content: `Cannot open "${item.name}"\n\nThis file type is not supported in the simulation.`,
        });
      }
    }
  }, [navigateTo]);

  const desktopItems = useMemo((): FsItem[] => {
    return Object.values(registry)
      .filter((a) => !HIDDEN_IDS.includes(a.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((app) => ({
        name: app.name,
        type: 'file' as const,
        ext: 'lnk',
        appId: app.id,
        customIcon: app.icon,
      }));
  }, [registry]);

  const restoredForPath = useMemo((): FsItem[] => {
    return restoredItems
      .filter((r) => trashLocationToFolder(r.originalLocation) === currentPath)
      .map((r) => ({
        name: r.name,
        type: (r.ext ? 'file' : 'folder') as 'file' | 'folder',
        ext: r.ext,
        customIcon: r.icon,
      }));
  }, [restoredItems, currentPath]);

  const baseItems = currentPath === 'Desktop' ? desktopItems : (mockFs[currentPath] || []);
  const items = useMemo(() => [...baseItems, ...restoredForPath], [baseItems, restoredForPath]);
  const breadcrumb = currentPath === 'This PC' ? 'This PC' : `This PC > ${currentPath}`;

  const getFileType = (item: FsItem): string => {
    if (item.type === 'folder') return 'File folder';
    if (item.appId) return 'Shortcut';
    switch (item.ext) {
      case 'txt': return 'Text Document';
      case 'md': return 'Markdown File';
      case 'xlsx': return 'Excel Spreadsheet';
      case 'pdf': return 'PDF Document';
      case 'docx': case 'doc': return 'Word Document';
      case 'exe': return 'Application';
      case 'zip': return 'Compressed Archive';
      case 'png': case 'jpg': case 'jpeg': case 'gif': case 'bmp': return 'Image File';
      case 'mp4': case 'avi': case 'mkv': case 'webm': return 'Video File';
      case 'mp3': case 'wav': case 'flac': case 'ogg': case 'aac': case 'm3u': return 'Audio File';
      case 'ts': case 'js': return 'Script File';
      case 'json': return 'JSON File';
      case 'css': return 'Stylesheet';
      case 'html': return 'HTML Document';
      default: return 'File';
    }
  };

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar}>
        <button className={styles.navBtn} onClick={goBack} disabled={historyIndex <= 0} title="Back">
          ←
        </button>
        <button className={styles.navBtn} onClick={goForward} disabled={historyIndex >= history.length - 1} title="Forward">
          →
        </button>
        <button className={styles.navBtn} onClick={goUp} disabled={currentPath === 'This PC'} title="Up">
          ↑
        </button>
        <div className={styles.pathBar}>{breadcrumb}</div>
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
                className={`${styles.sidebarItem} ${currentPath === section.path && !section.children ? styles.sidebarItemActive : ''}`}
                onClick={() => {
                  if (section.path !== currentPath) navigateTo(section.path);
                }}
              >
                <span className={styles.sidebarIcon}>{section.icon}</span>
                <span>{section.label}</span>
              </div>
              {section.children?.map((child) => (
                <div
                  key={child.label}
                  className={`${styles.sidebarItem} ${currentPath === child.path ? styles.sidebarItemActive : ''}`}
                  onClick={() => navigateTo(child.path)}
                  style={{ paddingLeft: 32 }}
                >
                  <span className={styles.sidebarIcon}>{child.icon}</span>
                  <span>{child.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {viewMode === 'icons' ? (
          <div className={styles.content}>
            <div className={styles.grid}>
              {items.map((item) => (
                <div
                  key={item.name}
                  className={styles.fileItem}
                  onDoubleClick={() => handleItemDblClick(item)}
                >
                  <span className={styles.fileIcon}>{getIcon(item)}</span>
                  <span className={styles.fileName}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.contentList}>
            <div className={styles.listHeader}>
              <span>Name</span>
              <span>Date Modified</span>
              <span>Type</span>
              <span>Size</span>
            </div>
            {items.map((item) => {
              const restored = restoredItems.find((r) => r.name === item.name);
              const size = restored?.size || mockFileSizes[item.name] || '—';
              const date = restored?.deletedAt || mockFileDates[item.name] || '—';
              return (
                <div
                  key={item.name}
                  className={`${styles.listItem} ${selectedName === item.name ? styles.listItemSelected : ''}`}
                  onClick={() => setSelectedName(item.name)}
                  onDoubleClick={() => handleItemDblClick(item)}
                >
                  <div className={styles.listItemName}>
                    <span className={styles.listItemIcon}>{getIcon(item)}</span>
                    <span className={styles.listItemText}>{item.name}</span>
                  </div>
                  <span className={styles.listItemMeta}>{date}</span>
                  <span className={styles.listItemMeta}>{getFileType(item)}</span>
                  <span className={styles.listItemMeta}>{size}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
