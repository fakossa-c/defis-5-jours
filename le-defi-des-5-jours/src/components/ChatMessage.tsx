'use client';

import Image from 'next/image';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  index?: number;
};

export default function ChatMessage({ role, content, isStreaming, index = 0 }: ChatMessageProps) {
  const isAssistant = role === 'assistant';
  const delay = Math.min(index * 50, 300);

  return (
    <div
      className={`msg-enter flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isAssistant && (
        <div className="avatar-ring shrink-0" style={{ width: 32, height: 32, marginTop: 2 }}>
          <Image
            src="/avatar-fakossa.webp"
            alt="IA"
            width={28}
            height={28}
            className="rounded-full object-cover"
            style={{ width: 28, height: 28 }}
          />
        </div>
      )}

      <div
        className={`message-bubble max-w-[85%] sm:max-w-[80%] ${
          isAssistant ? 'glass' : ''
        }`}
        style={{
          borderRadius: isAssistant ? '2px 18px 18px 18px' : '18px 18px 2px 18px',
          padding: '12px 18px',
          ...(isAssistant
            ? {
                background: 'rgba(255, 248, 239, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(212, 207, 200, 0.3)',
                borderLeft: '3px solid var(--accent)',
              }
            : {
                background: 'var(--accent)',
                color: 'white',
                boxShadow: '0 2px 12px var(--accent-light, rgba(249, 103, 67, 0.25))',
              }),
        }}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {content}
          {isStreaming && !content && (
            <span className="typing-dots">
              <span />
              <span />
              <span />
            </span>
          )}
          {isStreaming && content && (
            <span
              className="animate-blink ml-0.5 inline-block"
              style={{
                width: 2,
                height: '1em',
                backgroundColor: isAssistant ? 'var(--accent)' : 'white',
                verticalAlign: 'text-bottom',
              }}
            />
          )}
        </p>
      </div>
    </div>
  );
}
