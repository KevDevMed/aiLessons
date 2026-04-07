import { useState, useCallback, useRef, useEffect } from 'react';
import { AppProps } from '../../../types/app';
import { useWindowStore } from '../../../stores/useWindowStore';
import styles from './Spreadsheet.module.css';

interface SheetData {
  title: string;
  headers: string[];
  rows: string[][];
}

const mockSheets: Record<string, SheetData> = {
  'report.xlsx': {
    title: 'Quarterly Report',
    headers: ['Month', 'Revenue', 'Expenses', 'Profit', 'Growth'],
    rows: [
      ['January', '$42,500', '$31,200', '$11,300', '+5.2%'],
      ['February', '$45,100', '$29,800', '$15,300', '+8.1%'],
      ['March', '$48,900', '$33,400', '$15,500', '+12.3%'],
      ['April', '$44,200', '$30,100', '$14,100', '+3.8%'],
      ['May', '$51,600', '$34,700', '$16,900', '+15.4%'],
      ['June', '$49,300', '$32,500', '$16,800', '+11.2%'],
    ],
  },
  'quarterly-report.xlsx': {
    title: 'Q4 Quarterly Report',
    headers: ['Department', 'Budget', 'Spent', 'Remaining', 'Status'],
    rows: [
      ['Engineering', '$120,000', '$98,500', '$21,500', 'On Track'],
      ['Marketing', '$85,000', '$82,300', '$2,700', 'At Risk'],
      ['Sales', '$65,000', '$48,200', '$16,800', 'Under Budget'],
      ['Operations', '$95,000', '$91,100', '$3,900', 'On Track'],
      ['HR', '$45,000', '$38,700', '$6,300', 'Under Budget'],
    ],
  },
  'budget.xlsx': {
    title: 'Annual Budget 2024',
    headers: ['Category', 'Q1', 'Q2', 'Q3', 'Q4', 'Total'],
    rows: [
      ['Salaries', '$180K', '$180K', '$195K', '$195K', '$750K'],
      ['Software', '$25K', '$25K', '$30K', '$30K', '$110K'],
      ['Hardware', '$15K', '$8K', '$12K', '$20K', '$55K'],
      ['Training', '$10K', '$5K', '$10K', '$5K', '$30K'],
      ['Travel', '$8K', '$12K', '$6K', '$10K', '$36K'],
      ['Office', '$20K', '$20K', '$20K', '$20K', '$80K'],
    ],
  },
};

const DEFAULT_ROWS = 20;
const DEFAULT_COLS = 8;

