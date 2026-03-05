'use client';

import { useState } from 'react';
import type { ProspectParams } from '@/types';
import ProgressBar from './ProgressBar';
import ProjectCards from './ProjectCards';
import type { ProjectType } from './ProjectCards';

type Brief = {
  id: string;
  project_type: string;
  title: string;
  summary: string;
  deliverables: string[];
  stack: string[];
  day_by_day: { day: number; label: string; tasks: string[] }[];
};

type ChatProps = {
  params: ProspectParams;
  onBriefComplete: (brief: { submitted: true }) => void;
  onStepChange?: (step: number) => void;
};

export default function Chat({ params, onBriefComplete, onStepChange }: ChatProps) {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [seenBriefIds, setSeenBriefIds] = useState<string[]>([]);
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [notes, setNotes] = useState('');

  // Step 3
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<'visio' | 'email' | 'telephone'>('visio');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function goToStep(s: number) {
    setStep(s);
    onStepChange?.(s);
  }

  async function fetchBrief(type: ProjectType, excludeIds: string[] = []) {
    setLoadingBrief(true);
    try {
      const res = await fetch(`/api/briefs?type=${type}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const b = data.brief as Brief;

      // If we got a brief we already saw and there might be others, retry once
      if (excludeIds.includes(b.id)) {
        const res2 = await fetch(`/api/briefs?type=${type}`);
        if (res2.ok) {
          const data2 = await res2.json();
          const b2 = data2.brief as Brief;
          if (!excludeIds.includes(b2.id)) {
            setBrief(b2);
            setSeenBriefIds([...excludeIds, b2.id]);
            return;
          }
        }
      }

      setBrief(b);
      setSeenBriefIds([...excludeIds, b.id]);
    } catch {
      // fallback: keep current brief if any
    } finally {
      setLoadingBrief(false);
    }
  }

  async function handleCardClick(type: ProjectType) {
    setProjectType(type);
    await fetchBrief(type);
    goToStep(2);
  }

  async function handleAnotherBrief() {
    if (!projectType) return;
    await fetchBrief(projectType, seenBriefIds);
  }

  async function handleSubmit() {
    if (!brief || !email.trim()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          project_type: projectType,
          brief_id: brief.id,
          notes: notes.trim() || null,
          contact_method: contactMethod,
          company: params.company ?? null,
          sector: params.sector ?? null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || 'Erreur lors de la soumission');
        return;
      }

      setSubmitted(true);
      onBriefComplete({ submitted: true });
    } catch {
      setSubmitError('Erreur de connexion. Reessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Step 1: Choose project type ──
  if (step === 1) {
    return (
      <div className="flex flex-1 flex-col px-4 sm:px-6" style={{ justifyContent: 'center', paddingBottom: '15vh' }}>
        <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center gap-6">
          <ProgressBar currentStep={1} hideLabels />
          <h1
            className="animate-fade-in text-center text-2xl font-bold sm:text-3xl"
            style={{ color: 'var(--charcoal-900)' }}
          >
            Quel projet avez-vous en t&#234;te ?
          </h1>
          <ProjectCards
            onCardClick={handleCardClick}
            disabled={loadingBrief}
            loadingType={loadingBrief ? projectType : null}
          />
        </div>
      </div>
    );
  }

  // ── Step 2: Brief display ──
  if (step === 2 && brief) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-[42rem]">
          <ProgressBar currentStep={2} hideLabels />

          <div className="mt-6 animate-fade-in">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: 'var(--charcoal-900)' }}
            >
              {brief.title}
            </h2>
            <p
              className="mt-3 text-[15px] leading-relaxed"
              style={{ color: 'var(--charcoal-700)' }}
            >
              {brief.summary}
            </p>

            {/* Deliverables */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                Livrables
              </h3>
              <ul className="mt-2 space-y-2">
                {brief.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--charcoal-700)' }}>
                    <span style={{ color: 'var(--accent)', marginTop: 2 }}>&#10003;</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Day by day */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                Planning 5 jours
              </h3>
              <div className="mt-3 space-y-3">
                {brief.day_by_day.map((day) => (
                  <div
                    key={day.day}
                    className="glass"
                    style={{ borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: 'var(--accent)' }}
                      >
                        {day.day}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--charcoal-900)' }}>
                        {day.label}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 pl-8">
                      {day.tasks.map((t, i) => (
                        <li key={i} className="text-xs" style={{ color: 'var(--charcoal-500)' }}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {brief.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: 'var(--cream-200)',
                    color: 'var(--charcoal-700)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Notes */}
            <div className="mt-8">
              <label className="text-sm font-medium" style={{ color: 'var(--charcoal-700)' }}>
                Quelque chose &#224; ajouter ? (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contraintes particulieres, preferences, details..."
                rows={3}
                className="chat-input mt-2 w-full resize-none bg-white px-4 py-3 text-sm outline-none"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--charcoal-200)',
                }}
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => goToStep(3)}
                className="cta-button flex-1 rounded-xl px-6 py-3 text-sm font-semibold text-white"
                style={{ background: 'var(--accent)' }}
              >
                Ca me va, on continue
              </button>
              <button
                onClick={handleAnotherBrief}
                disabled={loadingBrief}
                className="cta-button rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50"
                style={{
                  background: 'var(--cream-100)',
                  color: 'var(--charcoal-700)',
                  border: '1px solid var(--charcoal-200)',
                }}
              >
                {loadingBrief ? 'Chargement...' : 'Voir un autre brief'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 3: Contact & commitment ──
  if (step === 3 && !submitted) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-[42rem]">
          <ProgressBar currentStep={3} hideLabels />

          <div className="mt-6 animate-fade-in">
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: 'var(--charcoal-900)' }}
            >
              Derniere etape
            </h2>
            <p className="mt-2 text-[15px]" style={{ color: 'var(--charcoal-500)' }}>
              Je construis votre projet en 5 jours. Pour vous recontacter avec le resultat, j&apos;ai besoin de quelques infos.
            </p>

            {/* Email */}
            <div className="mt-6">
              <label className="text-sm font-medium" style={{ color: 'var(--charcoal-700)' }}>
                Votre email professionnel
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubmitError(null); }}
                placeholder="prenom@votreentreprise.com"
                className="chat-input mt-2 w-full bg-white px-4 py-3 text-sm outline-none"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--charcoal-200)',
                }}
              />
              <p className="mt-1 text-xs" style={{ color: 'var(--charcoal-400)' }}>
                Adresse professionnelle uniquement (pas de Gmail, Yahoo, etc.)
              </p>
            </div>

            {/* Contact method */}
            <div className="mt-6">
              <label className="text-sm font-medium" style={{ color: 'var(--charcoal-700)' }}>
                Comment souhaitez-vous decouvrir le resultat ?
              </label>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                {([
                  { value: 'visio' as const, label: 'Visio (15 min)', icon: '\uD83C\uDFA5' },
                  { value: 'email' as const, label: 'Par email', icon: '\u2709\uFE0F' },
                  { value: 'telephone' as const, label: 'Telephone', icon: '\uD83D\uDCDE' },
                ]).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setContactMethod(option.value)}
                    className="glass flex flex-1 items-center gap-2 px-4 py-3 text-sm font-medium transition-all"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      borderColor: contactMethod === option.value ? 'var(--accent)' : 'transparent',
                      borderWidth: 2,
                      borderStyle: 'solid',
                      color: contactMethod === option.value ? 'var(--accent)' : 'var(--charcoal-700)',
                    }}
                  >
                    <span>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Warning / commitment */}
            <div
              className="mt-8 rounded-xl px-5 py-4"
              style={{
                background: 'var(--cream-200)',
                border: '1px solid var(--cream-300)',
              }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--charcoal-900)' }}>
                Avant de valider
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--charcoal-700)' }}>
                Ce defi me demande 5 jours de travail reel sur votre projet.
                En cliquant ci-dessous, vous acceptez simplement de prendre <strong>15 minutes</strong> au
                terme du defi pour decouvrir le resultat ensemble &mdash; que vous donniez suite ou non.
                C&apos;est tout ce que je demande.
              </p>
            </div>

            {/* Error */}
            {submitError && (
              <div
                className="mt-4 rounded-lg px-4 py-3 text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red-500)' }}
              >
                {submitError}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !email.trim()}
              className="cta-button mt-6 w-full rounded-xl px-6 py-4 text-base font-bold text-white disabled:opacity-50"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 4px 20px var(--accent-light, rgba(249,103,67,0.3))',
              }}
            >
              {submitting ? 'Envoi en cours...' : 'C\'est parti, je joue le jeu'}
            </button>

            <button
              onClick={() => goToStep(2)}
              className="mt-3 w-full py-2 text-sm font-medium"
              style={{ color: 'var(--charcoal-400)' }}
            >
              &#8592; Revenir au brief
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ──
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center animate-scale-in">
        <div className="text-5xl">&#127881;</div>
        <h2
          className="mt-4 text-2xl font-bold"
          style={{ color: 'var(--charcoal-900)' }}
        >
          C&apos;est parti !
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--charcoal-500)' }}>
          Je me mets au travail des aujourd&apos;hui. Rendez-vous dans 5 jours
          pour decouvrir votre <strong>{brief?.title}</strong>.
        </p>
        <p className="mt-4 text-sm" style={{ color: 'var(--charcoal-400)' }}>
          Un email de confirmation a ete envoye a <strong>{email}</strong>.
        </p>
      </div>
    </div>
  );
}
