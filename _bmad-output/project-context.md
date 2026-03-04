---
project_name: 'defis-5-jours'
user_name: 'Fakos'
date: '2026-03-04'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 42
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Package |
|---|---|---|
| Next.js | 16.1.x | `next` |
| React | 19.x | `react`, `react-dom` |
| Vercel AI SDK | 6.x | `ai` |
| Google AI Provider | 3.x | `@ai-sdk/google` |
| Tailwind CSS | 4.x | `tailwindcss` |
| Resend | 6.x | `resend` |
| TypeScript | 5.x | `typescript` |
| **IA Model** | **Gemini 2.5 Flash** | Model ID: `gemini-2.5-flash` |

**Package manager:** pnpm (NOT npm, NOT yarn)

**Runtime:** Vercel Edge Runtime pour les API routes

**CRITICAL:** Gemini 2.0 Flash est déprécié le 1er juin 2026. Utiliser UNIQUEMENT `gemini-2.5-flash`.

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

- **Strict mode obligatoire** — `strict: true` dans tsconfig.json, aucun `any` sauf cas exceptionnel justifié
- **Import alias** : utiliser `@/` pour tout import depuis `src/` (ex: `import { BriefData } from '@/types'`)
- **Pas de `require()`** — uniquement des imports ES modules
- **Types partagés dans `src/types/index.ts`** — ne pas redéfinir de types localement s'ils existent déjà
- **Les types suivants sont définis et DOIVENT être utilisés :**
  ```typescript
  type AppState = 'landing' | 'chat' | 'recap'

  type ProspectParams = {
    company: string | null
    role: string | null
    sector: string | null
    color: string       // fallback: '#F96743'
    contact: string | null
    source: string | null
  }

  type BriefData = {
    company: string
    contact: string
    sector: string
    problem: string
    users: string
    current_solution: string
    desired_outcome: string
    five_day_scope: string
    suggested_deliverable: string
    notes: string
  }

  type ApiError = {
    error: string
    code: string        // RATE_LIMIT | GEMINI_ERROR | RESEND_ERROR
    retryable: boolean
  }
  ```

### Framework-Specific Rules (Next.js 16 + AI SDK 6)

- **App Router uniquement** — pas de Pages Router, pas de `getServerSideProps`
- **`page.tsx` est un Server Component** — il parse les query params et passe les props aux composants client
- **Les composants dans `src/components/` sont des Client Components** — ajouter `'use client'` en haut
- **API routes dans `src/app/api/`** — utiliser Route Handlers (`export async function POST()`)
- **Streaming chat** : utiliser `streamText()` de `ai` + `google()` de `@ai-sdk/google`
  ```typescript
  import { streamText } from 'ai'
  import { google } from '@ai-sdk/google'

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
  })
  return result.toUIMessageStreamResponse()
  ```
- **Côté client** : utiliser `useChat()` du AI SDK — NE PAS implémenter de fetch SSE custom
- **Pas de `useEffect` pour fetch** — utiliser les Server Components ou les hooks du AI SDK
- **État de l'app géré par `useState`** — pas de Context, pas de Zustand, pas de Redux (app trop simple)
- **Les query params sont lus dans `page.tsx`** via `searchParams` (Server Component), jamais côté client avec `useSearchParams()`

### CSS & Theming Rules

