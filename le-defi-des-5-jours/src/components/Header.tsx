'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { AppState } from '@/types';

type HeaderProps = {
  appState: AppState;
  company?: string | null;
};

export default function Header({ appState, company }: HeaderProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <header className="flex items-center gap-[var(--space-sm)] px-[var(--space-md)] py-[var(--space-sm)]">
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
            font: 'var(--font-caption)',
            fontWeight: 700,
            flexShrink: 0,
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
          priority
          onError={() => setImgError(true)}
        />
      )}
      {appState === 'chat' && (
        <span className="truncate text-sm font-semibold text-[var(--charcoal-700)]">
          Le Défi 5 Jours{company ? ` × ${company}` : ''}
        </span>
      )}
    </header>
  );
}
