import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('rate-limit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function importModule() {
    const mod = await import('../rate-limit');
    return mod;
  }

  it('autorise 10 requêtes pour une même IP', async () => {
    const { checkRateLimit, MAX_CONVERSATIONS_PER_HOUR } = await importModule();
    expect(MAX_CONVERSATIONS_PER_HOUR).toBe(10);

    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit('192.168.1.1');
      expect(result.allowed).toBe(true);
    }
  });

  it('bloque la 11ème requête', async () => {
    const { checkRateLimit } = await importModule();

    for (let i = 0; i < 10; i++) {
      checkRateLimit('192.168.1.1');
    }

    const result = checkRateLimit('192.168.1.1');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('nettoie les timestamps expirés (> 1h)', async () => {
    const { checkRateLimit } = await importModule();

    // Faire 10 requêtes
    for (let i = 0; i < 10; i++) {
      checkRateLimit('192.168.1.1');
    }

    // Vérifier qu'on est bloqué
    expect(checkRateLimit('192.168.1.1').allowed).toBe(false);

    // Avancer le temps de plus d'1 heure
    vi.advanceTimersByTime(3_600_001);

    // Les timestamps expirés doivent être nettoyés
    const result = checkRateLimit('192.168.1.1');
    expect(result.allowed).toBe(true);
  });

  it('remaining décrémente correctement', async () => {
    const { checkRateLimit } = await importModule();

    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit('192.168.1.1');
      expect(result.remaining).toBe(10 - (i + 1));
    }
  });

  it('resetAt pointe vers le plus ancien timestamp + fenêtre', async () => {
    const { checkRateLimit } = await importModule();

    vi.setSystemTime(new Date('2026-03-05T10:00:00.000Z'));
    const firstResult = checkRateLimit('192.168.1.1');
    const firstTimestamp = Date.now();

    vi.advanceTimersByTime(1000);
    checkRateLimit('192.168.1.1');

    // resetAt doit pointer vers le premier timestamp + 1h
    expect(firstResult.resetAt).toBe(firstTimestamp + 3_600_000);
  });

  it('getRateLimitHeaders retourne les bons headers', async () => {
    const { getRateLimitHeaders, MAX_CONVERSATIONS_PER_HOUR } = await importModule();

    const headers = getRateLimitHeaders({ remaining: 7, resetAt: 1709568000000 });

    expect(headers['X-RateLimit-Limit']).toBe(String(MAX_CONVERSATIONS_PER_HOUR));
    expect(headers['X-RateLimit-Remaining']).toBe('7');
    expect(headers['X-RateLimit-Reset']).toBe(String(Math.ceil(1709568000000 / 1000)));
  });

  it('isole les compteurs par IP', async () => {
    const { checkRateLimit } = await importModule();

    for (let i = 0; i < 10; i++) {
      checkRateLimit('192.168.1.1');
    }

    // IP différente doit être autorisée
    const result = checkRateLimit('192.168.1.2');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });
});
