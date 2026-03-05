import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

const VALID_TYPES = [
  'site-web',
  'mvp',
  'automatisation',
  'dashboard',
  'app-mobile',
] as const;

type ProjectType = (typeof VALID_TYPES)[number];

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimitResult = checkRateLimit(ip);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({ error: 'Trop de requetes', code: 'RATE_LIMIT' }),
      { status: 429, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }

  let projectType: string;
  let context: { company?: string; sector?: string; contact?: string } = {};

  try {
    const body = await req.json();
    projectType = body.projectType;
    context = body.context ?? {};
  } catch {
    return new Response(
      JSON.stringify({ error: 'Corps invalide', code: 'INVALID_REQUEST' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }

  if (!VALID_TYPES.includes(projectType as ProjectType)) {
    return new Response(
      JSON.stringify({ error: 'Type de projet invalide', code: 'INVALID_TYPE' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }

  const typeLabels: Record<ProjectType, string> = {
    'site-web': 'un site web (vitrine ou e-commerce)',
    'mvp': 'un MVP / prototype fonctionnel',
    'automatisation': "une automatisation de processus metier",
    'dashboard': 'un tableau de bord / dashboard analytics',
    'app-mobile': 'une application mobile iOS/Android',
  };

  const contextParts: string[] = [];
  if (context.company) contextParts.push(`pour l'entreprise ${context.company}`);
  if (context.sector) contextParts.push(`dans le secteur ${context.sector}`);

  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: `Tu generes une courte description de projet a la premiere personne.
Reponds UNIQUEMENT avec la description, sans guillemets ni prefixe.
La description doit commencer par "Je voudrais" ou "J'aimerais" et faire 2-3 phrases maximum.
Sois concret et specifique.`,
      prompt: `Genere une idee de projet pour ${typeLabels[projectType as ProjectType]}${contextParts.length > 0 ? ' ' + contextParts.join(' ') : ''}.`,
    });

    return new Response(
      JSON.stringify({ idea: text.trim() }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Erreur IA', code: 'AI_ERROR' }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }
}
