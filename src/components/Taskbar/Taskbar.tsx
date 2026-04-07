import StartButton from './StartButton';
import TaskbarApps from './TaskbarApps';
import SystemTray from './SystemTray';
import styles from './Taskbar.module.css';

export default function Taskbar() {
  return (
    <div className={styles.taskbar} onClick={(e) => e.stopPropagation()}>
      <div className={styles.left}>
        <StartButton />
      </div>
      <div className={styles.center}>
        <TaskbarApps />
      </div>
      <div className={styles.right}>
        <SystemTray />
      </div>
    </div>
  );
}
