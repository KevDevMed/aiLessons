import { AppProps } from '../../../types/app';
import { useWindowStore } from '../../../stores/useWindowStore';
import styles from './ImageViewer.module.css';

interface MockImage {
  gradient: string;
  label: string;
  width: number;
  height: number;
  format: string;
  size: string;
}

const mockImages: Record<string, MockImage> = {
  'wallpaper.png': {
    gradient: 'linear-gradient(135deg, #0078D4 0%, #00BCF2 100%)',
    label: 'Desktop Wallpaper',
    width: 1920,
    height: 1080,
    format: 'PNG',
    size: '2.4 MB',
  },
  'screenshot-01.png': {
    gradient: 'linear-gradient(160deg, #2d2d3d 0%, #1a1a3a 50%, #3d2d4d 100%)',
    label: 'Screenshot 1 — Desktop',
    width: 1920,
    height: 1080,
    format: 'PNG',
    size: '1.8 MB',
  },
  'screenshot-02.png': {
    gradient: 'linear-gradient(160deg, #1a3a1a 0%, #0d2b0d 50%, #2d4a2d 100%)',
    label: 'Screenshot 2 — Terminal',
    width: 1920,
    height: 1080,
    format: 'PNG',
    size: '1.2 MB',
  },
  'profile-photo.jpg': {
    gradient: 'radial-gradient(circle at 50% 40%, #e8d5b7 0%, #c4956a 40%, #8b6547 70%, #5a3a28 100%)',
    label: 'Profile Photo',
    width: 800,
    height: 800,
    format: 'JPEG',
    size: '340 KB',
  },
  'beach-sunset.jpg': {
    gradient: 'linear-gradient(to bottom, #1a0533 0%, #ff6b35 30%, #ff8c42 50%, #ffd700 70%, #4169e1 100%)',
    label: 'Beach Sunset',
    width: 4032,
    height: 3024,
    format: 'JPEG',
    size: '5.1 MB',
  },
  'mountain-view.jpg': {
    gradient: 'linear-gradient(to bottom, #87CEEB 0%, #b0d4e8 20%, #ffffff 35%, #228B22 55%, #1a6b1a 70%, #654321 85%, #3e2723 100%)',
    label: 'Mountain View',
    width: 4032,
    height: 3024,
    format: 'JPEG',
    size: '4.7 MB',
  },
};

function getFormat(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const formats: Record<string, string> = {
    png: 'PNG', jpg: 'JPEG', jpeg: 'JPEG', gif: 'GIF', bmp: 'BMP',
  };
  return formats[ext] || 'Image';
}

export function ImageViewer({ windowId }: AppProps) {
  const win = useWindowStore((s) => s.windows[windowId]);
  const fileName = (win?.initialData?.fileName as string) || 'image.png';
  const img = mockImages[fileName] || {
    gradient: 'linear-gradient(135deg, #333 0%, #555 100%)',
    label: fileName.replace(/\.[^.]+$/, ''),
    width: 1920,
    height: 1080,
    format: getFormat(fileName),
    size: '1.0 MB',
  };

  return (
    <div className={styles.viewer}>
      <div className={styles.toolbar}>
        <span className={styles.fileName}>{fileName}</span>
        <div className={styles.toolbarActions}>
          <button className={styles.toolBtn} title="Zoom in">+</button>
          <button className={styles.toolBtn} title="Zoom out">−</button>
          <button className={styles.toolBtn} title="Rotate">↻</button>
          <button className={styles.toolBtn} title="Delete">🗑</button>
        </div>
      </div>
      <div className={styles.canvas}>
        <div className={styles.mockImage} style={{ background: img.gradient }}>
          <span className={styles.imageLabel}>{img.label}</span>
        </div>
      </div>
      <div className={styles.statusBar}>
        {fileName} &middot; {img.width} x {img.height} &middot; {img.format} &middot; {img.size}
      </div>
    </div>
  );
}
