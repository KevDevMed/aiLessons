import styles from './NewsApp.module.css';

interface Props {
  address: string;
}

export function BrowserChrome({ address }: Props) {
  return (
    <div className={styles.chrome}>
      <div className={styles.addressBar}>
        <span className={styles.addressIcon} aria-hidden>🔒</span>
        <span className={styles.addressText}>{address}</span>
      </div>
    </div>
  );
}
