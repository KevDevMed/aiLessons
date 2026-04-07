import { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useWindowStore } from '../../stores/useWindowStore';
import styles from './SystemTray.module.css';

export default function SystemTray() {
  const { lang, toggleLang } = useI18n();
  const minimizeAll = useWindowStore((s) => s.minimizeAll);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.tray}>
      <button
        className={styles.trayButton}
        onClick={(e) => {
          e.stopPropagation();
          toggleLang();
        }}
        title="Toggle language"
      >
        {lang === 'en' ? 'EN' : 'ES'}
      </button>
      <div className={styles.clock}>
        <span className={styles.time}>{timeStr}</span>
        <span className={styles.date}>{dateStr}</span>
      </div>
      <div
        className={styles.showDesktop}
        onClick={(e) => {
          e.stopPropagation();
          minimizeAll();
        }}
        title="Show desktop"
      />
    </div>
  );
}
