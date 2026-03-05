'use client';

import Image from 'next/image';
import { useState } from 'react';

type HeaderProps = {
  company?: string | null;
};

export default function Header({ company }: HeaderProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <header
      className="glass sticky top-0 z-20 animate-fade-in"
      style={{
        borderBottom: '1px solid rgba(212, 207, 200, 0.4)',
      }}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
        {/* Avatar with ring */}
        <div className="avatar-ring" style={{ width: 36, height: 36, flexShrink: 0 }}>
          {imgError ? (
            <div
              aria-label="Avatar Fakossa"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              F
            </div>
          ) : (
            <Image
              src="/avatar-fakossa.webp"
              alt="Avatar Fakossa"
              width={32}
              height={32}
              className="rounded-full object-cover"
              style={{ width: 32, height: 32 }}
              priority
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold" style={{ color: 'var(--charcoal-900)' }}>
            Le D&eacute;fi 5 Jours
          </span>
          {company && (
            <span className="text-xs" style={{ color: 'var(--accent)' }}>
              {company}
            </span>
          )}
        </div>

        {/* Status indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: 'var(--emerald-500)',
              display: 'inline-block',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)',
            }}
          />
          <span className="text-xs font-medium" style={{ color: 'var(--charcoal-400)' }}>
            En ligne
          </span>
        </div>
      </div>
    </header>
  );
}
