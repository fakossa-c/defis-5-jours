'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, useMemo } from 'react';
import type { ProspectParams, BriefData } from '@/types';
import { extractStep, extractBrief, cleanContent } from '@/lib/chat-utils';
import ChatMessage from './ChatMessage';
import ProgressBar from './ProgressBar';

type ChatProps = {
  params: ProspectParams;
  onBriefComplete: (brief: BriefData) => void;
  onStepChange?: (step: number) => void;
};

export default function Chat({ params, onBriefComplete, onStepChange }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const briefTransitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          context: {
            company: params.company ?? '',
            role: params.role ?? '',
            sector: params.sector ?? '',
            contact: params.contact ?? '',
          },
        },
        fetch: async (url, options) => {
          const response = await globalThis.fetch(url as string, options as RequestInit);
          if (response.status === 429) {
            const err = new Error('RATE_LIMIT') as Error & { status: number };
            err.status = 429;
            throw err;
          }
          return response;
        },
      }),
    [params.company, params.role, params.sector, params.contact],
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const hasSentInitial = useRef(false);

  const rateLimitMessage = useMemo(() => {
    if (!error) return null;
    const status = (error as Error & { status?: number }).status;
    if (status === 429 || error.message === 'RATE_LIMIT') {
      return 'Beaucoup de demandes, revenez dans quelques minutes';
    }
    return null;
  }, [error]);

  const isRateLimited = rateLimitMessage !== null;

  const currentStep = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        const raw = messages[i].parts
          .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
          .map((p) => p.text)
          .join('');
        const { step } = extractStep(raw);
        if (step !== null) return step;
      }
    }
    return 1;
  }, [messages]);

  useEffect(() => {
    if (!hasSentInitial.current && messages.length === 0) {
      hasSentInitial.current = true;
      sendMessage({ text: 'Bonjour, je suis pret a commencer le Defi 5 Jours.' });
    }
  }, [messages.length, sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (status === 'streaming' || status === 'submitted') return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;
    if (processedMessageIds.current.has(lastMessage.id)) return;

    processedMessageIds.current.add(lastMessage.id);

    const rawContent = lastMessage.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join('');

    const { step } = extractStep(rawContent);
    if (step !== null) onStepChange?.(step);

    const brief = extractBrief(rawContent);
    if (brief) {
      briefTransitionRef.current = setTimeout(() => {
        onBriefComplete(brief);
      }, 1000);
    }
  }, [status, messages, onBriefComplete, onStepChange]);

  useEffect(() => {
    return () => {
      if (briefTransitionRef.current) clearTimeout(briefTransitionRef.current);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage({ text });
  }

  // Filter out the initial user message (auto-sent)
  const visibleMessages = messages.filter(
    (m, i) => !(i === 0 && m.role === 'user'),
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Messages area */}
      <div
        className="chat-scroll flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        role="log"
        aria-live="polite"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {/* Welcome message if no visible messages yet and loading */}
          {visibleMessages.length === 0 && isLoading && (
            <div className="msg-enter flex items-center gap-3">
              <div className="avatar-ring shrink-0" style={{ width: 32, height: 32 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  F
                </div>
              </div>
              <div
                className="glass"
                style={{
                  borderRadius: '2px 18px 18px 18px',
                  padding: '12px 18px',
                  borderLeft: '3px solid var(--accent)',
                }}
              >
                <span className="typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          )}

          {visibleMessages.map((message, index) => {
            const rawContent = message.parts
              .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('');

            const displayContent =
              message.role === 'assistant' ? cleanContent(rawContent) : rawContent;

            return (
              <ChatMessage
                key={message.id}
                role={message.role as 'user' | 'assistant'}
                content={displayContent}
                isStreaming={
                  status === 'streaming' &&
                  message.role === 'assistant' &&
                  index === visibleMessages.length - 1
                }
                index={index}
              />
            );
          })}

          {/* Rate limit message */}
          {rateLimitMessage && (
            <div
              className="animate-scale-in glass mx-auto flex items-center gap-3 px-5 py-3"
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <span style={{ fontSize: 18 }}>&#128336;</span>
              <span className="text-sm" style={{ color: 'var(--charcoal-700)' }}>
                {rateLimitMessage}
              </span>
            </div>
          )}

          {/* Error banner */}
          {error && !isRateLimited && (
            <div
              className="animate-scale-in flex items-center gap-3 px-5 py-3 text-white"
              style={{
                background: 'var(--red-500)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)',
              }}
            >
              <span className="flex-1 text-sm">Oups, un souci technique. Reessayez.</span>
              <button
                onClick={() => regenerate()}
                className="shrink-0 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium backdrop-blur-sm hover:bg-white/30"
              >
                Reessayer
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="glass border-t"
        style={{
          borderColor: 'rgba(212, 207, 200, 0.4)',
          padding: '6px 16px',
        }}
      >
        <div className="mx-auto max-w-3xl">
          <ProgressBar currentStep={currentStep} />
        </div>
      </div>

      {/* Input area */}
      <div
        className="glass sticky bottom-0 border-t"
        style={{
          borderColor: 'rgba(212, 207, 200, 0.4)',
          padding: '12px 16px',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tapez votre message..."
              className="chat-input w-full bg-white px-5 py-3 text-[15px] outline-none"
              style={{
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--charcoal-200)',
                boxShadow: 'var(--shadow-sm)',
              }}
              disabled={isLoading || isRateLimited}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || isRateLimited || !input.trim()}
            className="send-btn flex shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40"
            style={{
              width: 46,
              height: 46,
              background: 'var(--accent)',
              boxShadow: '0 2px 10px var(--accent-light, rgba(249,103,67,0.25))',
            }}
            aria-label="Envoyer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>

      <span data-testid="current-step" className="sr-only" aria-hidden="true">
        {currentStep}
      </span>
    </div>
  );
}
