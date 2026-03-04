# Story 1.1: Initialisation du projet Next.js

Status: review

## Story

As a développeur,
I want initialiser le projet avec le starter template Next.js et les dépendances requises,
So that la base technique est prête pour le développement de toutes les features.

## Acceptance Criteria

### AC-1.1.1 : Création du projet Next.js avec le starter template

- **Given** aucun projet n'existe
- **When** la commande `pnpm create next-app le-defi-des-5-jours --typescript --tailwind --eslint --app --src-dir --import-alias="@/*" --turbopack --use-pnpm` est exécutée
- **Then** la structure `src/app/` est créée, TypeScript est en mode strict, Tailwind CSS 4.x est configuré, ESLint est actif
- **And** la page par défaut est accessible sur `localhost:3000`

### AC-1.1.2 : Installation des dépendances additionnelles

- **Given** le projet est initialisé
- **When** la commande `pnpm add ai @ai-sdk/google resend` est exécutée
- **Then** les packages `ai`, `@ai-sdk/google` et `resend` apparaissent dans `package.json` sous `dependencies`
- **And** la compilation se termine sans erreur

### AC-1.1.3 : Fichier .env.example créé avec les clés requises

- **Given** le projet est initialisé
- **When** le fichier `.env.example` est créé à la racine
- **Then** il contient `GOOGLE_GENERATIVE_AI_API_KEY=`, `RESEND_API_KEY=`, `NOTIFICATION_EMAIL=` sans valeurs renseignées
- **And** `.env.local` est présent dans `.gitignore`

### AC-1.1.4 : Fichier de types centralisé créé et importable

- **Given** le projet est initialisé
- **When** le fichier `src/types/index.ts` est créé
- **Then** les types `ProspectParams`, `BriefData`, `AppState` et `ApiError` sont exportés et importables via `@/types`

## Tasks / Subtasks

### Tâche 1 : Initialiser le projet Next.js via CLI (AC-1.1.1)
- [x] Exécuter la commande `pnpm create next-app le-defi-des-5-jours --typescript --tailwind --eslint --app --src-dir --import-alias="@/*" --turbopack --use-pnpm`
- [x] Vérifier que `tsconfig.json` contient `"strict": true`
- [x] Vérifier la structure générée : `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

### Tâche 2 : Installer les dépendances additionnelles (AC-1.1.2)
- [x] Exécuter `pnpm add ai @ai-sdk/google resend`
- [x] Vérifier dans `package.json` la présence des trois packages dans `dependencies`
- [x] Exécuter `pnpm tsc --noEmit` pour confirmer zéro erreur TypeScript

### Tâche 3 : Créer le fichier .env.example (AC-1.1.3)
- [x] Créer `.env.example` à la racine avec les clés requises
- [x] Vérifier que `.gitignore` contient `.env*` (couvre `.env.local`)

### Tâche 4 : Créer le fichier de types centralisé (AC-1.1.4)
- [x] Créer le répertoire `src/types/`
- [x] Créer `src/types/index.ts` avec `ProspectParams`, `BriefData`, `AppState`, `ApiError`
- [x] Vérifier l'import via `@/types` avec `pnpm tsc --noEmit`

### Tâche 5 : Préparer la structure de dossiers (préparation stories suivantes)
- [x] Créer les répertoires : `src/components/`, `src/lib/`
- [x] Ajouter un fichier `.gitkeep` dans chaque dossier vide

### Tâche 6 : Validation finale (toutes AC)
- [x] `pnpm build` — le build se termine sans erreur
- [x] `pnpm lint` — aucune erreur ESLint
- [x] `pnpm tsc --noEmit` — zéro erreur TypeScript
- [x] `.env.example` présent à la racine
- [x] Types importables via `@/types`

## Dev Notes

### Stack technique et versions
- **Next.js 16** avec App Router et Turbopack
- **TypeScript** en mode strict (`"strict": true`)
- **Tailwind CSS 4.2** — configuration via `@theme` dans `globals.css` (pas de `tailwind.config.ts`)
- **pnpm** comme gestionnaire de paquets exclusif
- **Vercel AI SDK 6** (`ai` + `@ai-sdk/google` 3.x)
- **Resend 6.9** pour l'envoi d'emails

### Modèle IA
- Utiliser **Gemini 2.5 Flash** (PAS Gemini 2.0 Flash qui est déprécié en juin 2026)

### Types détaillés

```typescript
export type ProspectParams = {
  company?: string;
  role?: string;
  sector?: string;
  color?: string;
  contact?: string;
  source?: string;
};

