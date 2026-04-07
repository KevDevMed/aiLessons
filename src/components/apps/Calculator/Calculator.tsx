import { useState, useCallback } from 'react';
import { AppProps } from '../../../types/app';
import styles from './Calculator.module.css';

export function Calculator({ windowId }: AppProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand || justEvaluated) {
      setDisplay(digit);
      setWaitingForOperand(false);
      setJustEvaluated(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand, justEvaluated]);

  const inputDot = useCallback(() => {
    if (waitingForOperand || justEvaluated) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setJustEvaluated(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand, justEvaluated]);

  const calculate = useCallback((left: number, op: string, right: number): number => {
    switch (op) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right !== 0 ? left / right : NaN;
      default: return right;
    }
  }, []);

  const formatNumber = useCallback((n: number): string => {
    if (isNaN(n)) return 'Error';
    if (!isFinite(n)) return 'Error';
    const str = String(n);
    if (str.length > 16) {
      return n.toPrecision(12);
    }
    return str;
  }, []);

  const handleOperator = useCallback((nextOp: string) => {
    const current = parseFloat(display);

    if (prevValue !== null && operator && !waitingForOperand) {
      const result = calculate(prevValue, operator, current);
      const formatted = formatNumber(result);
      setDisplay(formatted);
      setExpression(`${formatted} ${nextOp}`);
      setPrevValue(result);
    } else {
      setExpression(`${display} ${nextOp}`);
      setPrevValue(current);
    }

    setOperator(nextOp);
    setWaitingForOperand(true);
    setJustEvaluated(false);
  }, [display, prevValue, operator, waitingForOperand, calculate, formatNumber]);

  const handleEquals = useCallback(() => {
    const current = parseFloat(display);

    if (prevValue !== null && operator) {
      const result = calculate(prevValue, operator, current);
      const formatted = formatNumber(result);
      setExpression(`${prevValue} ${operator} ${current} =`);
      setDisplay(formatted);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(false);
      setJustEvaluated(true);
    }
  }, [display, prevValue, operator, calculate, formatNumber]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setJustEvaluated(false);
  }, []);

  const handleClearEntry = useCallback(() => {
    setDisplay('0');
    setJustEvaluated(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (waitingForOperand || justEvaluated) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  }, [display, waitingForOperand, justEvaluated]);

  const handleNegate = useCallback(() => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(formatNumber(-val));
    }
  }, [display, formatNumber]);

  const handlePercent = useCallback(() => {
    const val = parseFloat(display);
    if (prevValue !== null) {
      setDisplay(formatNumber(prevValue * val / 100));
    } else {
      setDisplay(formatNumber(val / 100));
    }
  }, [display, prevValue, formatNumber]);

  const handleReciprocal = useCallback(() => {
    const val = parseFloat(display);
    setDisplay(formatNumber(1 / val));
    setJustEvaluated(true);
  }, [display, formatNumber]);

  const handleSquare = useCallback(() => {
    const val = parseFloat(display);
    setDisplay(formatNumber(val * val));
    setJustEvaluated(true);
  }, [display, formatNumber]);

  const handleSqrt = useCallback(() => {
    const val = parseFloat(display);
    setDisplay(formatNumber(Math.sqrt(val)));
    setJustEvaluated(true);
  }, [display, formatNumber]);

  const buttons: { label: string; action: () => void; type: 'number' | 'operator' | 'top' | 'equals' }[] = [
    { label: '%', action: handlePercent, type: 'top' },
    { label: 'CE', action: handleClearEntry, type: 'top' },
    { label: 'C', action: handleClear, type: 'top' },
    { label: '⌫', action: handleBackspace, type: 'top' },

    { label: '1/x', action: handleReciprocal, type: 'operator' },
    { label: 'x\u00B2', action: handleSquare, type: 'operator' },
    { label: '\u221Ax', action: handleSqrt, type: 'operator' },
    { label: '\u00F7', action: () => handleOperator('/'), type: 'operator' },

    { label: '7', action: () => inputDigit('7'), type: 'number' },
    { label: '8', action: () => inputDigit('8'), type: 'number' },
    { label: '9', action: () => inputDigit('9'), type: 'number' },
    { label: '\u00D7', action: () => handleOperator('*'), type: 'operator' },

    { label: '4', action: () => inputDigit('4'), type: 'number' },
    { label: '5', action: () => inputDigit('5'), type: 'number' },
    { label: '6', action: () => inputDigit('6'), type: 'number' },
    { label: '\u2212', action: () => handleOperator('-'), type: 'operator' },

    { label: '1', action: () => inputDigit('1'), type: 'number' },
    { label: '2', action: () => inputDigit('2'), type: 'number' },
    { label: '3', action: () => inputDigit('3'), type: 'number' },
    { label: '+', action: () => handleOperator('+'), type: 'operator' },

    { label: '+/-', action: handleNegate, type: 'number' },
    { label: '0', action: () => inputDigit('0'), type: 'number' },
    { label: '.', action: inputDot, type: 'number' },
    { label: '=', action: handleEquals, type: 'equals' },
  ];

  const typeClass = (type: string) => {
    switch (type) {
      case 'number': return styles.btnNumber;
      case 'operator': return styles.btnOperator;
      case 'top': return styles.btnTop;
      case 'equals': return styles.btnEquals;
      default: return '';
    }
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.display}>
        <div className={styles.expression}>{expression || '\u00A0'}</div>
        <div className={styles.currentValue}>{display}</div>
      </div>
      <div className={styles.buttons}>
        {buttons.map((btn, i) => (
          <button
            key={i}
            className={`${styles.btn} ${typeClass(btn.type)}`}
            onClick={btn.action}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
