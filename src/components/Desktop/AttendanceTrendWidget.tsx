import { useMemo } from 'react';
import { lessonAttendance } from '../../data/lessonAttendance';
import { useAppStore } from '../../stores/useAppStore';
import styles from './AttendanceTrendWidget.module.css';

const CHART_W = 260;
const CHART_H = 86;
const PAD_X = 14;
const PAD_TOP = 10;
const PAD_BOTTOM = 22;

export default function AttendanceTrendWidget() {
  const launchApp = useAppStore((s) => s.launchApp);

  const sessions = useMemo(
    () => [...lessonAttendance].sort((a, b) => a.sessionNumber - b.sessionNumber),
    []
  );

  const chart = useMemo(() => {
    if (sessions.length === 0) {
      return { points: [], path: '', area: '', max: 0, min: 0 };
    }
    const counts = sessions.map((s) => s.attendedCount);
    const rawMax = Math.max(...counts);
    const rawMin = Math.min(...counts);
    // Add 10% headroom so the peak isn't pinned to the top edge.
    const max = rawMax + Math.max(2, Math.round(rawMax * 0.1));
    const min = Math.max(0, rawMin - Math.max(1, Math.round(rawMin * 0.1)));
    const span = Math.max(1, max - min);
    const innerW = CHART_W - PAD_X * 2;
    const innerH = CHART_H - PAD_TOP - PAD_BOTTOM;
    const stepX = sessions.length > 1 ? innerW / (sessions.length - 1) : 0;

    const points = sessions.map((s, i) => {
      const x = PAD_X + stepX * i;
      const yNorm = (s.attendedCount - min) / span;
      const y = PAD_TOP + innerH * (1 - yNorm);
      return { x, y, session: s };
    });

    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(' ');

    const areaBottom = PAD_TOP + innerH;
    const area =
      points.length > 0
        ? `M ${points[0].x.toFixed(2)} ${areaBottom.toFixed(2)} ` +
          points
            .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
            .join(' ') +
          ` L ${points[points.length - 1].x.toFixed(2)} ${areaBottom.toFixed(2)} Z`
        : '';

    return { points, path, area, max, min };
  }, [sessions]);

  if (sessions.length === 0) {
    return null;
  }

  const latest = sessions[sessions.length - 1];
  const previous = sessions.length > 1 ? sessions[sessions.length - 2] : null;
  const delta = previous ? latest.attendedCount - previous.attendedCount : 0;
  const deltaLabel =
    previous === null
      ? ''
      : delta === 0
      ? '±0'
      : delta > 0
      ? `+${delta}`
      : `${delta}`;
  const deltaClass =
    previous === null
      ? ''
      : delta > 0
      ? styles.deltaUp
      : delta < 0
      ? styles.deltaDown
      : styles.deltaFlat;

  return (
    <button
      className={styles.widget}
      onClick={() => launchApp('attendance')}
      title="Open Attendance Reports"
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.title}>Attendance Trend</div>
          <div className={styles.subtitle}>Attended per session</div>
        </div>
        <div className={styles.latestGroup}>
          <div className={styles.latestRow}>
            <div className={styles.latestValue}>{latest.attendedCount}</div>
            {previous && (
              <div className={`${styles.delta} ${deltaClass}`}>{deltaLabel}</div>
            )}
          </div>
          <div className={styles.avgTime}>
            <span className={styles.avgLabel}>avg</span> {latest.averageAttendanceLabel}
          </div>
        </div>
      </div>

      <svg
        className={styles.chart}
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="attendance-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--win-accent-light)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--win-accent-light)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid baseline */}
        <line
          x1={PAD_X}
          x2={CHART_W - PAD_X}
          y1={CHART_H - PAD_BOTTOM}
          y2={CHART_H - PAD_BOTTOM}
          className={styles.baseline}
        />

        {/* Filled area under the line */}
        {chart.area && <path d={chart.area} fill="url(#attendance-area)" />}

        {/* The line */}
        {chart.path && (
          <path
            d={chart.path}
            className={styles.line}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Point markers + labels */}
        {chart.points.map((p) => (
          <g key={p.session.lessonId}>
            <circle cx={p.x} cy={p.y} r={3.2} className={styles.dot} />
            <text
              x={p.x}
              y={p.y - 6}
              className={styles.pointValue}
              textAnchor="middle"
            >
              {p.session.attendedCount}
            </text>
            <text
              x={p.x}
              y={CHART_H - 6}
              className={styles.xLabel}
              textAnchor="middle"
            >
              S{p.session.sessionNumber}
            </text>
          </g>
        ))}
      </svg>
    </button>
  );
}