export type BriefData = {
  company: string;
  contact: string;
  sector: string;
  problem: string;
  users: string;
  current_solution: string;
  desired_outcome: string;
  five_day_scope: string;
  suggested_deliverable: string;
  notes: string;
};

export type AppState = 'landing' | 'chat' | 'recap';

export type ApiError = {
  error: string;
  code: string;
  retryable: boolean;
};
```

### Anti-patterns à éviter
- Pas de `dangerouslySetInnerHTML`
- Pas de shadcn/ui, Radix UI, Material UI
- Pas de `useEffect` pour le data fetching
- Pas de fichiers de configuration supplémentaires inutiles

### Pas de base de données dans le MVP
- L'email via Resend est la seule forme de persistance

### Conventions de nommage
- Composants : `PascalCase.tsx` (ex : `Landing.tsx`)
- Lib/utilitaires : `kebab-case.ts` (ex : `params.ts`)
- Variables : `camelCase`
- Types : `PascalCase`
- CSS custom properties : `--kebab-case`
- JSON brief : `snake_case`

### Project Structure Notes

```
le-defi-des-5-jours/
├── .env.example                  # Variables d'environnement (template)
├── .gitignore                    # Doit inclure .env.local
├── package.json                  # deps: ai, @ai-sdk/google, resend
├── tsconfig.json                 # strict: true, alias @/* -> src/*
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind 4.x config via @theme
│   │   ├── layout.tsx            # Layout racine
│   │   └── page.tsx              # Page d'accueil
│   ├── components/               # Composants React (PascalCase.tsx)
│   ├── lib/                      # Utilitaires (kebab-case.ts)
│   └── types/
│       └── index.ts              # ProspectParams, BriefData, AppState, ApiError
└── public/                       # Assets statiques
```

### References

- Architecture projet : Epic 1, Fondation du Projet & Landing Personnalisée
- Documentation Next.js App Router : https://nextjs.org/docs/app
- Documentation Vercel AI SDK 6 : https://sdk.vercel.ai/docs
- Documentation Tailwind CSS 4 : https://tailwindcss.com/docs
- Documentation Resend : https://resend.com/docs

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- Projet Next.js 16.1.6 initialisé avec `create-next-app` (TypeScript strict, Tailwind CSS 4.2.1, ESLint, App Router, src dir)
- React Compiler désactivé (non requis par l'architecture, gain négligeable pour 6 composants)
- Dépendances installées : ai@6.0.111, @ai-sdk/google@3.0.37, resend@6.9.3
- .env.example créé avec GOOGLE_GENERATIVE_AI_API_KEY, RESEND_API_KEY, NOTIFICATION_EMAIL
- Types centralisés créés : ProspectParams, BriefData, AppState, ApiError dans src/types/index.ts
- Structure préparée : src/components/, src/lib/ avec .gitkeep
- .gitignore racine ajouté pour résoudre le warning Git (node_modules ignoré globalement)
- Validation finale : build OK, lint OK, tsc OK

### File List

- le-defi-des-5-jours/ (projet complet généré par create-next-app)
- le-defi-des-5-jours/.env.example
- le-defi-des-5-jours/src/types/index.ts
- le-defi-des-5-jours/src/components/.gitkeep
- le-defi-des-5-jours/src/lib/.gitkeep
- .gitignore (racine du repo)
