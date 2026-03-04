'use client';

import type { ProspectParams } from '@/types';

type LandingProps = {
  params: ProspectParams;
  onStart: () => void;
};

const STEPS = [
  {
    num: '01',
    title: 'On discute',
    desc: "Je te pose quelques questions pour cerner ton besoin en 5 minutes.",
  },
  {
    num: '02',
    title: 'Je prototypise',
    desc: "En 5 jours, je livre un prototype fonctionnel adapté à ton contexte.",
  },
  {
    num: '03',
    title: 'Tu valides',
    desc: "Tu testes, tu donnes ton avis, et on décide ensemble de la suite.",
  },
];

export default function Landing({ params, onStart }: LandingProps) {
  return (
    <main className="flex w-full max-w-[800px] flex-col gap-[var(--space-2xl)] px-[var(--space-md)] py-[var(--space-xl)] sm:px-[var(--space-lg)] lg:px-[var(--space-xl)]">
      {/* Titre */}
      <div className="flex flex-col gap-[var(--space-xs)]">
        <h1
          className="font-bold leading-tight tracking-tight"
          style={{ font: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 36px)' }}
        >
          LE DEFI 5 JOURS
          {params.company && (
            <span style={{ color: 'var(--accent)' }}> x {params.company}</span>
          )}
        </h1>

        {/* Bloc contextuel conditionnel */}
        {params.role && (
          <p
            className="mt-[var(--space-xs)]"
            style={{ font: 'var(--font-h3)', color: 'var(--charcoal-700)' }}
          >
            Vous cherchiez un(e) {params.role}...
          </p>
        )}
      </div>

      {/* 3 étapes */}
      <ol className="flex flex-col gap-[var(--space-md)]">
        {STEPS.map((step) => (
          <li key={step.num} className="flex gap-[var(--space-md)]">
            <span
              className="shrink-0 font-bold"
              style={{ color: 'var(--accent)', font: 'var(--font-h2)' }}
            >
              {step.num}
            </span>
            <div className="flex flex-col gap-[var(--space-xs)]">
              <p className="font-semibold" style={{ font: 'var(--font-h3)', color: 'var(--charcoal-900)' }}>
                {step.title}
              </p>
              <p style={{ font: 'var(--font-body)', color: 'var(--charcoal-700)' }}>
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* CTA */}
      <div className="flex flex-col items-center gap-[var(--space-sm)] sm:items-start">
        <button
          onClick={onStart}
          className="cta-button w-full sm:w-auto"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md) var(--space-xl)',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            minHeight: '44px',
            minWidth: '44px',
            border: 'none',
          }}
        >
          {'Commencer ->'}
        </button>
        <p
          className="text-center sm:text-left"
          style={{ font: 'var(--font-caption)', color: 'var(--charcoal-500)' }}
        >
          Zéro engagement. Gratuit.
        </p>
      </div>
    </main>
  );
}
