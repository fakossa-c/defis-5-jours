import { NextRequest, NextResponse } from 'next/server';
import { getSessionIdFromCookie, getSession } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const sessionId = getSessionIdFromCookie(request);

  if (sessionId) {
    const session = getSession(sessionId);
    if (session) {
      return NextResponse.next();
    }
  }

  // Pas de session valide sur /livrable → la page gère l'affichage du formulaire
  // Pour les sous-routes éventuelles, rediriger vers /livrable avec les params préservés
  if (request.nextUrl.pathname !== '/livrable') {
    const url = request.nextUrl.clone();
    url.pathname = '/livrable';
    url.searchParams.set('auth', 'required');

    const company = request.nextUrl.searchParams.get('company');
    if (company) {
      url.searchParams.set('company', company);
    }

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/livrable', '/livrable/:path*'],
};
