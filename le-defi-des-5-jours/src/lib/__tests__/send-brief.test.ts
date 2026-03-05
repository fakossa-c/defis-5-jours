import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BriefData } from '@/types';

// vi.hoisted garantit que la variable est disponible dans le factory de vi.mock (hoisting)
const mockEmailSend = vi.hoisted(() => vi.fn().mockResolvedValue({ id: 'test-id' }));

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockEmailSend } };
  }),
}));

// Import après le mock
import { formatBriefEmail, sendBriefEmail } from '../send-brief';

const mockBrief: BriefData = {
  company: 'Acme Corp',
  contact: 'Jean Dupont',
  sector: 'fintech',
  problem: 'Nous avons un problème de reporting manuel',
  users: 'Les équipes finance, 50 personnes',
  current_solution: 'Excel et emails',
  desired_outcome: 'Tableau de bord automatisé',
  five_day_scope: 'Dashboard basique avec 3 KPIs',
  suggested_deliverable: 'Application web Next.js',
  notes: 'Budget limité',
};

const mockMetadata = {
  company: 'Acme Corp',
  contact: 'Jean Dupont',
  sector: 'fintech',
  source: 'LinkedIn',
  timestamp: '2026-03-04T10:00:00.000Z',
};

describe('formatBriefEmail', () => {
  it('contient le nom de l\'entreprise dans le header', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).toContain('Acme Corp');
  });

  it('contient les métadonnées (contact, secteur, source)', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).toContain('Jean Dupont');
    expect(html).toContain('fintech');
    expect(html).toContain('LinkedIn');
  });

  it('contient les sections obligatoires du brief', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).toContain('Nous avons un problème de reporting manuel');
    expect(html).toContain('Les équipes finance, 50 personnes');
    expect(html).toContain('Tableau de bord automatisé');
  });

  it('contient le footer "Repondre sous 24h"', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).toContain('Repondre sous 24h');
  });

  it('utilise uniquement des styles inline (pas de balise <style>)', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).not.toContain('<style');
  });

  it('échappe les caractères HTML dangereux (XSS)', () => {
    const maliciousBrief: BriefData = {
      ...mockBrief,
      problem: '<script>alert("xss")</script>',
    };
    const html = formatBriefEmail(maliciousBrief, mockMetadata);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('échappe les caractères HTML dans les métadonnées', () => {
    const maliciousMeta = {
      ...mockMetadata,
      company: '<b>Evil Corp</b>',
    };
    const html = formatBriefEmail(mockBrief, maliciousMeta);
    expect(html).not.toContain('<b>Evil Corp</b>');
    expect(html).toContain('&lt;b&gt;Evil Corp&lt;/b&gt;');
  });

  it('utilise les couleurs du design system', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).toContain('#2A2724');
    expect(html).toContain('#FFFDF9');
    expect(html).toContain('#10B981');
    expect(html).toContain('#FFF8EF');
  });

  it('n\'inclut pas d\'images externes', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).not.toMatch(/<img/i);
  });

  it('est du HTML valide avec DOCTYPE', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
  });

  it('omet les sections vides (label "Notes" absent si notes vides)', () => {
    const briefWithoutNotes: BriefData = {
      ...mockBrief,
      notes: '',
    };
    const html = formatBriefEmail(briefWithoutNotes, mockMetadata);
    // Vérifie que le label de section est absent, pas seulement la valeur mock
    expect(html).not.toContain('Notes');
  });

  it('inclut les sections optionnelles quand remplies', () => {
    const html = formatBriefEmail(mockBrief, mockMetadata);
    expect(html).toContain('Excel et emails');
    expect(html).toContain('Dashboard basique avec 3 KPIs');
    expect(html).toContain('Application web Next.js');
    expect(html).toContain('Budget limité');
  });
});

describe('sendBriefEmail', () => {
  beforeEach(() => {
    mockEmailSend.mockClear();
    process.env.NOTIFICATION_EMAIL = 'fakossa@test.com';
  });

  it('appelle resend.emails.send avec le bon destinataire', async () => {
    await sendBriefEmail(mockBrief, mockMetadata);
    expect(mockEmailSend).toHaveBeenCalledOnce();
    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'fakossa@test.com',
      })
    );
  });

  it('le sujet de l\'email contient le nom de l\'entreprise', async () => {
    await sendBriefEmail(mockBrief, mockMetadata);
    const callArgs = mockEmailSend.mock.calls[0][0];
    expect(callArgs.subject).toBe('Nouveau Defi 5 Jours -- Acme Corp');
  });

  it('l\'email contient le HTML généré', async () => {
    await sendBriefEmail(mockBrief, mockMetadata);
    const callArgs = mockEmailSend.mock.calls[0][0];
    expect(callArgs.html).toContain('Acme Corp');
    expect(callArgs.html).toContain('Repondre sous 24h');
  });

  it('lève une erreur si Resend échoue', async () => {
    mockEmailSend.mockRejectedValueOnce(new Error('Resend API error'));
    await expect(sendBriefEmail(mockBrief, mockMetadata)).rejects.toThrow('Resend API error');
  });

  it('lève une erreur claire si NOTIFICATION_EMAIL est absent', async () => {
    const saved = process.env.NOTIFICATION_EMAIL;
    delete process.env.NOTIFICATION_EMAIL;
    await expect(sendBriefEmail(mockBrief, mockMetadata)).rejects.toThrow('NOTIFICATION_EMAIL');
    process.env.NOTIFICATION_EMAIL = saved;
  });
});
