'use client';

const PROJECT_TYPES = [
  {
    type: 'site-web',
    label: 'Site web',
    description: 'Site vitrine ou e-commerce',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    type: 'mvp',
    label: 'MVP',
    description: 'Prototype fonctionnel rapide',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
  {
    type: 'automatisation',
    label: 'Automatisation',
    description: 'Automatiser un processus metier',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    type: 'dashboard',
    label: 'Dashboard',
    description: 'Tableau de bord & analytics',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    type: 'app-mobile',
    label: 'App mobile',
    description: 'Application iOS/Android',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]['type'];

type ProjectCardsProps = {
  onCardClick: (type: ProjectType) => void;
  disabled?: boolean;
  loadingType?: ProjectType | null;
};

export default function ProjectCards({ onCardClick, disabled, loadingType }: ProjectCardsProps) {
  return (
    <div className="project-cards-grid">
      {PROJECT_TYPES.map((project, index) => {
        const isLoading = loadingType === project.type;
        return (
          <button
            key={project.type}
            onClick={() => onCardClick(project.type)}
            disabled={disabled || !!loadingType}
            className="project-card glass"
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >
            <div
              className="project-card-icon"
              style={{ color: 'var(--accent)' }}
            >
              {isLoading ? (
                <span className="typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                project.icon
              )}
            </div>
            <span className="project-card-label">{project.label}</span>
            <span className="project-card-desc">{project.description}</span>
          </button>
        );
      })}
    </div>
  );
}
