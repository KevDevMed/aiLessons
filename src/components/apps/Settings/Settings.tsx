import { useState, useEffect } from 'react';
import { AppProps } from '../../../types/app';
import { useDesktopStore } from '../../../stores/useDesktopStore';
import { applyAccentColor } from '../../../utils/colorUtils';
import styles from './Settings.module.css';

interface Category {
  id: string;
  label: string;
  icon: string;
}

const categories: Category[] = [
  { id: 'system', label: 'System', icon: '💻' },
  { id: 'devices', label: 'Devices', icon: '🖨️' },
  { id: 'personalization', label: 'Personalization', icon: '🎨' },
  { id: 'apps', label: 'Apps', icon: '📦' },
  { id: 'network', label: 'Network & Internet', icon: '🌐' },
  { id: 'accounts', label: 'Accounts', icon: '👤' },
  { id: 'time', label: 'Time & Language', icon: '🕐' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'update', label: 'Update & Security', icon: '🔄' },
];

const accentColors = [
  '#FFB900', '#FF8C00', '#F7630C', '#CA5010',
  '#DA3B01', '#EF6950', '#D13438', '#FF4343',
  '#E74856', '#E81123', '#EA005E', '#C30052',
  '#E3008C', '#BF0077', '#C239B3', '#9A0089',
  '#0078D4', '#0063B1', '#8E8CD8', '#6B69D6',
  '#8764B8', '#744DA9', '#B146C2', '#881798',
  '#0099BC', '#2D7D9A', '#00B7C3', '#038387',
  '#00B294', '#018574', '#00CC6A', '#10893E',
  '#7A7574', '#5D5A58', '#68768A', '#515C6B',
  '#567C73', '#486860', '#498205', '#107C10',
];

function SystemContent() {
  return (
    <div>
      <h2 className={styles.contentTitle}>System</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Display</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Resolution</span>
          <span>1920 x 1080</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Scaling</span>
          <span>100%</span>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>About</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Device name</span>
          <span>DESKTOP-USER</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Processor</span>
          <span>Intel Core i7-10700K</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>RAM</span>
          <span>16.0 GB</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>System type</span>
          <span>64-bit operating system, x64-based processor</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Edition</span>
          <span>Windows 10 Pro</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Version</span>
          <span>22H2</span>
        </div>
      </div>
    </div>
  );
}

