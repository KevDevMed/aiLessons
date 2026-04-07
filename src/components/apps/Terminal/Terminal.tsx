import { useState, useRef, useEffect, useCallback } from 'react';
import { AppProps } from '../../../types/app';
import styles from './Terminal.module.css';

interface HistoryEntry {
  type: 'welcome' | 'command' | 'error' | 'output' | 'ascii';
  text: string;
}

const PROMPT = 'C:\\Users\\User>';

const JOKES = [
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'A SQL query walks into a bar, sees two tables and asks: "Can I JOIN you?"',
  'There are only 10 types of people in the world: those who understand binary and those who don\'t.',
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  'Why was the JavaScript developer sad? Because he didn\'t Node how to Express himself.',
  'What\'s the object-oriented way to become wealthy? Inheritance.',
  'Why do Java developers wear glasses? Because they can\'t C#.',
  '!false — it\'s funny because it\'s true.',
];

const FORTUNES = [
  'You will mass-rename 10,000 files and only misname 3 of them.',
  'A merge conflict in your future will reveal a coworker\'s secret TODO list.',
  'The bug you\'ve been chasing lives on line 1. It has always lived on line 1.',
  'Your next "quick fix" will take exactly 4 hours and 37 minutes.',
  'You will discover that the real bugs were the friends we made along the way.',
  'A semicolon will betray you when you least expect it.',
  'git blame will reveal uncomfortable truths about last Friday.',
  'You will achieve enlightenment, but only in a dream about CSS grid.',
];

const EXCUSES = [
  'It works on my machine.',
  'That\'s not a bug, it\'s a feature.',
  'It must be a caching issue.',
  'The specs were unclear.',
  'It worked in development.',
  'Someone must have changed the config.',
  'There must be a race condition somewhere.',
  'Have you tried clearing your cookies?',
  'It passed all the tests...',
  'That was already broken before I touched it.',
];

const HACKER_FRAMES = [
  'ACCESSING MAINFRAME...',
  '[████░░░░░░] 35%',
  'BYPASSING FIREWALL...',
  '[████████░░] 78%',
  'DECRYPTING PAYLOAD...',
  '[██████████] 100%',
  '',
  'ACCESS GRANTED.',
  '',
  'Just kidding. You don\'t have permissions for anything.',
];

const ASCII_COFFEE = `
    ( (
     ) )
  ._______.
  |       |]
  \\       /
   \`-----'`;

const ASCII_FLIP = `
(╯°□°)╯︵ ┻━┻`;

const ASCII_UNFLIP = `
┬─┬ ノ( ゜-゜ノ)`;

