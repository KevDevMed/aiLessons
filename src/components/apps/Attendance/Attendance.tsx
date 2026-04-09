import { useState, useMemo, useCallback } from 'react';
import { AppProps } from '../../../types/app';
import {
  lessonAttendance,
  type AttendanceParticipant,
  type LessonAttendance,
} from '../../../data/lessonAttendance';
import styles from './Attendance.module.css';

type SortKey = 'name' | 'role' | 'duration' | 'firstJoin';
type SortDir = 'asc' | 'desc';

export function Attendance({ windowId }: AppProps) {
  void windowId;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('duration');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sessions = useMemo(
    () => [...lessonAttendance].sort((a, b) => a.sessionNumber - b.sessionNumber),
    []
  );

  const selected: LessonAttendance | undefined = selectedId
    ? lessonAttendance.find((l) => l.lessonId === selectedId)
    : undefined;

  const sortedParticipants = useMemo(() => {
    if (!selected) return [];
    const list = [...selected.participants];
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'role':
          cmp = a.role.localeCompare(b.role);
          break;
        case 'duration':
          cmp = a.durationSeconds - b.durationSeconds;
          break;
        case 'firstJoin':
          cmp = a.firstJoin.localeCompare(b.firstJoin);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [selected, sortKey, sortDir]);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir(key === 'duration' ? 'desc' : 'asc');
      }
    },
    [sortKey]
  );

  if (selected) {
    return (
      <div className={styles.app}>
        <div className={styles.header}>
          <button
            className={styles.backBtn}
            onClick={() => setSelectedId(null)}
            title="Back to overview"
          >
            ← Overview
          </button>
          <div className={styles.headerTitle}>
            <span className={styles.headerSession}>Session {selected.sessionNumber}</span>
            <span className={styles.headerSep}>—</span>
            <span className={styles.headerMeeting}>{selected.meetingTitle}</span>
          </div>
        </div>
        <div className={styles.detailBody}>
          <div className={styles.summaryGrid}>
            <SummaryStat label="Date" value={selected.date} />
            <SummaryStat label="Start" value={selected.startTime} />
            <SummaryStat label="End" value={selected.endTime} />
            <SummaryStat
              label="Attended"
              value={String(selected.attendedCount)}
              highlight
            />
            <SummaryStat label="Duration" value={selected.meetingDurationLabel} />
            <SummaryStat
              label="Avg attendance"
              value={selected.averageAttendanceLabel}
            />
          </div>

          <div className={styles.tableWrap}>
            <div className={styles.tableHead}>
              <div
                className={`${styles.colName} ${styles.sortable}`}
                onClick={() => toggleSort('name')}
              >
                Name{renderArrow(sortKey, sortDir, 'name')}
              </div>
              <div
                className={`${styles.colRole} ${styles.sortable}`}
                onClick={() => toggleSort('role')}
              >
                Role{renderArrow(sortKey, sortDir, 'role')}
              </div>
              <div className={styles.colEmail}>Email</div>
              <div
                className={`${styles.colJoin} ${styles.sortable}`}
                onClick={() => toggleSort('firstJoin')}
              >
                First Join{renderArrow(sortKey, sortDir, 'firstJoin')}
              </div>
              <div
                className={`${styles.colDuration} ${styles.sortable}`}
                onClick={() => toggleSort('duration')}
              >
                Duration{renderArrow(sortKey, sortDir, 'duration')}
              </div>
            </div>
            <div className={styles.tableBody}>
              {sortedParticipants.length === 0 ? (
                <div className={styles.empty}>No participants recorded.</div>
              ) : (
                sortedParticipants.map((p) => (
                  <ParticipantRow
                    key={`${p.email}-${p.name}`}
                    participant={p}
                    meetingDurationSeconds={selected.meetingDurationSeconds}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>Attendance Reports</div>
      </div>
      <div className={styles.overviewBody}>
        <div className={styles.cardGrid}>
          {sessions.map((s) => (
            <button
              key={s.lessonId}
              className={styles.card}
              onClick={() => setSelectedId(s.lessonId)}
            >
              <div className={styles.cardTop}>
                <div className={styles.cardSession}>Session {s.sessionNumber}</div>
                <div className={styles.cardDate}>{s.date}</div>
              </div>
              <div className={styles.cardTitle}>{s.meetingTitle}</div>
              <div className={styles.cardStats}>
                <div className={styles.cardCount}>
                  <div className={styles.cardCountValue}>{s.attendedCount}</div>
                  <div className={styles.cardCountLabel}>attended</div>
                </div>
                <div className={styles.cardSecondary}>
                  <div className={styles.cardStat}>
                    <div className={styles.cardStatLabel}>Duration</div>
                    <div className={styles.cardStatValue}>
                      {s.meetingDurationLabel}
                    </div>
                  </div>
                  <div className={styles.cardStat}>
                    <div className={styles.cardStatLabel}>Avg</div>
                    <div className={styles.cardStatValue}>
                      {s.averageAttendanceLabel}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderArrow(sortKey: SortKey, sortDir: SortDir, col: SortKey): string {
  if (sortKey !== col) return '';
  return sortDir === 'asc' ? ' ▲' : ' ▼';
}

function SummaryStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? styles.statHighlight : styles.stat}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}

function ParticipantRow({
  participant,
  meetingDurationSeconds,
}: {
  participant: AttendanceParticipant;
  meetingDurationSeconds: number;
}) {
  const pct =
    meetingDurationSeconds > 0
      ? Math.min(100, (participant.durationSeconds / meetingDurationSeconds) * 100)
      : 0;
  const displayName = participant.name.replace(/\s*\(External\)\s*$/, '');
  const joinTime = participant.firstJoin.split(',')[1]?.trim() || participant.firstJoin;
  return (
    <div className={styles.row}>
      <div className={styles.colName}>
        <span className={styles.nameText} title={participant.name}>
          {displayName}
        </span>
        {participant.isExternal && (
          <span className={styles.badgeExternal}>External</span>
        )}
      </div>
      <div className={styles.colRole}>
        <span className={roleBadgeClass(participant.role)}>{participant.role}</span>
      </div>
      <div className={styles.colEmail} title={participant.email}>
        {participant.email}
      </div>
      <div className={styles.colJoin}>{joinTime}</div>
      <div className={styles.colDuration}>
        <div className={styles.durationBarWrap}>
          <div className={styles.durationBar} style={{ width: `${pct}%` }} />
          <span className={styles.durationLabel}>{participant.durationLabel}</span>
        </div>
      </div>
    </div>
  );
}

function roleBadgeClass(role: string): string {
  if (/organizer/i.test(role)) {
    return `${styles.roleBadge} ${styles.roleOrganizer}`;
  }
  if (/presenter/i.test(role)) {
    return `${styles.roleBadge} ${styles.rolePresenter}`;
  }
  return styles.roleBadge;
}
