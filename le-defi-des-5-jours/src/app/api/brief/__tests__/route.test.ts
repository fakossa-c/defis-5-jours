import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockSendBriefEmail = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const mockCheckDuplicate = vi.hoisted(() => vi.fn().mockReturnValue(false));
const mockMarkSubmitted = vi.hoisted(() => vi.fn());

vi.mock('@/lib/send-brief', () => ({
  sendBriefEmail: mockSendBriefEmail,
}));

vi.mock('@/lib/brief-store', () => ({
  checkDuplicateSubmission: mockCheckDuplicate,
  markCompanySubmitted: mockMarkSubmitted,
}));

import { POST } from '../route';

const validBrief = {
  company: 'Acme Corp',
  contact: 'Jean Dupont',
  sector: 'fintech',
  problem: 'Problème de reporting',
  users: 'Équipes finance',
  current_solution: 'Excel',
  desired_outcome: 'Dashboard automatisé',
  five_day_scope: 'Dashboard basique',
  suggested_deliverable: 'App Next.js',
  notes: '',
};

const validMetadata = {
  company: 'Acme Corp',
  contact: 'Jean Dupont',
  sector: 'fintech',
  source: 'LinkedIn',
  timestamp: '2026-03-04T10:00:00.000Z',
};

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/brief', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/brief', () => {
  beforeEach(() => {
    mockSendBriefEmail.mockClear();
    mockCheckDuplicate.mockClear();
    mockMarkSubmitted.mockClear();
    mockCheckDuplicate.mockReturnValue(false);
  });

  it('retourne { success: true } avec un payload valide', async () => {
    const req = makeRequest({ brief: validBrief, metadata: validMetadata });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ success: true });
  });

  it('appelle sendBriefEmail avec le brief et les métadonnées', async () => {
    const req = makeRequest({ brief: validBrief, metadata: validMetadata });
    await POST(req);

    expect(mockSendBriefEmail).toHaveBeenCalledOnce();
    expect(mockSendBriefEmail).toHaveBeenCalledWith(
      expect.objectContaining({ problem: validBrief.problem }),
      expect.objectContaining({ company: validMetadata.company })
    );
  });

  it('retourne 400 si le brief est manquant', async () => {
    const req = makeRequest({ metadata: validMetadata });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('VALIDATION_ERROR');
    expect(data.retryable).toBe(false);
  });

  it('retourne 400 si les métadonnées sont manquantes', async () => {
    const req = makeRequest({ brief: validBrief });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('VALIDATION_ERROR');
  });

  it('retourne 400 si les champs obligatoires du brief sont absents (problem)', async () => {
    const incompleteBrief = { ...validBrief, problem: '' };
    const req = makeRequest({ brief: incompleteBrief, metadata: validMetadata });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.code).toBe('VALIDATION_ERROR');
  });

  it('retourne 400 si le champ users est absent', async () => {
    const incompleteBrief = { ...validBrief, users: '' };
    const req = makeRequest({ brief: incompleteBrief, metadata: validMetadata });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.code).toBe('VALIDATION_ERROR');
  });

  it('retourne 400 si desired_outcome est absent', async () => {
    const incompleteBrief = { ...validBrief, desired_outcome: '' };
    const req = makeRequest({ brief: incompleteBrief, metadata: validMetadata });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.code).toBe('VALIDATION_ERROR');
  });

  it('retourne RESEND_ERROR et 500 si sendBriefEmail échoue', async () => {
    mockSendBriefEmail.mockRejectedValueOnce(new Error('Resend failure'));
    const req = makeRequest({ brief: validBrief, metadata: validMetadata });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.code).toBe('RESEND_ERROR');
    expect(data.retryable).toBe(true);
    expect(data.error).toBe('Email non envoye');
  });

  it('utilise "Prospect inconnu" si company est absent dans les métadonnées', async () => {
    const metaWithoutCompany = { ...validMetadata, company: '' };
    const req = makeRequest({ brief: validBrief, metadata: metaWithoutCompany });
    await POST(req);

    const callArgs = mockSendBriefEmail.mock.calls[0][1];
    expect(callArgs.company).toBe('Prospect inconnu');
  });

  it('ne bloque pas les prospects anonymes même si un autre anonyme a déjà soumis (H3)', async () => {
    // Même si checkDuplicateSubmission retournerait true pour "Prospect inconnu",
    // le check est skippé quand metadata.company est vide
    mockCheckDuplicate.mockReturnValue(true);
    const metaWithoutCompany = { ...validMetadata, company: '' };
    const req = makeRequest({ brief: validBrief, metadata: metaWithoutCompany });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockCheckDuplicate).not.toHaveBeenCalled();
  });

  it('retourne 400 VALIDATION_ERROR si le corps est du JSON invalide', async () => {
    const req = new NextRequest('http://localhost/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-valid-json{{{',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe('VALIDATION_ERROR');
    expect(data.retryable).toBe(false);
  });

  it('génère un timestamp si absent des métadonnées', async () => {
    const metaWithoutTimestamp = { ...validMetadata, timestamp: '' };
    const req = makeRequest({ brief: validBrief, metadata: metaWithoutTimestamp });
    await POST(req);

    const callArgs = mockSendBriefEmail.mock.calls[0][1];
    expect(callArgs.timestamp).toBeTruthy();
    // Doit être un ISO 8601 valide
    expect(new Date(callArgs.timestamp).toISOString()).toBeTruthy();
  });

  it('retourne 409 DUPLICATE_SUBMISSION si la société a déjà soumis un brief', async () => {
    mockCheckDuplicate.mockReturnValue(true);
    const req = makeRequest({ brief: validBrief, metadata: validMetadata });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.code).toBe('DUPLICATE_SUBMISSION');
    expect(data.retryable).toBe(false);
    expect(data.error).toContain('Acme Corp');
    expect(mockSendBriefEmail).not.toHaveBeenCalled();
  });

  it('appelle markCompanySubmitted après un envoi réussi', async () => {
    const req = makeRequest({ brief: validBrief, metadata: validMetadata });
    await POST(req);

    expect(mockMarkSubmitted).toHaveBeenCalledOnce();
    expect(mockMarkSubmitted).toHaveBeenCalledWith('Acme Corp');
  });

  it('ne marque pas la société comme soumise si l\'envoi échoue', async () => {
    mockSendBriefEmail.mockRejectedValueOnce(new Error('Resend failure'));
    const req = makeRequest({ brief: validBrief, metadata: validMetadata });
    await POST(req);

    expect(mockMarkSubmitted).not.toHaveBeenCalled();
  });

  it('vérifie le doublon avec le nom de société des métadonnées', async () => {
    const req = makeRequest({ brief: validBrief, metadata: validMetadata });
    await POST(req);

    expect(mockCheckDuplicate).toHaveBeenCalledWith('Acme Corp');
  });
});
