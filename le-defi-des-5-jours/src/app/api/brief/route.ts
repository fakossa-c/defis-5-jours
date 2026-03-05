import { NextRequest, NextResponse } from 'next/server';
import { sendBriefEmail } from '@/lib/send-brief';
import { checkDuplicateSubmission, markCompanySubmitted } from '@/lib/brief-store';
import type { BriefData, BriefMetadata } from '@/types';

export async function POST(request: NextRequest) {
  // Séparation du parse JSON pour éviter de retourner RESEND_ERROR sur un corps invalide
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Corps de requete invalide', code: 'VALIDATION_ERROR', retryable: false },
      { status: 400 }
    );
  }

  try {
    const { brief, metadata } = body as { brief: BriefData; metadata: BriefMetadata };

    if (!brief || !metadata) {
      return NextResponse.json(
        { success: false, error: 'Donnees manquantes', code: 'VALIDATION_ERROR', retryable: false },
        { status: 400 }
      );
    }

    // Validation des champs requis du brief
    if (!brief.problem || !brief.users || !brief.desired_outcome) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants dans le brief', code: 'VALIDATION_ERROR', retryable: false },
        { status: 400 }
      );
    }

    // AC 4.2.3 — Détection de soumission en doublon (avant envoi)
    // Skip si company est vide — les prospects anonymes ne doivent pas être bloqués
    const companyName = metadata.company || 'Prospect inconnu';
    if (metadata.company && checkDuplicateSubmission(companyName)) {
      return NextResponse.json(
        { success: false, error: `Un brief a déjà été soumis pour ${companyName}`, code: 'DUPLICATE_SUBMISSION', retryable: false },
        { status: 409 }
      );
    }

    // Valeurs par défaut pour les métadonnées
    const normalizedMetadata: BriefMetadata = {
      ...metadata,
      company: companyName,
      timestamp: metadata.timestamp || new Date().toISOString(),
    };

    await sendBriefEmail(brief, normalizedMetadata);

    // Marquer la société comme soumise après envoi réussi
    markCompanySubmitted(companyName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur envoi email brief:', error);
    return NextResponse.json(
      { success: false, error: 'Email non envoye', code: 'RESEND_ERROR', retryable: true },
      { status: 500 }
    );
  }
}