function makeDefaultSheet(): SheetData {
  const headers = Array.from({ length: DEFAULT_COLS }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const rows = Array.from({ length: DEFAULT_ROWS }, () =>
    Array(DEFAULT_COLS).fill('')
  );
  return { title: 'Spreadsheet', headers, rows };
}

function deepCloneRows(rows: string[][]): string[][] {
  return rows.map((r) => [...r]);
}

export function Spreadsheet({ windowId }: AppProps) {
  const win = useWindowStore((s) => s.windows[windowId]);
  const fileName = (win?.initialData?.fileName as string) || '';
  const base = mockSheets[fileName] || makeDefaultSheet();

  const [headers, setHeaders] = useState(() => [...base.headers]);
  const [rows, setRows] = useState(() => deepCloneRows(base.rows));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ r: number; c: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);

  const getCellRef = useCallback((r: number, c: number) => {
    return `${String.fromCharCode(65 + (c % 26))}${r + 1}`;
  }, []);

  const commitEdit = useCallback(() => {
    if (editingCell) {
      setRows((prev) => {
        const next = deepCloneRows(prev);
        // Expand rows if needed
        while (next.length <= editingCell.r) {
          next.push(Array(headers.length).fill(''));
        }
        next[editingCell.r][editingCell.c] = editValue;
        return next;
      });
      setEditingCell(null);
    }
  }, [editingCell, editValue, headers.length]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (editingCell) {
      commitEdit();
    }
    setSelectedCell({ r, c });
    setFormulaBarValue(rows[r]?.[c] || '');
  }, [editingCell, commitEdit, rows]);

  const handleCellDoubleClick = useCallback((r: number, c: number) => {
    setEditingCell({ r, c });
    setEditValue(rows[r]?.[c] || '');
    setSelectedCell({ r, c });
  }, [rows]);

  const handleEditKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
      // Move selection down
      if (selectedCell) {
        const nextR = selectedCell.r + 1;
        setSelectedCell({ r: nextR, c: selectedCell.c });
        setFormulaBarValue(rows[nextR]?.[selectedCell.c] || '');
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit();
      if (selectedCell) {
        const nextC = selectedCell.c + 1;
        if (nextC < headers.length) {
          setSelectedCell({ r: selectedCell.r, c: nextC });
          setFormulaBarValue(rows[selectedCell.r]?.[nextC] || '');
        }
      }
    }
  }, [commitEdit, selectedCell, rows, headers.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (editingCell) return;
    if (!selectedCell) return;

    if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      handleCellDoubleClick(selectedCell.r, selectedCell.c);
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      setRows((prev) => {
        const next = deepCloneRows(prev);
        if (next[selectedCell.r]) {
          next[selectedCell.r][selectedCell.c] = '';
        }
        return next;
      });
      setFormulaBarValue('');
      return;
    }

    let { r, c } = selectedCell;
    if (e.key === 'ArrowUp') { e.preventDefault(); r = Math.max(0, r - 1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); r = Math.min(rows.length - 1, r + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); c = Math.max(0, c - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); c = Math.min(headers.length - 1, c + 1); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      c = e.shiftKey ? Math.max(0, c - 1) : Math.min(headers.length - 1, c + 1);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Start typing in cell
      setEditingCell({ r, c });
      setEditValue(e.key);
      return;
    } else {
      return;
    }
    setSelectedCell({ r, c });
    setFormulaBarValue(rows[r]?.[c] || '');
  }, [editingCell, selectedCell, rows, headers.length, handleCellDoubleClick]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, Array(headers.length).fill('')]);
  }, [headers.length]);

  const addColumn = useCallback(() => {
    const nextLetter = String.fromCharCode(65 + (headers.length % 26));
    setHeaders((prev) => [...prev, nextLetter]);
    setRows((prev) => prev.map((row) => [...row, '']));
  }, [headers.length]);

  const handleFormulaBarChange = useCallback((val: string) => {
    setFormulaBarValue(val);
    if (selectedCell) {
      setRows((prev) => {
        const next = deepCloneRows(prev);
        if (next[selectedCell.r]) {
          next[selectedCell.r][selectedCell.c] = val;
        }
        return next;
      });
    }
  }, [selectedCell]);

  return (
    <div className={styles.spreadsheet} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className={styles.toolbar}>
        <span className={styles.fileName}>{fileName || 'Untitled.xlsx'}</span>
        <div className={styles.toolbarActions}>
          <button className={styles.toolBtn} onClick={addRow} title="Add row">+ Row</button>
          <button className={styles.toolBtn} onClick={addColumn} title="Add column">+ Col</button>
        </div>
      </div>

      <div className={styles.formulaBar}>
        <span className={styles.cellRef}>
          {selectedCell ? getCellRef(selectedCell.r, selectedCell.c) : ''}
        </span>
        <span className={styles.formulaSep}>fx</span>
        <input
          className={styles.formulaInput}
          value={formulaBarValue}
          onChange={(e) => handleFormulaBarChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rowNum}></th>
              {headers.map((h, i) => (
                <th key={i} className={styles.headerCell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td className={styles.rowNum}>{ri + 1}</td>
                {row.map((cell, ci) => {
                  const isSelected = selectedCell?.r === ri && selectedCell?.c === ci;
                  const isEditing = editingCell?.r === ri && editingCell?.c === ci;
                  return (
                    <td
                      key={ci}
                      className={`${styles.cell} ${isSelected ? styles.cellSelected : ''}`}
                      onClick={() => handleCellClick(ri, ci)}
                      onDoubleClick={() => handleCellDoubleClick(ri, ci)}
                    >
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          className={styles.cellInput}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          onBlur={commitEdit}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.statusBar}>
        {rows.length} rows &middot; {headers.length} columns
        {selectedCell ? ` &middot; ${getCellRef(selectedCell.r, selectedCell.c)}` : ''}
      </div>
    </div>
  );
}
