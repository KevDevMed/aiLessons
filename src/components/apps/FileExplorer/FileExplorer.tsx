import { useState, useCallback, useMemo } from 'react';
import { AppProps } from '../../../types/app';
import { useAppStore } from '../../../stores/useAppStore';
import styles from './FileExplorer.module.css';

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
  const [currentPath, setCurrentPath] = useState('This PC');
  const [history, setHistory] = useState<string[]>(['This PC']);
  const [historyIndex, setHistoryIndex] = useState(0);

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
      const textExts = ['txt', 'md', 'ts', 'js', 'json', 'css', 'html', 'm3u'];
      const audioExts = ['mp3', 'wav', 'flac', 'ogg', 'aac'];
      const videoExts = ['mp4', 'avi', 'mkv', 'webm'];
      const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
      if (item.ext && textExts.includes(item.ext)) {
        appStore.launchApp('notepad', {
          content: mockFileContent[item.name] || 'File contents...',
        });
      } else if (item.ext === 'xlsx') {
        appStore.launchApp('spreadsheet', { fileName: item.name });
      } else if (item.ext && imageExts.includes(item.ext)) {
        appStore.launchApp('image-viewer', { fileName: item.name });
      } else if (item.ext && (audioExts.includes(item.ext) || videoExts.includes(item.ext))) {
        appStore.launchApp('media-player', { fileName: item.name });
      } else if (item.ext === 'pdf' || item.ext === 'docx' || item.ext === 'doc') {
        appStore.launchApp('notepad', {
          content: mockFileContent[item.name] || `[${item.ext?.toUpperCase()} Document — ${item.name}]\n\nThis document type is not fully supported in the simulation.`,
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

  const items = currentPath === 'Desktop' ? desktopItems : (mockFs[currentPath] || []);
  const breadcrumb = currentPath === 'This PC' ? 'This PC' : `This PC > ${currentPath}`;

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
      </div>
    </div>
  );
}
