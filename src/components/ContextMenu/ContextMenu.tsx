import { useState, useEffect, useCallback } from 'react';
import { useMenuStore } from '../../stores/useMenuStore';
import { ContextMenuItem } from '../../types/menu';
import styles from './ContextMenu.module.css';

function MenuItem({ item, onClose }: { item: ContextMenuItem; onClose: () => void }) {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  if (item.divider) {
    return <div className={styles.divider} />;
  }

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      className={`${styles.item} ${item.disabled ? styles.disabled : ''} ${hasChildren ? styles.hasChildren : ''}`}
      onMouseEnter={() => hasChildren && setSubmenuOpen(true)}
      onMouseLeave={() => hasChildren && setSubmenuOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (hasChildren) return;
        if (item.action && !item.disabled) {
          item.action();
          onClose();
        }
      }}
    >
      <span className={styles.itemIcon}>{item.icon || ''}</span>
      <span className={styles.itemLabel}>{item.label}</span>
      {item.shortcut && !hasChildren && <span className={styles.itemShortcut}>{item.shortcut}</span>}
      {hasChildren && <span className={styles.arrow}>&#9658;</span>}
      {hasChildren && submenuOpen && (
        <div className={styles.submenu}>
          {item.children!.map((child) => (
            <MenuItem key={child.id} item={child} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContextMenu() {
  const visible = useMenuStore((s) => s.visible);
  const x = useMenuStore((s) => s.x);
  const y = useMenuStore((s) => s.y);
  const items = useMenuStore((s) => s.items);
  const hide = useMenuStore((s) => s.hide);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    },
    [hide]
  );

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [visible, handleKeyDown]);

  if (!visible) return null;

  // Adjust position to stay within viewport
  const menuWidth = 220;
  const menuHeight = items.length * 32;
  const adjustedX = x + menuWidth > window.innerWidth ? window.innerWidth - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? window.innerHeight - menuHeight : y;

  return (
    <>
      <div className={styles.overlay} onClick={hide} onContextMenu={(e) => { e.preventDefault(); hide(); }} />
      <div
        className={styles.menu}
        style={{ left: adjustedX, top: adjustedY }}
      >
        {items.map((item) => (
          <MenuItem key={item.id} item={item} onClose={hide} />
        ))}
      </div>
    </>
  );
}
