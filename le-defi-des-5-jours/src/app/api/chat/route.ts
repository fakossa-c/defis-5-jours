import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { generateSystemPrompt } from '@/lib/system-prompt';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimitResult = checkRateLimit(ip);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Beaucoup de demandes, revenez dans quelques minutes',
        code: 'RATE_LIMIT',
        retryable: false,
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...rateLimitHeaders },
      },
    );
  }

  let messages: unknown;
  let context: { company?: string; role?: string; sector?: string; contact?: string } | undefined;

  try {
    const body = await req.json();
    messages = body.messages;
    context = body.context;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Corps de requête invalide', code: 'INVALID_REQUEST', retryable: false }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }

  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: 'Messages requis', code: 'INVALID_REQUEST', retryable: false }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }

  if (messages.some((m: unknown) => typeof m !== 'object' || m === null || !('role' in m))) {
    return new Response(
      JSON.stringify({ error: 'Format de message invalide', code: 'INVALID_REQUEST', retryable: false }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }

  try {
    const userMessageCount = (messages as Array<{ role: string }>).filter(
      (m) => m.role === 'user',
    ).length;

    const systemPrompt = generateSystemPrompt(
      {
        company: context?.company ?? '',
        role: context?.role ?? '',
        sector: context?.sector ?? '',
        contact: context?.contact ?? '',
      },
      userMessageCount,
    );

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toUIMessageStreamResponse({
      headers: rateLimitHeaders,
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Erreur du service IA', code: 'GEMINI_ERROR', retryable: true }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders } },
    );
  }
}
