'use client';

import { useEffect, useRef, useState } from 'react';
import type { BriefData } from '@/types';

type BriefSummaryProps = {
  briefData: BriefData;
  company?: string;
  contact?: string;
};

const SECTION_LABELS: Record<string, string> = {
  problem: 'Probleme',
  users: 'Utilisateurs cibles',
  current_solution: 'Solution actuelle',
  desired_outcome: 'Resultat attendu',
  five_day_scope: 'Perimetre 5 jours',
  suggested_deliverable: 'Livrable suggere',
};

const SECTION_ICONS: Record<string, string> = {
  problem: '!',
  users: 'U',
  current_solution: 'S',
  desired_outcome: 'R',
  five_day_scope: '5',
  suggested_deliverable: 'L',
};

const SECTION_ORDER = [
  'problem',
  'users',
  'current_solution',
  'desired_outcome',
  'five_day_scope',
  'suggested_deliverable',
];

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/fakossa';

export default function BriefSummary({ briefData, company, contact }: BriefSummaryProps) {
  const initialRef = useRef({ briefData, company, contact });
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    const { briefData: brief, company: comp, contact: cont } = initialRef.current;
    const sendBrief = async () => {
      try {
        const response = await fetch('/api/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brief,
            metadata: {
              company: comp ?? brief.company,
              contact: cont ?? brief.contact,
              sector: brief.sector,
              source: 'chat',
              timestamp: new Date().toISOString(),
            },
          }),
        });
        if (response.status === 409) {
          const displayName = comp ?? brief.company ?? 'votre entreprise';
          setDuplicateWarning(`Un brief a deja ete soumis pour ${displayName}`);
        } else if (!response.ok) {
          setSendError("L'envoi du brief a echoue. Fakossa le recevra lors de votre RDV.");
        }
      } catch (error) {
        console.error('Erreur envoi brief:', error);
        setSendError("L'envoi du brief a echoue. Fakossa le recevra lors de votre RDV.");
      }
    };
    sendBrief();
  }, []);

  const companyName = company ?? briefData.company ?? 'Votre entreprise';
  const destinataire = contact ?? briefData.contact ?? null;
  const message = destinataire
    ? `Fakossa a recu votre brief. Il revient vers ${destinataire} sous 24h avec une proposition.`
    : 'Fakossa a recu votre brief. Il revient vers vous sous 24h avec une proposition.';

  return (
    <div className="relative w-full max-w-[42rem] mx-auto px-4 py-8 sm:px-6">
      {/* Background blobs */}
      <div
        className="blob"
        style={{
          width: 250,
          height: 250,
          top: '-5%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)',
        }}
      />

      {/* Success icon */}
      <div
        className="animate-scale-in mx-auto mb-6 flex items-center justify-center"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--emerald-50)',
          border: '2px solid var(--emerald-500)',
          boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.1)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1
        className="animate-fade-in text-center mb-2"
        style={{ color: 'var(--charcoal-900)', font: 'var(--font-h1)' }}
      >
        Brief pret !
      </h1>

      <p
        className="animate-fade-in text-center mb-8"
        style={{ color: 'var(--charcoal-500)', font: 'var(--font-body)', animationDelay: '100ms' }}
      >
        {message}
      </p>

      {/* Brief card */}
      <div
        className="brief-card glass animate-scale-in mb-6"
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          animationDelay: '200ms',
        }}
      >
        {/* Card header */}
        <div
          className="flex items-center gap-3 mb-6 pb-4"
          style={{ borderBottom: '1px solid var(--charcoal-200)' }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent-light, rgba(249,103,67,0.3))',
            }}
          />
          <h2
            className="uppercase tracking-widest"
            style={{
              color: 'var(--charcoal-900)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            Brief Projet - {companyName}
          </h2>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-5">
          {SECTION_ORDER.filter(
            (key) => briefData[key as keyof BriefData] && briefData[key as keyof BriefData] !== ''
          ).map((key, i) => (
            <div
              key={key}
              className="animate-slide-up flex gap-4"
              style={{ animationDelay: `${300 + i * 80}ms` }}
            >
              <div
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: 'var(--accent-light, rgba(249,103,67,0.1))',
                  color: 'var(--accent)',
                  fontSize: '12px',
                  fontWeight: 800,
                  marginTop: 2,
                }}
              >
                {SECTION_ICONS[key]}
              </div>
              <div className="flex-1">
                <p
                  className="font-semibold mb-1"
                  style={{
                    color: 'var(--charcoal-700)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {SECTION_LABELS[key]}
                </p>
                <p style={{ color: 'var(--charcoal-900)', font: 'var(--font-body)' }}>
                  {briefData[key as keyof BriefData]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {duplicateWarning && (
        <p
          className="animate-fade-in text-center mb-4"
          style={{ color: '#F97316', font: 'var(--font-small)' }}
        >
          {duplicateWarning}
        </p>
      )}

      {sendError && (
        <p
          className="animate-fade-in text-center mb-4"
          style={{ color: 'var(--charcoal-700)', font: 'var(--font-small)' }}
        >
          {sendError}
        </p>
      )}

      {/* CTA Button */}
      <div
        className="animate-slide-up flex justify-center"
        style={{ animationDelay: '600ms' }}
      >
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 font-semibold"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            font: 'var(--font-body)',
            fontWeight: 600,
            minHeight: '50px',
            boxShadow: '0 4px 20px var(--accent-light, rgba(249,103,67,0.3))',
          }}
        >
          Prendre RDV directement
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  );
}
