'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { ApiError } from '@/types';

type Props = {
  company: string;
  initialAuthenticated: boolean;
  sessionCompany: string;
};

export default function LivrableAuth({ company: initialCompany, initialAuthenticated, sessionCompany }: Props) {
  const router = useRouter();
  const [company, setCompany] = useState(initialCompany);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, email }),
      });

      if (res.ok) {
        router.refresh();
        return; // le server component re-rendra avec initialAuthenticated=true
      } else {
        const data: ApiError = await res.json();
        setError(data.error);
      }
    } catch {
      setError('Erreur de connexion. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  }

  if (initialAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col" style={{ background: 'var(--cream-50, #FFFDF9)', color: 'var(--charcoal-900, #1a1a1a)' }}>
        <header className="px-6 py-4 border-b" style={{ borderColor: 'var(--charcoal-200, #e5e5e5)' }}>
          <h1 className="text-lg font-semibold">{sessionCompany || company}</h1>
          <p className="text-sm" style={{ color: 'var(--charcoal-500, #737373)' }}>Livrable — Défi 5 Jours</p>
        </header>
        <section className="flex-1 px-6 py-8 max-w-[48rem] mx-auto w-full">
          <div style={{ color: 'var(--charcoal-700, #404040)' }}>
            <h2 className="text-xl font-semibold mb-4">Votre livrable</h2>
            <p>Le contenu de votre livrable sera affiché ici en lecture seule.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--cream-50, #FFFDF9)' }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] p-8 rounded-xl shadow-lg"
        style={{ background: 'var(--cream-100, #FFF9F0)' }}
      >
        <h1
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: 'var(--charcoal-900, #1a1a1a)' }}
        >
          Accédez à votre livrable
        </h1>
        <p
          className="text-sm mb-6 text-center"
          style={{ color: 'var(--charcoal-500, #737373)' }}
        >
          Entrez les informations utilisées lors de votre Défi 5 Jours.
        </p>

        <label className="block mb-1 text-sm font-medium" style={{ color: 'var(--charcoal-700, #404040)' }}>
          Nom de la société
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={!!initialCompany}
          required
          className="w-full px-4 py-3 rounded-lg border mb-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            borderColor: 'var(--charcoal-200, #e5e5e5)',
            background: initialCompany ? 'var(--cream-50, #FFFDF9)' : 'white',
            color: 'var(--charcoal-900, #1a1a1a)',
          }}
        />

        <label className="block mb-1 text-sm font-medium" style={{ color: 'var(--charcoal-700, #404040)' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          className="w-full px-4 py-3 rounded-lg border mb-4 text-base"
          style={{
            borderColor: 'var(--charcoal-200, #e5e5e5)',
            color: 'var(--charcoal-900, #1a1a1a)',
          }}
        />

        {error && (
          <p className="text-sm mb-4" style={{ color: 'var(--red-500, #ef4444)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white font-semibold text-base transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'var(--accent, #F96743)', minHeight: '44px' }}
        >
          {isLoading ? 'Vérification...' : 'Accéder au livrable'}
        </button>
      </form>
    </main>
  );
}
