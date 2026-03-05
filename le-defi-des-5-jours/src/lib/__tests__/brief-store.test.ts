import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('brief-store', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function importModule() {
    const mod = await import('../brief-store');
    return mod;
  }

  it('checkDuplicateSubmission retourne false pour une nouvelle société', async () => {
    const { checkDuplicateSubmission } = await importModule();
    expect(checkDuplicateSubmission('Otoqi')).toBe(false);
  });

  it('markCompanySubmitted + checkDuplicateSubmission retourne true', async () => {
    const { checkDuplicateSubmission, markCompanySubmitted } = await importModule();

    markCompanySubmitted('Otoqi');
    expect(checkDuplicateSubmission('Otoqi')).toBe(true);
  });

  it('normalisation fonctionne — espaces autour ("  Otoqi  " === "otoqi")', async () => {
    const { checkDuplicateSubmission, markCompanySubmitted } = await importModule();

    markCompanySubmitted('  Otoqi  ');
    expect(checkDuplicateSubmission('otoqi')).toBe(true);
  });

  it('case-insensitive — "OTOQI" === "otoqi"', async () => {
    const { checkDuplicateSubmission, markCompanySubmitted } = await importModule();

    markCompanySubmitted('OTOQI');
    expect(checkDuplicateSubmission('otoqi')).toBe(true);
  });

  it('espaces multiples normalisés — "O  to  qi" === "o to qi"', async () => {
    const { checkDuplicateSubmission, markCompanySubmitted } = await importModule();

    markCompanySubmitted('O  to  qi');
    expect(checkDuplicateSubmission('o to qi')).toBe(true);
  });

  it('sociétés différentes ne sont pas considérées comme doublons', async () => {
    const { checkDuplicateSubmission, markCompanySubmitted } = await importModule();

    markCompanySubmitted('Otoqi');
    expect(checkDuplicateSubmission('Autre Société')).toBe(false);
  });

  it('storeBriefCredentials + verifyBriefCredentials : match email correct', async () => {
    const { storeBriefCredentials, verifyBriefCredentials } = await importModule();

    storeBriefCredentials('Otoqi', 'alice@otoqi.com');
    expect(verifyBriefCredentials('Otoqi', 'alice@otoqi.com')).toBe(true);
  });

  it('verifyBriefCredentials retourne false pour email incorrect', async () => {
    const { storeBriefCredentials, verifyBriefCredentials } = await importModule();

    storeBriefCredentials('Otoqi', 'alice@otoqi.com');
    expect(verifyBriefCredentials('Otoqi', 'bob@otoqi.com')).toBe(false);
  });

  it('verifyBriefCredentials normalise la société pour la lookup', async () => {
    const { storeBriefCredentials, verifyBriefCredentials } = await importModule();

    storeBriefCredentials('  OTOQI  ', 'alice@otoqi.com');
    expect(verifyBriefCredentials('otoqi', 'alice@otoqi.com')).toBe(true);
  });
});
