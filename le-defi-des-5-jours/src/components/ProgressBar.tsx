'use client';

export const STEP_NAMES = ['Problème', 'Contexte', 'Existant', 'Résultat', 'Priorité'];

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
}

export default function ProgressBar({ currentStep, totalSteps = 5 }: ProgressBarProps) {
  const displayStep = Math.max(1, currentStep);
  const percentage = getProgressPercentage(currentStep, totalSteps);
  const complete = isComplete(currentStep, totalSteps);
  const stepName = getStepName(displayStep);

  return (
    <div className="w-full px-[var(--space-md)] py-[var(--space-xs)]">
      <p className="mb-1 text-xs font-medium text-[var(--charcoal-500)]">
        Étape {displayStep}/{totalSteps} — {stepName}
      </p>
      <div
        className="h-1 w-full rounded-full bg-[var(--charcoal-200)]"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Étape ${displayStep} sur ${totalSteps} : ${stepName}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-in-out ${
            complete ? 'bg-[var(--emerald-500)]' : 'bg-[var(--accent)]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
