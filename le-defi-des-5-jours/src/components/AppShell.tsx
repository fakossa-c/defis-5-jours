'use client';

import { useState, useRef, useEffect, Component } from 'react';
import type { ReactNode } from 'react';
import type { AppState, ProspectParams, BriefData } from '@/types';
import Header from './Header';
import Chat from './Chat';
import BriefSummary from './BriefSummary';

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
            Une erreur est survenue. Rechargez la page pour r&eacute;essayer.
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
  const [appState, setAppState] = useState<AppState>('chat');
  const [visible, setVisible] = useState(false);
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Entrance animation
    requestAnimationFrame(() => setVisible(true));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleBriefComplete(brief: BriefData) {
    setBriefData(brief);
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setAppState('recap');
      setVisible(true);
    }, 500);
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms cubic-bezier(.22,1,.36,1)',
      }}
    >
      {/* Background blobs */}
      <div
        className="blob"
        style={{
          width: 400,
          height: 400,
          top: '-10%',
          right: '-5%',
          background: `radial-gradient(circle, var(--accent-light, rgba(249,103,67,0.2)), transparent 70%)`,
        }}
      />
      <div
        className="blob"
        style={{
          width: 300,
          height: 300,
          bottom: '10%',
          left: '-8%',
          background: `radial-gradient(circle, var(--accent-light, rgba(249,103,67,0.15)), transparent 70%)`,
          animationDelay: '-7s',
        }}
      />
      <div
        className="blob"
        style={{
          width: 200,
          height: 200,
          top: '40%',
          right: '20%',
          background: `radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)`,
          animationDelay: '-3s',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        {appState !== 'recap' && <Header company={params.company} />}

        {appState === 'chat' && (
          <ChatErrorBoundary>
            <Chat params={params} onBriefComplete={handleBriefComplete} />
          </ChatErrorBoundary>
        )}

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
                  R&eacute;capitulatif en cours de pr&eacute;paration...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
