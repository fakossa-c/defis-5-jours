'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, useMemo } from 'react';
import type { ProspectParams } from '@/types';
import ChatMessage from './ChatMessage';

type ChatProps = {
  params: ProspectParams;
};

export default function Chat({ params }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          context: {
            company: params.company ?? '',
            role: params.role ?? '',
            sector: params.sector ?? '',
          },
        },
      }),
    [params.company, params.role, params.sector],
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
  });

  const isLoading = status === 'submitted' || status === 'streaming';
  const hasSentInitial = useRef(false);

  useEffect(() => {
    if (!hasSentInitial.current && messages.length === 0) {
      hasSentInitial.current = true;
      sendMessage({ text: 'Bonjour, je suis prêt à commencer le Défi 5 Jours.' });
    }
  }, [messages.length, sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage({ text });
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-[var(--space-md)] py-[var(--space-md)]" role="log" aria-live="polite">
        <div className="mx-auto flex max-w-3xl flex-col gap-[var(--space-md)]">
          {messages.map((message, index) => {
            const textContent = message.parts
              .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('');
            return (
              <ChatMessage
                key={message.id}
                role={message.role as 'user' | 'assistant'}
                content={textContent}
                isStreaming={
                  status === 'streaming' &&
                  message.role === 'assistant' &&
                  index === messages.length - 1
                }
              />
            );
          })}

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-[var(--space-sm)] rounded-[var(--radius-sm)] bg-[var(--red-500)] px-[var(--space-md)] py-[var(--space-sm)] text-white">
              <span className="flex-1 text-sm">Oups, un souci technique. Réessayez.</span>
              <button
                onClick={() => regenerate()}
                className="shrink-0 rounded-[var(--radius-sm)] bg-white/20 px-[var(--space-sm)] py-1 text-sm font-medium hover:bg-white/30"
              >
                Réessayer
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - sticky bottom */}
      <div className="sticky bottom-0 border-t border-[var(--charcoal-200)] bg-[var(--cream-50)] px-[var(--space-md)] py-[var(--space-sm)]">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-[var(--space-sm)]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 rounded-[var(--radius-full)] border border-[var(--charcoal-200)] bg-white px-[var(--space-md)] py-[var(--space-sm)] text-[15px] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-opacity disabled:opacity-40"
            aria-label="Envoyer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
