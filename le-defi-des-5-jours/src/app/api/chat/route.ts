import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { generateSystemPrompt } from '@/lib/system-prompt';

export const runtime = 'edge';

export async function POST(req: Request) {
  let messages: unknown;
  let context: { company?: string; role?: string; sector?: string } | undefined;

  try {
    const body = await req.json();
    messages = body.messages;
    context = body.context;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Corps de requête invalide', code: 'INVALID_REQUEST', retryable: false }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: 'Messages requis', code: 'INVALID_REQUEST', retryable: false }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (messages.some((m: unknown) => typeof m !== 'object' || m === null || !('role' in m))) {
    return new Response(
      JSON.stringify({ error: 'Format de message invalide', code: 'INVALID_REQUEST', retryable: false }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const systemPrompt = generateSystemPrompt({
      company: context?.company ?? '',
      role: context?.role ?? '',
      sector: context?.sector ?? '',
    });

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Erreur du service IA', code: 'GEMINI_ERROR', retryable: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
