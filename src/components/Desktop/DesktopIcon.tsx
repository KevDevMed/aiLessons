import { useCallback, useRef, useState } from 'react';
import styles from './DesktopIcon.module.css';

import { IconSize } from '../../stores/useDesktopStore';

interface DesktopIconProps {
  appId: string;
  icon: string;
  label: string;
  selected: boolean;
  iconSize?: IconSize;
  position: { x: number; y: number };
  onSelect: () => void;
  onLaunch: () => void;
  onDragEnd: (x: number, y: number) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export default function DesktopIcon({
  icon,
  label,
  selected,
  iconSize = 'medium',
  position,
  onSelect,
  onLaunch,
  onDragEnd,
  onContextMenu,
}: DesktopIconProps) {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    dragged: boolean;
  } | null>(null);
  const currentDragPos = useRef({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const handleClick = useCallback(() => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onLaunch();
    } else {
      onSelect();
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
      }, 300);
    }
  }, [onSelect, onLaunch]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();

      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: position.x,
        startPosY: position.y,
        dragged: false,
      };

      const handleMouseMove = (moveE: MouseEvent) => {
        if (!dragState.current) return;
        const dx = moveE.clientX - dragState.current.startX;
        const dy = moveE.clientY - dragState.current.startY;
        if (!dragState.current.dragged && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        dragState.current.dragged = true;
        const newX = Math.max(0, dragState.current.startPosX + dx);
        const newY = Math.max(0, dragState.current.startPosY + dy);
        currentDragPos.current = { x: newX, y: newY };
        setDragPos({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (dragState.current?.dragged) {
          onDragEnd(currentDragPos.current.x, currentDragPos.current.y);
          setDragPos(null);
        } else {
          handleClick();
        }
        dragState.current = null;
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [position, onDragEnd, handleClick]
  );

  const displayPos = dragPos || position;
  const isDragging = dragPos !== null;

  return (
    <div
      className={`${styles.icon} ${selected ? styles.selected : ''} ${iconSize === 'large' ? styles.iconLarge : iconSize === 'small' ? styles.iconSmall : ''} ${isDragging ? styles.dragging : ''}`}
      style={{
        position: 'absolute',
        left: displayPos.x,
        top: displayPos.y,
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={onContextMenu}
    >
      <div className={styles.iconImage}>{icon}</div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
