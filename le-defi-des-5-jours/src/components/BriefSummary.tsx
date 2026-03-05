'use client';

import { useEffect, useRef, useState } from 'react';
import type { BriefData } from '@/types';

type BriefSummaryProps = {
  briefData: BriefData;
  company?: string;
  contact?: string;
};

const SECTION_LABELS: Record<string, string> = {
  problem: 'Problème',
  users: 'Utilisateurs cibles',
  current_solution: 'Solution actuelle',
  desired_outcome: 'Résultat attendu',
  five_day_scope: 'Périmètre 5 jours',
  suggested_deliverable: 'Livrable suggéré',
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
  // Capture les valeurs initiales pour l'envoi unique au montage (safe, ces props ne changent jamais)
  const initialRef = useRef({ briefData, company, contact });
  // AC 4.2.5 — message de doublon si 409 détecté
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  // M3 — erreur non-409 lors de l'envoi du brief
  const [sendError, setSendError] = useState<string | null>(null);

  // Envoi optimiste du brief par email au montage
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
        // AC 4.2.5 — détecter la soumission en doublon (409)
        if (response.status === 409) {
          const displayName = comp ?? brief.company ?? 'votre entreprise';
          setDuplicateWarning(`Un brief a déjà été soumis pour ${displayName}`);
        } else if (!response.ok) {
          // M3 — erreurs non-409 : message discret, non bloquant
          setSendError("L'envoi du brief a échoué. Fakossa le recevra lors de votre RDV.");
        }
      } catch (error) {
        console.error('Erreur envoi brief:', error);
        setSendError("L'envoi du brief a échoué. Fakossa le recevra lors de votre RDV.");
      }
    };
    sendBrief();
  }, []);

  const companyName = company ?? briefData.company ?? 'Votre entreprise';
  const destinataire = contact ?? briefData.contact ?? null;
  const message = destinataire
    ? `Fakossa a reçu votre brief. Il revient vers ${destinataire} sous 24h avec une proposition.`
    : 'Fakossa a reçu votre brief. Il revient vers vous sous 24h avec une proposition.';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Titre "Brief prêt !" */}
      <h1
        className="text-center mb-6"
        style={{ color: 'var(--emerald-500)', font: 'var(--font-h1)' }}
      >
        Brief prêt !
      </h1>

      {/* Carte du brief */}
      <div
        className="rounded-[20px] p-6 mb-6"
        style={{
          backgroundColor: 'var(--cream-100)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Titre de la carte */}
        <h2
          className="mb-4 uppercase tracking-wide"
          style={{ color: 'var(--charcoal-900)', font: 'var(--font-h2)' }}
        >
          BRIEF PROJET — {companyName}
        </h2>

        {/* Sections du brief */}
        <div className="flex flex-col gap-4">
          {SECTION_ORDER.filter(
            (key) => briefData[key as keyof BriefData] && briefData[key as keyof BriefData] !== ''
          ).map((key) => (
            <div key={key}>
              <p
                className="font-semibold mb-1"
                style={{ color: 'var(--charcoal-700)', font: 'var(--font-small)' }}
              >
                {SECTION_LABELS[key]}
              </p>
              <p style={{ color: 'var(--charcoal-900)', font: 'var(--font-body)' }}>
                {briefData[key as keyof BriefData]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Message de confirmation personnalisé */}
      <p
        className="text-center mb-6"
        style={{ color: 'var(--charcoal-700)', font: 'var(--font-body)' }}
      >
        {message}
      </p>

      {/* AC 4.2.5 — Message doublon (style warning, non intrusif) */}
      {duplicateWarning && (
        <p
          className="text-center mb-4"
          style={{ color: '#F97316', font: 'var(--font-small)' }}
        >
          ⚠️ {duplicateWarning}
        </p>
      )}

      {/* M3 — Message d'erreur d'envoi discret */}
      {sendError && (
        <p
          className="text-center mb-4"
          style={{ color: 'var(--charcoal-700)', font: 'var(--font-small)' }}
        >
          {sendError}
        </p>
      )}

      {/* Bouton CTA Calendly — toujours actif (M1) */}
      <div className="flex justify-center">
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-[var(--radius-md)] font-semibold"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--cream-50)',
            font: 'var(--font-body)',
            minHeight: '44px',
          }}
        >
          Prendre RDV directement →
        </a>
      </div>
    </div>
  );
}
