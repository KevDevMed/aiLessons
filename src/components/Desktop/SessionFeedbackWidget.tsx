import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useI18n } from '../../hooks/useI18n';
import { usePlayerStore } from '../../stores/usePlayerStore';
import styles from './SessionFeedbackWidget.module.css';

// Feedback is grouped into a single bucket rather than per lesson. The
// widget asks general questions about the overall course experience, so
// each device submits one row regardless of which session they attended.
const FEEDBACK_BUCKET = 'general';

// Keep in sync with the validators in convex/sessionFeedback.ts.
// 5 questions × 5 options. Each question is a stable id ('q1'..'q5') mapped
// to translation keys resolved at render time via useI18n().
const QUESTIONS: ReadonlyArray<{
  id: string;
  textKey: string;
  optionKeys: readonly [string, string, string, string, string];
}> = [
  {
    id: 'q1',
    textKey: 'feedback.q1',
    optionKeys: [
      'feedback.q1.o1',
      'feedback.q1.o2',
      'feedback.q1.o3',
      'feedback.q1.o4',
      'feedback.q1.o5',
    ],
  },
  {
    id: 'q2',
    textKey: 'feedback.q2',
    optionKeys: [
      'feedback.q2.o1',
      'feedback.q2.o2',
      'feedback.q2.o3',
      'feedback.q2.o4',
      'feedback.q2.o5',
    ],
  },
  {
    id: 'q3',
    textKey: 'feedback.q3',
    optionKeys: [
      'feedback.q3.o1',
      'feedback.q3.o2',
      'feedback.q3.o3',
      'feedback.q3.o4',
      'feedback.q3.o5',
    ],
  },
  {
    id: 'q4',
    textKey: 'feedback.q4',
    optionKeys: [
      'feedback.q4.o1',
      'feedback.q4.o2',
      'feedback.q4.o3',
      'feedback.q4.o4',
      'feedback.q4.o5',
    ],
  },
  {
    id: 'q5',
    textKey: 'feedback.q5',
    optionKeys: [
      'feedback.q5.o1',
      'feedback.q5.o2',
      'feedback.q5.o3',
      'feedback.q5.o4',
      'feedback.q5.o5',
    ],
  },
];

type Answer = { questionId: string; optionIndex: number };
type LocalPhase = 'asking' | 'submitting' | 'done';

export default function SessionFeedbackWidget() {
  const { t } = useI18n();
  const deviceId = usePlayerStore((s) => s.ensureDeviceId());
  const submitFeedback = useMutation(api.sessionFeedback.submitFeedback);

  const alreadySubmitted = useQuery(api.sessionFeedback.hasSubmittedFeedback, {
    sessionKey: FEEDBACK_BUCKET,
    deviceId,
  });

  // Local phase overrides the query-derived phase once the user starts
  // interacting. Derive the effective phase instead of syncing via useEffect
  // so we don't fight React StrictMode double-renders.
  const [localPhase, setLocalPhase] = useState<LocalPhase | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const phase: 'loading' | LocalPhase =
    localPhase ??
    (alreadySubmitted === undefined
      ? 'loading'
      : alreadySubmitted
      ? 'done'
      : 'asking');

  const handleOptionClick = async (optionIndex: number) => {
    if (phase !== 'asking') return;
    const q = QUESTIONS[currentIndex];
    const nextAnswers: Answer[] = [
      ...answers,
      { questionId: q.id, optionIndex },
    ];
    setAnswers(nextAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      // Lock phase locally so we no longer depend on the server query result.
      setLocalPhase('asking');
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // Last answer: submit synchronously from the click handler (NOT a
    // useEffect, which would double-fire under StrictMode). Blocking the
    // submit phase disables the option buttons while the mutation resolves.
    setLocalPhase('submitting');
    try {
      await submitFeedback({
        sessionKey: FEEDBACK_BUCKET,
        deviceId,
        answers: nextAnswers,
      });
      setLocalPhase('done');
    } catch {
      // On failure, drop back to asking so the user can retry by clicking
      // another option on the last question.
      setLocalPhase('asking');
    }
  };

  const subtitle =
    phase === 'loading'
      ? t('feedback.loading')
      : phase === 'done'
      ? t('feedback.subtitle')
      : t('feedback.progress')
          .replace('{current}', String(currentIndex + 1))
          .replace('{total}', String(QUESTIONS.length));

  const current = QUESTIONS[currentIndex];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.title}>{t('feedback.title')}</div>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
      </div>

      {phase === 'loading' && (
        <div className={styles.skeleton} aria-hidden="true" />
      )}

      {(phase === 'asking' || phase === 'submitting') && (
        <>
          <div className={styles.question}>{t(current.textKey)}</div>
          <div className={styles.options}>
            {current.optionKeys.map((optKey, i) => (
              <button
                key={optKey}
                type="button"
                className={styles.option}
                onClick={() => handleOptionClick(i)}
                disabled={phase === 'submitting'}
              >
                {t(optKey)}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'done' && (
        <div className={styles.doneState}>
          <div className={styles.doneTitle}>{t('feedback.thanks')}</div>
          <div className={styles.doneMessage}>{t('feedback.thanksMessage')}</div>
        </div>
      )}
    </div>
  );
}
