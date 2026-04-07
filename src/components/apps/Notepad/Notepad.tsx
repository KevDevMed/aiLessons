import { useState, useRef, useCallback, useEffect } from 'react';
import { AppProps } from '../../../types/app';
import { useWindowStore } from '../../../stores/useWindowStore';
import styles from './Notepad.module.css';

interface MenuDef {
  label: string;
  items: ({ label: string; shortcut?: string; action: () => void } | 'separator')[];
}

export function Notepad({ windowId }: AppProps) {
  const [content, setContent] = useState('');
  const [wordWrap, setWordWrap] = useState(true);
  const [cursorPos, setCursorPos] = useState({ ln: 1, col: 1 });
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const win = useWindowStore((s) => s.windows[windowId]);

  useEffect(() => {
    if (win?.initialData?.content) {
      setContent(win.initialData.content as string);
    }
  }, []); // only on mount

  const updateCursorPos = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const text = ta.value;
    const pos = ta.selectionStart;
    const lines = text.substring(0, pos).split('\n');
    setCursorPos({ ln: lines.length, col: lines[lines.length - 1].length + 1 });
  }, []);

  const handleNew = useCallback(() => {
    setContent('');
    setOpenMenu(null);
  }, []);

  const handleSaveAs = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'untitled.txt';
    a.click();
    URL.revokeObjectURL(url);
    setOpenMenu(null);
  }, [content]);

  const handleOpen = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.log,.md,.json,.js,.ts,.css,.html';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setContent(ev.target?.result as string || '');
        };
        reader.readAsText(file);
      }
    };
    input.click();
    setOpenMenu(null);
  }, []);

  const execCommand = useCallback((cmd: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    if (cmd === 'selectAll') {
      ta.select();
    } else if (cmd === 'undo') {
      document.execCommand('undo');
    } else if (cmd === 'cut') {
      document.execCommand('cut');
    } else if (cmd === 'copy') {
      document.execCommand('copy');
    } else if (cmd === 'paste') {
      navigator.clipboard.readText().then((text) => {
        document.execCommand('insertText', false, text);
      }).catch(() => {});
    }
    setOpenMenu(null);
  }, []);

  const menus: MenuDef[] = [
    {
      label: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', action: handleNew },
        { label: 'Open...', shortcut: 'Ctrl+O', action: handleOpen },
        'separator',
        { label: 'Save As...', shortcut: 'Ctrl+Shift+S', action: handleSaveAs },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', action: () => execCommand('undo') },
        'separator',
        { label: 'Cut', shortcut: 'Ctrl+X', action: () => execCommand('cut') },
        { label: 'Copy', shortcut: 'Ctrl+C', action: () => execCommand('copy') },
        { label: 'Paste', shortcut: 'Ctrl+V', action: () => execCommand('paste') },
        'separator',
        { label: 'Select All', shortcut: 'Ctrl+A', action: () => execCommand('selectAll') },
      ],
    },
    {
      label: 'View',
      items: [
        {
          label: `Word Wrap ${wordWrap ? '✓' : ''}`,
          action: () => {
            setWordWrap((w) => !w);
            setOpenMenu(null);
          },
        },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Notepad',
          action: () => {
            setAboutOpen(true);
            setOpenMenu(null);
          },
        },
      ],
    },
  ];

  useEffect(() => {
    const handleClick = () => setOpenMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className={styles.notepad}>
      <div className={styles.menuBar} onClick={(e) => e.stopPropagation()}>
        {menus.map((menu) => (
          <div
            key={menu.label}
            className={`${styles.menuItem} ${openMenu === menu.label ? styles.menuItemActive : ''}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              setOpenMenu(openMenu === menu.label ? null : menu.label);
            }}
            onMouseEnter={() => {
              if (openMenu !== null) setOpenMenu(menu.label);
            }}
          >
            {menu.label}
            {openMenu === menu.label && (
              <div className={styles.dropdown}>
                {menu.items.map((item, i) =>
                  item === 'separator' ? (
                    <div key={i} className={styles.separator} />
                  ) : (
                    <div
                      key={item.label}
                      className={styles.dropdownItem}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        item.action();
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.textareaWrapper}>
        <textarea
          ref={textareaRef}
          className={`${styles.textarea} ${!wordWrap ? styles.noWrap : ''}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyUp={updateCursorPos}
          onMouseUp={updateCursorPos}
          onFocus={updateCursorPos}
          spellCheck={false}
          wrap={wordWrap ? 'soft' : 'off'}
        />
      </div>
      <div className={styles.statusBar}>
        Ln {cursorPos.ln}, Col {cursorPos.col}
      </div>
      {aboutOpen && (
        <div className={styles.aboutOverlay} onClick={() => setAboutOpen(false)}>
          <div className={styles.aboutDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.aboutTitle}>Notepad</div>
            <div className={styles.aboutText}>Version 10.0</div>
            <div className={styles.aboutText}>&copy; Microsoft Corporation</div>
            <div className={styles.aboutText}>Windows 10 Simulation</div>
            <button className={styles.aboutButton} onClick={() => setAboutOpen(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