const ASCII_SHRUG = `
¯\\_(ツ)_/¯`;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function handleCommand(cmd: string): HistoryEntry[] {
  const lower = cmd.toLowerCase().trim();
  const parts = lower.split(/\s+/);

  if (lower === '') return [];

  if (lower === 'cls' || lower === 'clear') return [{ type: 'command', text: '__CLEAR__' }];

  if (lower === 'ver') {
    return [
      { type: 'output', text: '' },
      { type: 'output', text: 'Microsoft Windows [Version 10.0.19045.3803]' },
    ];
  }

  if (lower === 'help') {
    return [
      { type: 'output', text: '' },
      { type: 'output', text: 'Standard commands:' },
      { type: 'output', text: '  help         Show this help' },
      { type: 'output', text: '  cls          Clear screen' },
      { type: 'output', text: '  ver          Show version' },
      { type: 'output', text: '  echo [text]  Print text' },
      { type: 'output', text: '  date         Show current date' },
      { type: 'output', text: '  time         Show current time' },
      { type: 'output', text: '  whoami       Show current user' },
      { type: 'output', text: '  hostname     Show computer name' },
      { type: 'output', text: '  dir          List directory contents' },
      { type: 'output', text: '  color        Change text color' },
      { type: 'output', text: '' },
      { type: 'output', text: 'Fun commands:' },
      { type: 'output', text: '  joke         Tell a programming joke' },
      { type: 'output', text: '  fortune      Show your fortune' },
      { type: 'output', text: '  excuse       Generate a developer excuse' },
      { type: 'output', text: '  hack         Hack the mainframe' },
      { type: 'output', text: '  coffee       Brew some coffee' },
      { type: 'output', text: '  flip         Flip a table' },
      { type: 'output', text: '  unflip       Put the table back' },
      { type: 'output', text: '  shrug        Express confusion' },
      { type: 'output', text: '  matrix       Enter the Matrix' },
      { type: 'output', text: '  sudo         Try superuser' },
      { type: 'output', text: '  exit         Try to exit' },
      { type: 'output', text: '  rm -rf /     Try to delete everything' },
    ];
  }

  if (lower.startsWith('echo ')) {
    return [{ type: 'output', text: cmd.substring(5) }];
  }

  if (lower === 'date') {
    return [{ type: 'output', text: `Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` }];
  }

  if (lower === 'time') {
    return [{ type: 'output', text: `Current time: ${new Date().toLocaleTimeString()}` }];
  }

  if (lower === 'whoami') {
    return [{ type: 'output', text: 'DESKTOP-WIN10\\User' }];
  }

  if (lower === 'hostname') {
    return [{ type: 'output', text: 'DESKTOP-WIN10' }];
  }

  if (lower === 'dir') {
    return [
      { type: 'output', text: ' Volume in drive C is Windows' },
      { type: 'output', text: ' Directory of C:\\Users\\User' },
      { type: 'output', text: '' },
      { type: 'output', text: '04/07/2026  10:30 AM    <DIR>          Desktop' },
      { type: 'output', text: '04/07/2026  10:30 AM    <DIR>          Documents' },
      { type: 'output', text: '04/07/2026  10:30 AM    <DIR>          Downloads' },
      { type: 'output', text: '04/07/2026  10:30 AM    <DIR>          Music' },
      { type: 'output', text: '04/07/2026  10:30 AM    <DIR>          Pictures' },
      { type: 'output', text: '04/07/2026  10:30 AM    <DIR>          Videos' },
      { type: 'output', text: '               0 File(s)              0 bytes' },
      { type: 'output', text: '               6 Dir(s)   128,849,018,880 bytes free' },
    ];
  }

  if (lower === 'joke') {
    return [{ type: 'output', text: pickRandom(JOKES) }];
  }

  if (lower === 'fortune') {
    return [
      { type: 'output', text: '🔮 Your fortune:' },
      { type: 'output', text: pickRandom(FORTUNES) },
    ];
  }

  if (lower === 'excuse') {
    return [
      { type: 'output', text: '💡 Developer excuse #' + Math.floor(Math.random() * 999) + ':' },
      { type: 'output', text: `"${pickRandom(EXCUSES)}"` },
    ];
  }

  if (lower === 'hack') {
    return HACKER_FRAMES.map((line) => ({ type: 'output' as const, text: line }));
  }

  if (lower === 'coffee') {
    return [{ type: 'ascii', text: ASCII_COFFEE }, { type: 'output', text: '☕ Coffee is ready! Now get back to coding.' }];
  }

  if (lower === 'flip') {
    return [{ type: 'ascii', text: ASCII_FLIP }];
  }

  if (lower === 'unflip') {
    return [{ type: 'ascii', text: ASCII_UNFLIP }];
  }

  if (lower === 'shrug') {
    return [{ type: 'ascii', text: ASCII_SHRUG }];
  }

  if (lower === 'matrix') {
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const lines: HistoryEntry[] = [];
    for (let i = 0; i < 6; i++) {
      let line = '';
      for (let j = 0; j < 40; j++) {
        line += chars[Math.floor(Math.random() * chars.length)] + ' ';
      }
      lines.push({ type: 'ascii', text: line });
    }
    lines.push({ type: 'output', text: '' });
    lines.push({ type: 'output', text: 'Wake up, Neo...' });
    return lines;
  }

  if (lower.startsWith('sudo')) {
    return [{ type: 'error', text: 'Nice try. This is Windows, we don\'t do that here.' }];
  }

  if (lower === 'exit') {
    return [{ type: 'output', text: 'You can check out any time you like, but you can never leave. 🎸' }];
  }

  if (lower === 'rm -rf /' || lower === 'rm -rf /*') {
    return [
      { type: 'error', text: 'Whoa there! This isn\'t Linux, and even if it were...' },
      { type: 'output', text: 'rm: cannot remove \'/\': Permission denied' },
      { type: 'output', text: '(You\'re welcome.)' },
    ];
  }

  if (lower === 'ping localhost') {
    return [
      { type: 'output', text: 'Pinging 127.0.0.1 with 32 bytes of data:' },
      { type: 'output', text: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=128' },
      { type: 'output', text: 'Reply from 127.0.0.1: bytes=32 time<1ms TTL=128' },
      { type: 'output', text: '' },
      { type: 'output', text: 'Congratulations, you can talk to yourself.' },
    ];
  }

  if (parts[0] === 'ping') {
    return [
      { type: 'output', text: `Pinging ${parts[1] || 'nowhere'}...` },
      { type: 'output', text: 'Request timed out.' },
      { type: 'output', text: 'Request timed out.' },
      { type: 'output', text: 'The internet is a simulation anyway.' },
    ];
  }

  if (lower === 'color') {
    return [
      { type: 'output', text: 'Sets the terminal foreground and background colors.' },
      { type: 'output', text: 'Try: color 0a (for that classic hacker green)' },
    ];
  }

  if (lower === 'color 0a') {
    return [{ type: 'output', text: '🟢 You are now a certified hacker. (Colors don\'t actually change though.)' }];
  }

  if (lower === 'tree') {
    return [
      { type: 'output', text: 'C:\\Users\\User' },
      { type: 'output', text: '├── Desktop' },
      { type: 'output', text: '│   └── Projects' },
      { type: 'output', text: '├── Documents' },
      { type: 'output', text: '│   └── Work' },
      { type: 'output', text: '├── Downloads' },
      { type: 'output', text: '├── Music' },
      { type: 'output', text: '├── Pictures' },
      { type: 'output', text: '│   ├── Screenshots' },
      { type: 'output', text: '│   └── Vacation' },
      { type: 'output', text: '└── Videos' },
    ];
  }

  if (lower === 'ipconfig') {
    return [
      { type: 'output', text: 'Windows IP Configuration' },
      { type: 'output', text: '' },
      { type: 'output', text: 'Ethernet adapter Ethernet:' },
      { type: 'output', text: '   IPv4 Address. . . . . . : 192.168.1.42' },
      { type: 'output', text: '   Subnet Mask . . . . . . : 255.255.255.0' },
      { type: 'output', text: '   Default Gateway . . . . : 192.168.1.1' },
    ];
  }

  if (lower === 'tasklist') {
    return [
      { type: 'output', text: 'Image Name          PID  Mem Usage' },
      { type: 'output', text: '==================  ===  =========' },
      { type: 'output', text: 'explorer.exe        42   128,420 K' },
      { type: 'output', text: 'chrome.exe          99   2,048,000 K' },
      { type: 'output', text: 'chrome.exe          100  1,024,000 K' },
      { type: 'output', text: 'chrome.exe          101  512,000 K' },
      { type: 'output', text: 'chrome.exe          102  256,000 K' },
      { type: 'output', text: 'chrome.exe          103  128,000 K' },
      { type: 'output', text: '(Chrome is using 98% of your RAM, as usual.)' },
    ];
  }

  return [{
    type: 'error',
    text: `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file. Try "help" for a list of commands.`,
  }];
}

export function Terminal({ windowId }: AppProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'welcome', text: 'Windows Terminal' },
    { type: 'welcome', text: 'Copyright (C) Microsoft Corporation. All rights reserved.' },
    { type: 'welcome', text: 'Type "help" for a list of available commands.' },
    { type: 'welcome', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const handleSubmit = useCallback(() => {
    const cmd = input.trim();
    const result = handleCommand(cmd);

    if (cmd) {
      setCmdHistory((prev) => [...prev, cmd]);
      setCmdIndex(-1);
    }

    // Special case: clear
    if (result.length === 1 && result[0].text === '__CLEAR__') {
      setHistory([]);
      setInput('');
      return;
    }

    const newEntries: HistoryEntry[] = [
      { type: 'command', text: `${PROMPT}${input}` },
      ...result,
      { type: 'welcome', text: '' },
    ];

    setHistory((prev) => [...prev, ...newEntries]);
    setInput('');
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex = cmdIndex === -1 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex >= 0) {
        const newIndex = cmdIndex + 1;
        if (newIndex >= cmdHistory.length) {
          setCmdIndex(-1);
          setInput('');
        } else {
          setCmdIndex(newIndex);
          setInput(cmdHistory[newIndex]);
        }
      }
    }
  }, [handleSubmit, cmdHistory, cmdIndex]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.terminal} onClick={focusInput}>
      <div className={styles.output} ref={outputRef}>
        {history.map((entry, i) => (
          <div key={i} className={styles.line}>
            {entry.type === 'command' ? (
              <span className={styles.prompt}>{entry.text}</span>
            ) : entry.type === 'error' ? (
              <span className={styles.error}>{entry.text}</span>
            ) : entry.type === 'ascii' ? (
              <span className={styles.ascii}>{entry.text}</span>
            ) : (
              <span>{entry.text}</span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.inputLine}>
        <span className={styles.inputPrompt}>{PROMPT}</span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
}
