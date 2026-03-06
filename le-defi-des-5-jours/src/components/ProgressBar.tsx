'use client';

export const STEP_NAMES = ['Projet', 'Brief', 'Engagement'];

export function getProgressPercentage(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  return Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
}

export function getStepName(step: number): string {
  return STEP_NAMES[step - 1] ?? '';
}

export function isComplete(currentStep: number, totalSteps: number): boolean {
  return currentStep >= totalSteps;
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  hideLabels?: boolean;
}

export default function ProgressBar({ currentStep, totalSteps = 5, hideLabels }: ProgressBarProps) {
  const displayStep = Math.max(1, currentStep);
  const complete = isComplete(currentStep, totalSteps);

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isPast = stepNum < displayStep;
        const isCurrent = stepNum === displayStep;
        const stepName = STEP_NAMES[i] ?? '';

        return (
          <div key={stepNum} className="flex flex-1 items-center gap-1.5">
            {/* Step dot */}
            <div
              className={`step-dot flex items-center justify-center ${isCurrent ? 'active' : ''}`}
              style={{
                width: isCurrent ? 28 : 22,
                height: isCurrent ? 28 : 22,
                borderRadius: '50%',
                fontSize: '10px',
                fontWeight: 700,
                flexShrink: 0,
                ...(isPast || complete
                  ? {
                      background: 'var(--emerald-500)',
                      color: 'white',
                    }
                  : isCurrent
                    ? {
                        background: 'var(--accent)',
                        color: 'white',
                        boxShadow: '0 0 0 3px var(--accent-light, rgba(249,103,67,0.2))',
                      }
                    : {
                        background: 'var(--charcoal-100)',
                        color: 'var(--charcoal-400)',
                      }),
              }}
            >
              {isPast || complete ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                stepNum
              )}
            </div>

            {/* Step label (only on sm+ and when not hidden) */}
            {!hideLabels && (
              <span
                className="hidden text-[10px] font-medium sm:inline"
                style={{
                  color: isCurrent
                    ? 'var(--charcoal-900)'
                    : isPast
                      ? 'var(--emerald-600)'
                      : 'var(--charcoal-400)',
                }}
              >
                {stepName}
              </span>
            )}

            {/* Connector line */}
            {stepNum < totalSteps && (
              <div
                className="flex-1"
                style={{
                  height: 2,
                  borderRadius: 1,
                  background: isPast
                    ? 'var(--emerald-500)'
                    : 'var(--charcoal-200)',
                  transition: 'background 500ms ease',
                  minWidth: 8,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