- **Tout le theming passe par CSS custom properties** — jamais de couleurs en dur dans les composants
- **La variable `--accent`** est injectée dans `<html>` depuis le query param `color`
- **Fallback coral** : si pas de param `color` ou valeur invalide → `--accent: #F96743`
- **Contraste WCAG AA** : si `--accent` a un contraste < 4.5:1 sur `--cream-50` (#FFFDF9), assombrir automatiquement
- **Tokens statiques à utiliser** (ne pas inventer de nouvelles couleurs) :
  - Background : `var(--cream-50)`, `var(--cream-100)`
  - Texte : `var(--charcoal-900)`, `var(--charcoal-700)`, `var(--charcoal-500)`
  - Bordures : `var(--charcoal-200)`
  - Succès : `var(--emerald-500)`
  - Erreur : `var(--red-500)`
  - Accent : `var(--accent)`, `var(--accent-light)`, `var(--accent-dark)`

### Naming Conventions

- **Fichiers composants** : `PascalCase.tsx` → `Landing.tsx`, `ChatMessage.tsx`
- **Fichiers lib** : `kebab-case.ts` → `system-prompt.ts`, `send-brief.ts`
- **Variables/fonctions** : `camelCase` → `sendBrief()`, `prospectParams`
- **Types/Interfaces** : `PascalCase` → `BriefData`, `ProspectParams`
- **Constantes** : `SCREAMING_SNAKE_CASE` → `MAX_CONVERSATIONS_PER_HOUR`
- **JSON brief fields** : `snake_case` → `five_day_scope`, `desired_outcome`
- **CSS custom properties** : `--kebab-case` → `--accent`, `--cream-50`

### Testing Rules

- **Pas de tests automatisés en MVP** — tests manuels uniquement
- **Structure prévue pour V2** : fichiers `*.test.tsx` co-localisés avec les composants
- **Scénarios de test manuels obligatoires avant déploiement :**
  1. App sans params → fallback générique
  2. App avec `?company=TestCorp&color=%23FF0000` → personnalisation rouge
  3. Chat complet de bout en bout → brief généré
  4. Email reçu sur fakossa@gmail.com → < 30 sec
  5. Mobile responsive → chat utilisable au pouce
  6. XSS dans les params → sanitisé, pas d'injection

### Code Quality & Style Rules

- **ESLint** : configuration Next.js par défaut (fournie par create-next-app)
- **Pas de Prettier** — Tailwind CSS 4 gère le formatting des classes
- **Pas de commentaires évidents** — ne commenter que la logique non-triviale
- **Pas de docstrings sur les composants simples** — le nom du composant + ses props suffisent
- **Max 200 lignes par fichier** — découper si nécessaire
- **Pas de barrel exports** (`index.ts` qui re-exporte tout) sauf dans `src/types/`

### Development Workflow Rules

- **Déploiement** : Vercel auto-deploy sur push (branche main)
- **Variables d'environnement** :
  - `GOOGLE_GENERATIVE_AI_API_KEY` — clé API Google AI Studio
  - `RESEND_API_KEY` — clé API Resend
  - `NOTIFICATION_EMAIL` — fakossa@gmail.com
- **Ne JAMAIS exposer de clé API côté client** — toutes les API calls vers Gemini/Resend passent par les Route Handlers
- **`.env.local`** pour le dev, **Vercel dashboard** pour la prod
- **`.env.example`** committé avec les noms de variables sans valeurs

### Critical Don't-Miss Rules

**INTERDIT :**
- `dangerouslySetInnerHTML` — jamais, nulle part, aucune exception
- Ajouter une dépendance UI (shadcn, Radix, Material UI, Chakra) — Tailwind + custom uniquement
- Créer un fichier de config supplémentaire pour le theming — tout est dans CSS custom properties
- Utiliser `useEffect` pour fetch des données — Server Components ou `useChat()` uniquement
- Stocker des données sensibles côté client (localStorage, sessionStorage)
- Utiliser `gemini-2.0-flash` — DÉPRÉCIÉ, utiliser `gemini-2.5-flash`
- Appeler directement l'API Gemini depuis le client — toujours via `/api/chat`

**ATTENTION :**
- Le system prompt Gemini doit inclure `[STEP:N]` pour la détection de progression — le frontend parse ce tag et le supprime du texte affiché
- Le brief JSON généré par Gemini est inclus dans le dernier message IA — le frontend doit le parser et le supprimer du texte affiché
- L'input chat doit être `sticky` en bas sur mobile — `position: sticky` et gérer le clavier virtuel
- Les bulles de chat ont un `max-width: 85%` desktop, `90%` mobile
- Les touch targets minimum sont 44×44px
- Les transitions entre états sont 400ms ease-out (fade-in/fade-out)
- Le rate limiting est en mémoire (Map) — il se réinitialise au cold start Vercel (acceptable pour le MVP)

---

## Project Structure

```
src/
├── app/
│   ├── globals.css           # Tailwind + CSS custom properties
│   ├── layout.tsx            # Layout global, Inter font, metadata
│   ├── page.tsx              # Server Component : parse params, rendu 3 états
│   └── api/
│       ├── chat/route.ts     # POST streaming (AI SDK + Gemini 2.5 Flash)
│       └── brief/route.ts    # POST envoi email (Resend)
├── components/
│   ├── Landing.tsx           # État 1 — landing personnalisée
│   ├── Chat.tsx              # État 2 — chat IA (useChat)
│   ├── ChatMessage.tsx       # Bulle individuelle
│   ├── ProgressBar.tsx       # Barre 5 étapes
│   ├── BriefSummary.tsx      # État 3 — récap + CTA
│   └── Header.tsx            # Header compact
├── lib/
│   ├── system-prompt.ts      # Génération system prompt Gemini
│   ├── params.ts             # Parsing + sanitization query params
│   ├── send-brief.ts         # Envoi email Resend
│   ├── rate-limit.ts         # Rate limiting en mémoire
│   └── utils.ts              # Sanitize, color validation, contrast
└── types/
    └── index.ts              # ProspectParams, BriefData, AppState, ApiError
```

---

## Usage Guidelines

**For AI Agents:**

- Read this file BEFORE implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Use the types from `@/types` — ne pas en inventer de nouveaux
- Check `architecture.md` for detailed decision rationale

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Remove rules that become obvious over time

Last Updated: 2026-03-04
