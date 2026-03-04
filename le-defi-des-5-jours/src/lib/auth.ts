import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'defi-session';
const SESSION_TTL = 86400000; // 24h en ms

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/livrable',
  maxAge: 86400, // 24h en secondes
};

type SessionData = {
  company: string;
  email: string;
  createdAt: number;
};

const sessionStore = new Map<string, SessionData>();
// ⚠️ LIMITATION PRODUCTION : En serverless (Vercel), chaque invocation de fonction
// (middleware, page.tsx, /api/auth) peut avoir une instance différente de ce Map.
// Ce n'est pas qu'un problème de cold start — c'est une isolation inter-fonctions.
// En dev local (process Node.js unique), tout fonctionne car le Map est partagé.
// Pour la production à volume, migrer vers Vercel KV ou Redis (V2).

export function createSession(company: string, email: string): string {
  // Nettoyage proactif si le store dépasse 100 entrées
  if (sessionStore.size > 100) {
    const now = Date.now();
    for (const [id, data] of sessionStore.entries()) {
      if (now - data.createdAt > SESSION_TTL) {
        sessionStore.delete(id);
      }
    }
  }
  const sessionId = crypto.randomUUID();
  sessionStore.set(sessionId, {
    company,
    email,
    createdAt: Date.now(),
  });
  return sessionId;
}

export function getSession(sessionId: string): { company: string; email: string } | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;

  // Vérifier expiration
  if (Date.now() - session.createdAt > SESSION_TTL) {
    sessionStore.delete(sessionId);
    return null;
  }

  return { company: session.company, email: session.email };
}

export function deleteSession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

export function setSessionCookie(response: NextResponse, sessionId: string): void {
  response.cookies.set(COOKIE_NAME, sessionId, COOKIE_OPTIONS);
}

export function getSessionIdFromCookie(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}
