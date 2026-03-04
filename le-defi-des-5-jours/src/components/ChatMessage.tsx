'use client';

import Image from 'next/image';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
};

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div
      className={`flex gap-[var(--space-sm)] animate-slide-up ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {isAssistant && (
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/avatar-fakossa.webp"
            alt="IA"
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
          />
        </div>
      )}
      <div
        className={`max-w-[90%] rounded-[var(--radius-md)] px-[var(--space-md)] py-[var(--space-sm)] sm:max-w-[85%] ${
          isAssistant
            ? 'border-l-2 border-[var(--accent)] bg-[var(--cream-100)]'
            : 'bg-[var(--accent-light)] text-[var(--charcoal-900)]'
        }`}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {content}
          {isStreaming && <span className="animate-blink ml-0.5">{content ? '|' : '...'}</span>}
        </p>
      </div>
    </div>
  );
}
