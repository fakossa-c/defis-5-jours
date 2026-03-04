import { NextRequest, NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/auth';
import { verifyBriefCredentials } from '@/lib/brief-store';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.company !== 'string' || typeof body.email !== 'string') {
    return NextResponse.json(
      { error: 'Champs requis manquants', code: 'AUTH_INVALID', retryable: false },
      { status: 400 }
    );
  }

  const company = body.company.trim();
  const email = body.email.trim();

  if (!company || !email) {
    return NextResponse.json(
      { error: 'Champs requis manquants', code: 'AUTH_INVALID', retryable: false },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Format email invalide', code: 'AUTH_INVALID', retryable: false },
      { status: 400 }
    );
  }

  const isValid = verifyBriefCredentials(company, email);

  if (!isValid) {
    return NextResponse.json(
      { error: 'Identifiants incorrects', code: 'AUTH_INVALID', retryable: false },
      { status: 401 }
    );
  }

  const sessionId = createSession(company, email);
  const response = NextResponse.json({ success: true });
  setSessionCookie(response, sessionId);

  return response;
}
