import { useStartMenuStore } from '../../stores/useStartMenuStore';
import styles from './Taskbar.module.css';
import logoSrc from '../../assets/logo-white.avif';

export default function StartButton() {
  const toggle = useStartMenuStore((s) => s.toggle);
  const isOpen = useStartMenuStore((s) => s.isOpen);

  return (
    <button
      className={`${styles.startButton} ${isOpen ? styles.startButtonActive : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      aria-label="Start"
    >
      <img src={logoSrc} alt="Start" className={styles.startButtonSvg} />
    </button>
  );
}