function PersonalizationContent() {
  const { accentColor, setAccentColor } = useDesktopStore();
  const [selectedColor, setSelectedColor] = useState(accentColor);

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    setAccentColor(color);
    applyAccentColor(color);
  };

  return (
    <div>
      <h2 className={styles.contentTitle}>Personalization</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Background</h3>
        <p className={styles.sectionText}>Choose your background image, color, or slideshow.</p>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Accent Color</h3>
        <p className={styles.sectionText} style={{ marginBottom: 12 }}>
          Pick an accent color for buttons, links, and other UI elements.
        </p>
        <div className={styles.colorGrid}>
          {accentColors.map((color) => (
            <div
              key={color}
              className={`${styles.colorSwatch} ${selectedColor === color ? styles.colorSwatchActive : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={styles.toggle} onClick={() => onChange(!checked)}>
      <div className={`${styles.toggleTrack} ${checked ? styles.toggleActive : ''}`}>
        <div className={styles.toggleThumb} />
      </div>
    </div>
  );
}

function DevicesContent() {
  const [bluetoothOn, setBluetoothOn] = useState(true);

  return (
    <div>
      <h2 className={styles.contentTitle}>Devices</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Bluetooth</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Bluetooth</span>
          <Toggle checked={bluetoothOn} onChange={setBluetoothOn} />
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Connected Devices</h3>
        <div className={styles.deviceItem}>
          <span className={styles.deviceIcon}>🖱️</span>
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>Logitech MX Master 3</span>
            <span className={styles.deviceType}>Mouse</span>
          </div>
          <span className={styles.deviceStatus}>Connected</span>
        </div>
        <div className={styles.deviceItem}>
          <span className={styles.deviceIcon}>⌨️</span>
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>Microsoft Sculpt</span>
            <span className={styles.deviceType}>Keyboard</span>
          </div>
          <span className={styles.deviceStatus}>Connected</span>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Printers & Scanners</h3>
        <div className={styles.deviceItem}>
          <span className={styles.deviceIcon}>🖨️</span>
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>HP LaserJet Pro</span>
            <span className={styles.deviceType}>Printer</span>
          </div>
          <span className={styles.deviceStatus}>Ready</span>
        </div>
      </div>
    </div>
  );
}

const installedApps = [
  { name: 'AI Tools Setup', size: '15 MB', date: '2024-11-15' },
  { name: 'Calculator', size: '5 MB', date: '2024-01-01' },
  { name: 'File Explorer', size: '12 MB', date: '2024-01-01' },
  { name: 'Microsoft Office', size: '2.1 GB', date: '2024-06-15' },
  { name: 'Notepad', size: '2 MB', date: '2024-01-01' },
  { name: 'Settings', size: '8 MB', date: '2024-01-01' },
  { name: 'Terminal', size: '25 MB', date: '2024-08-22' },
  { name: 'VS Code', size: '350 MB', date: '2024-07-03' },
];

function AppsContent() {
  return (
    <div>
      <h2 className={styles.contentTitle}>Apps</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Apps & Features</h3>
        <div className={styles.appList}>
          {installedApps.map((app) => (
            <div key={app.name} className={styles.appListItem}>
              <span className={styles.appIcon}>📦</span>
              <div className={styles.appInfo}>
                <span className={styles.appName}>{app.name}</span>
                <span className={styles.appMeta}>{app.size} &middot; Installed {app.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NetworkContent() {
  const [wifiOn, setWifiOn] = useState(true);

  return (
    <div>
      <h2 className={styles.contentTitle}>Network & Internet</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Wi-Fi</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Wi-Fi</span>
          <Toggle checked={wifiOn} onChange={setWifiOn} />
        </div>
      </div>
      {wifiOn && (
        <>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Connected Network</h3>
            <div className={styles.deviceItem}>
              <span className={styles.deviceIcon}>📶</span>
              <div className={styles.deviceInfo}>
                <span className={styles.deviceName}>HomeWiFi-5G</span>
                <span className={styles.deviceType}>Signal strength: Excellent</span>
              </div>
              <span className={styles.deviceStatus}>Connected</span>
            </div>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Network Properties</h3>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status</span>
              <span>Connected</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>IPv4 Address</span>
              <span>192.168.1.105</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>DNS Server</span>
              <span>8.8.8.8</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className={styles.updateButton} onClick={() => {}}>Properties</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AccountsContent() {
  return (
    <div>
      <h2 className={styles.contentTitle}>Accounts</h2>
      <div className={styles.section}>
        <div className={styles.accountHeader}>
          <div className={styles.avatar}>U</div>
          <div className={styles.accountInfo}>
            <span className={styles.accountName}>User</span>
            <span className={styles.accountEmail}>user@desktop.local</span>
            <a className={styles.accountLink} href="#" onClick={(e) => e.preventDefault()}>
              Manage my Microsoft account
            </a>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sign-in Options</h3>
        <div className={styles.deviceItem}>
          <span className={styles.deviceIcon}>🔑</span>
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>Password</span>
            <span className={styles.deviceType}>Sign in with your account password</span>
          </div>
        </div>
        <div className={styles.deviceItem}>
          <span className={styles.deviceIcon}>📌</span>
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>PIN</span>
            <span className={styles.deviceType}>Sign in with a quick PIN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeContent() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoTime, setAutoTime] = useState(true);
  const [use24Hour, setUse24Hour] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour12: !use24Hour,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <h2 className={styles.contentTitle}>Time & Language</h2>
      <div className={styles.section}>
        <div className={styles.liveTime}>{timeString}</div>
        <div className={styles.liveDate}>{dateString}</div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Time Zone</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Time zone</span>
          <span>UTC-5 Eastern Time</span>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Options</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Set time automatically</span>
          <Toggle checked={autoTime} onChange={setAutoTime} />
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>24-hour time</span>
          <Toggle checked={use24Hour} onChange={setUse24Hour} />
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Date Format</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Short date</span>
          <span>{currentTime.toLocaleDateString('en-US')}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Long date</span>
          <span>{dateString}</span>
        </div>
      </div>
    </div>
  );
}

function PrivacyContent() {
  const [adId, setAdId] = useState(true);
  const [location, setLocation] = useState(true);
  const [camera, setCamera] = useState(true);
  const [microphone, setMicrophone] = useState(true);
  const [diagnostics, setDiagnostics] = useState(false);

  return (
    <div>
      <h2 className={styles.contentTitle}>Privacy</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>General</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Let apps use advertising ID</span>
          <Toggle checked={adId} onChange={setAdId} />
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>App Permissions</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Location services</span>
          <Toggle checked={location} onChange={setLocation} />
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Camera access</span>
          <Toggle checked={camera} onChange={setCamera} />
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Microphone access</span>
          <Toggle checked={microphone} onChange={setMicrophone} />
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Diagnostics</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Diagnostics & feedback</span>
          <Toggle checked={diagnostics} onChange={setDiagnostics} />
        </div>
      </div>
    </div>
  );
}

const updateHistory = [
  { name: 'KB5034441 - Security Update', date: 'March 28, 2026' },
  { name: 'KB5033372 - Cumulative Update', date: 'March 15, 2026' },
  { name: 'KB5032288 - .NET Framework Update', date: 'February 20, 2026' },
  { name: 'KB5031356 - Servicing Stack Update', date: 'February 5, 2026' },
];

function UpdateContent() {
  const [checkState, setCheckState] = useState<'idle' | 'checking' | 'done'>('idle');

  const handleCheck = () => {
    setCheckState('checking');
    setTimeout(() => setCheckState('done'), 1500);
    setTimeout(() => setCheckState('idle'), 4000);
  };

  return (
    <div>
      <h2 className={styles.contentTitle}>Update & Security</h2>
      <div className={styles.section}>
        <div className={styles.updateStatus}>
          <span className={styles.statusGreen}>&#10003;</span>
          <div>
            <div className={styles.updateStatusTitle}>
              {checkState === 'checking' ? 'Checking for updates...' : "You're up to date"}
            </div>
            <div className={styles.updateStatusMeta}>Last checked: Today, 10:30 AM</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button
            className={styles.updateButton}
            onClick={handleCheck}
            disabled={checkState === 'checking'}
          >
            {checkState === 'checking' ? 'Checking...' : 'Check for updates'}
          </button>
        </div>
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Update History</h3>
        {updateHistory.map((item) => (
          <div key={item.name} className={styles.infoRow}>
            <span>{item.name}</span>
            <span className={styles.infoLabel}>{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Settings({ windowId }: AppProps) {
  const [activeCategory, setActiveCategory] = useState('system');
  const [search, setSearch] = useState('');

  const filteredCategories = search
    ? categories.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : categories;

  const renderContent = () => {
    switch (activeCategory) {
      case 'system':
        return <SystemContent />;
      case 'devices':
        return <DevicesContent />;
      case 'personalization':
        return <PersonalizationContent />;
      case 'apps':
        return <AppsContent />;
      case 'network':
        return <NetworkContent />;
      case 'accounts':
        return <AccountsContent />;
      case 'time':
        return <TimeContent />;
      case 'privacy':
        return <PrivacyContent />;
      case 'update':
        return <UpdateContent />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.settings}>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Find a setting"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className={`${styles.sidebarItem} ${activeCategory === cat.id ? styles.sidebarItemActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className={styles.sidebarIcon}>{cat.icon}</span>
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>Windows Settings</h1>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
