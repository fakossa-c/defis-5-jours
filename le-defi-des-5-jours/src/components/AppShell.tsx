'use client';

import { useState, useRef, useEffect, Component } from 'react';
import type { ReactNode } from 'react';
import type { AppState, ProspectParams, BriefData } from '@/types';
import Header from './Header';
import Landing from './Landing';
import Chat from './Chat';
import BriefSummary from './BriefSummary';

// M4 — Error boundary minimal pour isoler les crashs de Chat
class ChatErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 items-center justify-center px-[var(--space-md)]">
          <p style={{ color: 'var(--charcoal-500)', font: 'var(--font-body)' }}>
            Une erreur est survenue. Rechargez la page pour réessayer.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

type AppShellProps = {
  params: ProspectParams;
};

export default function AppShell({ params }: AppShellProps) {
  const [appState, setAppState] = useState<AppState>('landing');
  const [visible, setVisible] = useState(true);
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  // M1 — stocker le timeout pour cleanup au démontage
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleStart() {
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setAppState('chat');
      setVisible(true);
    }, 400);
  }

  function handleBriefComplete(brief: BriefData) {
    setBriefData(brief);
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setAppState('recap');
      setVisible(true);
    }, 400);
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 400ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {appState !== 'recap' && <Header appState={appState} company={params.company} />}
      {appState === 'landing' && (
        <div className="flex flex-1 justify-center">
          <Landing params={params} onStart={handleStart} />
        </div>
      )}
      {appState === 'chat' && (
        // M4 — isolation des crashs Chat
        <ChatErrorBoundary>
          <Chat params={params} onBriefComplete={handleBriefComplete} />
        </ChatErrorBoundary>
      )}
      {/* M3 — état recap (Story 3.1) */}
      {appState === 'recap' && (
        <div className="flex flex-1 justify-center overflow-y-auto">
          {briefData ? (
            <BriefSummary
              briefData={briefData}
              company={params.company ?? undefined}
              contact={params.contact ?? undefined}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p style={{ color: 'var(--charcoal-500)', font: 'var(--font-body)' }}>
                Récapitulatif en cours de préparation…
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
