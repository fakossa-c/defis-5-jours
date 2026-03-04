---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-04'
inputDocuments: ["product-brief-defis-5-jours-2026-03-04.md", "prd.md", "ux-design-specification.md"]
project_name: defis-5-jours
user_name: Fakos
date: '2026-03-04'
---

# Architecture Decision Document

_Document d'architecture pour le projet Le Défi 5 Jours — application web de qualification de leads via chat IA._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

30 FRs réparties en 6 domaines :
- **Personnalisation & Contexte** (FR1-FR4) : parsing des query params URL, affichage dynamique nom/couleur/rôle, fallback générique
- **Landing & Onboarding** (FR5-FR7) : landing personnalisée, compréhension < 3 sec, CTA "Commencer"
- **Chat IA Conversationnel** (FR8-FR16) : streaming mot par mot, flow 5 étapes, reformulation, cadrage scope, barre de progression, max 8-10 échanges
- **Brief & Récapitulatif** (FR17-FR20) : génération brief structuré, affichage lisible, confirmation, CTA Calendly
- **Notification** (FR21-FR23) : email structuré via Resend, envoi < 30 sec, brief lisible par Fakossa
- **Auth & Sécurité** (FR24-FR30) : auth ultra-légère (nom société + email), protection livrables, rate limiting 10/h/IP, sanitization XSS, clé API server-side

**Non-Functional Requirements:**

11 NFRs organisées en 4 axes :
- **Performance** (NFR1-NFR3) : FCP < 1.5s, premier token IA < 500ms, email < 30s
- **Sécurité** (NFR4-NFR7) : clé API server-only, sanitization XSS, rate limiting, auth livrable
- **Scalabilité** (NFR8-NFR9) : 50 conversations simultanées, architecture extensible vers Supabase
- **Accessibilité** (NFR10-NFR11) : WCAG AA contraste dynamique, navigation clavier

**Scale & Complexity:**

- Domaine principal : Web app full-stack (Next.js App Router)
- Niveau de complexité : **Low** — pas de régulation, pas de données sensibles, pas de paiement, pas de multi-tenancy
- Composants architecturaux estimés : ~10 (6 composants UI + 2 API routes + lib modules + config)

### Technical Constraints & Dependencies

- **Budget tech : zéro** — tous les services doivent avoir un tier gratuit (Vercel, Gemini, Resend)
- **Solo developer** — architecture simple, pas de microservices, pas de monorepo
- **Dépendance API Gemini** — ~~Gemini 2.0 Flash~~ **Gemini 2.5 Flash** (2.0 Flash déprécié le 1er juin 2026)
- **Dépendance Vercel** — Edge Runtime pour les API routes, déploiement automatique
- **Pas de base de données MVP** — l'email est le seul canal de notification (Supabase prévu en V2)
- **Personnalisation dynamique** — CSS custom properties pour la couleur d'accent, injectée depuis les query params

### Cross-Cutting Concerns Identified

1. **Personnalisation dynamique** : affecte la landing, le header, le chat, le récap (couleur accent + nom entreprise partout)
2. **Contexte prospect** : les query params (company, role, sector, contact, color, source) circulent de la landing → chat (system prompt) → brief → email
3. **Sécurité des inputs** : sanitization XSS sur tous les params URL, rate limiting sur toutes les API routes
4. **Streaming IA** : SSE depuis l'API route, consommé par le composant Chat
5. **Gestion d'erreur** : erreur Gemini, erreur Resend, rate limit — chaque cas doit avoir un fallback UX gracieux

---

## Starter Template Evaluation

### Primary Technology Domain

**Web application full-stack** (Next.js App Router) — SSR pour la landing, client components pour le chat interactif, API routes pour le backend.

### Starter Options Considered

| Option | Avantages | Inconvénients |
|---|---|---|
| `create-next-app` (officiel) | Scaffolding officiel, App Router natif, Tailwind intégré, Turbopack | Minimal — pas d'IA, pas de design system |
| `create-t3-app` | Stack complète (tRPC, Prisma, Auth) | Over-engineered pour ce projet — pas besoin de tRPC ni Prisma en MVP |
| Custom from scratch | Contrôle total | Perte de temps inutile |

### Selected Starter: `create-next-app`

**Rationale :** le projet est simple (6 composants, 2 API routes). Un starter minimal avec App Router + Tailwind suffit. Les dépendances IA (ai, @ai-sdk/google) et email (resend) s'ajoutent en 2 commandes npm.

**Commande d'initialisation :**

```bash
pnpm create next-app le-defi-des-5-jours --typescript --tailwind --eslint --app --src-dir --import-alias="@/*" --turbopack --use-pnpm
```

**Décisions architecturales fournies par le starter :**

**Language & Runtime :**
- TypeScript strict
- Node.js (Vercel Edge Runtime pour les API routes)

**Styling :**
- Tailwind CSS v4.2 (intégré par le starter)
- CSS custom properties pour le theming dynamique (ajout manuel)

**Build Tooling :**
- Turbopack (dev)
- Next.js build optimisé (prod)
- Tree-shaking automatique

**Testing Framework :**
- Non fourni par le starter — à définir (non critique pour le MVP)

**Code Organization :**
- `src/` directory activé
- App Router (`src/app/`)
- Import alias `@/*` → `src/*`

**Development Experience :**
- Hot reloading via Turbopack
- TypeScript checking intégré
- ESLint configuré

**Note :** L'initialisation du projet avec cette commande sera la première story d'implémentation.

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation) :**
- Modèle IA : Gemini 2.5 Flash via @ai-sdk/google
- Email : Resend API
- Déploiement : Vercel
- State management : React useState (3 états séquentiels)
- Auth livrable : session simple (nom société + email)

**Important Decisions (Shape Architecture) :**
- Streaming : Vercel AI SDK streamText()
- Progression : détection d'étape via le system prompt IA (tag JSON dans la réponse)
- CSS theming : custom properties injectées côté serveur

**Deferred Decisions (Post-MVP) :**
- Base de données (Supabase en V2)
- PDF generation
- Webhook n8n
- Analytics avancées

### Data Architecture

**Pas de base de données en MVP.**

Le flux de données est linéaire et éphémère :

```
[Query params URL] → [State React (conversation)] → [Brief JSON] → [Email Resend]
```

- **Données en mémoire** : conversation (messages[]), paramètres prospect, brief structuré
- **Données persistées** : uniquement l'email envoyé à Fakossa (pas de stockage côté app)
- **Données d'auth livrable** : session simple côté serveur (cookie HTTP-only) — pas de DB

**Décision** : Pas de base de données en MVP
**Rationale** : Le volume cible est 5-10 briefs/mois. L'email suffit comme "base de données". Supabase sera ajouté quand le volume dépasse 20 briefs/mois (V2).
**Extensibilité** : L'architecture prévoit un module `lib/storage.ts` avec une interface abstraite pour ajouter Supabase sans refactoring.

### Authentication & Security

**Auth ultra-légère pour les livrables :**

| Aspect | Décision |
|---|---|
| Méthode | Session simple (cookie HTTP-only) |
| Username | Nom de la société (pré-rempli via query param, non modifiable) |
| Password | Email du contact |
| Stockage sessions | En mémoire serveur (Map) — suffisant pour le volume MVP |
| Protection livrable | Middleware Next.js vérifiant la session avant d'afficher la page livrable |
| Unicité | Une seule soumission par nom de société |

**Sécurité :**

| Mesure | Implémentation |
|---|---|
| Clé API Gemini | Variable d'environnement `GOOGLE_GENERATIVE_AI_API_KEY`, jamais exposée côté client |
| Sanitization XSS | Validation + échappement de tous les query params avant injection dans le DOM |
| Rate limiting | Middleware custom : Map<IP, timestamp[]> avec fenêtre glissante de 1h, max 10 conversations |
| CORS | Restrictif — uniquement le domaine de l'app |

### API & Communication Patterns

**2 API routes (Next.js Route Handlers) :**

| Route | Méthode | Description | Input | Output |
|---|---|---|---|---|
| `/api/chat` | POST | Streaming chat IA | `{ messages[], context: { company, role, sector } }` | SSE stream (text/event-stream) |
| `/api/brief` | POST | Envoi brief par email | `{ brief: BriefData, metadata: ProspectMetadata }` | `{ success: boolean }` |

**Streaming pattern :**
- Utilisation de `streamText()` de Vercel AI SDK 6
- Le provider `@ai-sdk/google` envoie le system prompt + messages à Gemini 2.5 Flash
- Le frontend consomme le stream via `useChat()` hook du AI SDK

**Error handling standard :**

```typescript
// Format d'erreur API uniforme
type ApiError = {
  error: string       // Message lisible
  code: string        // Code machine (RATE_LIMIT, GEMINI_ERROR, RESEND_ERROR)
  retryable: boolean  // Le client peut réessayer ?
}
```

**Rate limiting :**
- Appliqué sur `/api/chat` uniquement (c'est la route coûteuse)
- 10 requêtes/heure/IP (fenêtre glissante)
- Réponse 429 avec message amical côté UX

### Frontend Architecture

**State management :**
- React `useState` pour l'état principal de l'app : `'landing' | 'chat' | 'recap'`
- `useChat()` hook (AI SDK 6) pour la gestion des messages et du streaming
- Pas de state manager global (Redux, Zustand) — l'app est trop simple

**Component architecture :**
- 6 composants custom (Landing, Chat, ChatMessage, ProgressBar, BriefSummary, Header)
- Pas de component library UI (shadcn, Radix) — trop lourd pour 6 composants
- Tailwind CSS + CSS custom properties pour tout le styling

**Routing :**
- Pas de routing côté client — single page avec 3 états React
- Une seule route Next.js : `/` (page.tsx)
- Les API routes dans `src/app/api/`

**Détection de progression :**
- Le system prompt Gemini inclut une instruction de retourner un tag JSON `{"step": N}` dans chaque réponse
- Le frontend parse ce tag (invisible pour le prospect) pour mettre à jour la barre de progression
- Parsing regex côté client sur le stream terminé

### Infrastructure & Deployment

| Aspect | Décision |
|---|---|
| Hosting | Vercel (tier gratuit) |
| Domain | `defi.fakossa.dev` (custom domain sur Vercel) |
| Runtime API routes | Vercel Edge Runtime |
| CI/CD | Vercel auto-deploy sur push (branche main) |
| Environment vars | Vercel dashboard : `GOOGLE_GENERATIVE_AI_API_KEY`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL` |
| Monitoring | Vercel Analytics (basique, gratuit) |
| Logging | `console.log` côté serveur (Vercel Logs) — suffisant pour le MVP |

### Decision Impact Analysis

**Séquence d'implémentation :**

1. Initialisation projet (create-next-app)
2. Design system (CSS custom properties, tokens Tailwind)
3. Parsing query params + landing personnalisée
4. API route chat + intégration Gemini 2.5 Flash
5. Interface chat (useChat, streaming, bulles)
6. Détection progression + barre
7. Génération brief structuré
8. API route brief + intégration Resend
9. Écran récapitulatif
10. Auth livrable
11. Rate limiting + sécurité
12. Responsive mobile
13. Tests manuels E2E + déploiement

**Dépendances entre composants :**

```
Landing ──→ Chat ──→ BriefSummary
   │            │           │
   └──[params]──┘    [brief JSON]
                     │
              /api/chat ──→ /api/brief ──→ Resend
                  │
              Gemini 2.5 Flash
```

---

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**12 zones de conflit potentiel identifiées** pour garantir la cohérence entre les agents IA.

### Naming Patterns

**File Naming :**
- Composants React : `PascalCase.tsx` → `Landing.tsx`, `ChatMessage.tsx`
- Modules lib : `kebab-case.ts` → `system-prompt.ts`, `send-brief.ts`
- API routes : `route.ts` dans le dossier correspondant
- Types : `kebab-case.ts` → `types.ts` ou `brief.ts`

**Code Naming :**
- Variables/fonctions : `camelCase` → `sendBrief()`, `prospectParams`
- Types/Interfaces : `PascalCase` → `BriefData`, `ProspectMetadata`
- Constantes : `SCREAMING_SNAKE_CASE` → `MAX_CONVERSATIONS_PER_HOUR`
- CSS custom properties : `--kebab-case` → `--accent`, `--cream-50`

**API Naming :**
- Routes : `/api/kebab-case` → `/api/chat`, `/api/brief`
- JSON fields : `snake_case` dans le brief (cohérent avec le format de sortie Gemini) → `five_day_scope`, `desired_outcome`
- Headers custom : aucun prévu

### Structure Patterns

**Organisation par type (pas par feature)** — l'app est trop petite pour justifier une organisation par feature :

```
src/
├── app/           # Routes et pages Next.js
├── components/    # Composants React
├── lib/           # Logique métier, utilitaires
└── types/         # Types TypeScript partagés
```

**Tests :**
- Pas de tests automatisés en MVP (solo dev, 6 composants)
- Tests manuels : scénarios E2E décrits dans le PRD
- Structure prévue pour V2 : `__tests__/` co-localisé avec les composants

### Format Patterns

**API Response Format :**

```typescript
// Succès
{ success: true, data?: any }

// Erreur
{ error: string, code: string, retryable: boolean }
```

**Brief JSON Format (sortie Gemini → email) :**

```typescript
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
```

**Date/time :** ISO 8601 (`2026-03-04T14:30:00Z`) dans les métadonnées.

### Communication Patterns

**State transitions (React) :**

```typescript
type AppState = 'landing' | 'chat' | 'recap'

// Transitions autorisées :
// landing → chat (clic "Commencer")
// chat → recap (brief généré)
// Pas de retour en arrière
```

**Passage de contexte :**
- Les query params sont parsés une seule fois au chargement (composant serveur `page.tsx`)
- Passés en props aux composants enfants (pas de Context React — trop simple)
- Le contexte prospect est envoyé à `/api/chat` dans le body de chaque requête

### Process Patterns

**Error Handling :**

| Erreur | Comportement UX | Comportement technique |
|---|---|---|
| Gemini API down | Bandeau rouge "Oups, un souci technique. Réessayez." + bouton Réessayer | Catch dans l'API route, retour 503 avec `retryable: true` |
| Resend API down | Le prospect voit quand même le récap. Message "Brief envoyé !" (optimiste). Fakossa notifié manuellement si échec. | Log d'erreur côté serveur, pas de blocage UX |
| Rate limit | Message inline "Beaucoup de demandes, revenez dans quelques minutes" | 429 avec `retryable: false` |
| Param XSS détecté | Param ignoré, fallback sur valeur par défaut | Sanitization silencieuse, pas d'erreur visible |

**Loading States :**
- **Landing** : skeleton minimal pendant le parsing des params (< 100ms, invisible en pratique)
- **Chat** : pas de loader — le streaming commence directement (curseur clignotant `|`)
- **Brief envoi** : optimiste — le récap s'affiche immédiatement, l'email part en background

### Enforcement Guidelines

**Tous les agents IA DOIVENT :**

1. Utiliser les CSS custom properties (`--accent`, `--cream-50`, etc.) pour tout le styling — jamais de couleurs en dur
2. Typer toutes les données avec les types définis dans `src/types/`
3. Sanitizer tous les inputs externes (query params, messages chat) avant usage
4. Utiliser `camelCase` pour les variables JS et `snake_case` pour les champs JSON du brief
5. Ne jamais exposer de clé API côté client — toutes les API calls vers Gemini/Resend passent par les API routes

**Anti-Patterns :**

- Ne PAS utiliser `dangerouslySetInnerHTML` — jamais, nulle part
- Ne PAS créer de fichier de configuration supplémentaire — tout est dans les CSS custom properties et les variables d'environnement
- Ne PAS ajouter de dépendance UI (shadcn, Radix, Material UI) — Tailwind + custom components uniquement
- Ne PAS utiliser `useEffect` pour fetch des données — utiliser les Server Components ou `useChat` du AI SDK

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
le-defi-des-5-jours/
├── .env.local                    # Variables d'environnement (GOOGLE_GENERATIVE_AI_API_KEY, RESEND_API_KEY, NOTIFICATION_EMAIL)
├── .env.example                  # Template des variables d'environnement (sans valeurs)
├── .gitignore
├── .eslintrc.json
├── next.config.ts
├── tailwind.config.ts            # Config Tailwind + extension avec les CSS custom properties
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── public/
│   ├── favicon.ico
│   └── avatar-fakossa.webp       # Avatar Fakossa (24px et 32px, format webp)
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind directives + CSS custom properties (tokens statiques + dynamiques)
│   │   ├── layout.tsx            # Layout global : Inter font, metadata, injection --accent via query param
│   │   ├── page.tsx              # Page unique : parsing params URL (Server Component) + rendu conditionnel des 3 états
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts      # POST streaming chat IA (Vercel AI SDK + Gemini 2.5 Flash)
│   │       └── brief/
│   │           └── route.ts      # POST envoi brief par email (Resend)
│   ├── components/
│   │   ├── Landing.tsx           # État 1 — Accueil personnalisé (company, role, color)
│   │   ├── Chat.tsx              # État 2 — Interface chat (useChat, messages, input, progression)
│   │   ├── ChatMessage.tsx       # Bulle de message individuelle (IA gauche / prospect droite)
│   │   ├── ProgressBar.tsx       # Barre de progression 5 étapes (accent color)
│   │   ├── BriefSummary.tsx      # État 3 — Récapitulatif du brief + confirmation + CTA Calendly
│   │   └── Header.tsx            # Header compact (avatar + "Le Défi 5 Jours × [Entreprise]")
│   ├── lib/
│   │   ├── system-prompt.ts      # Génération du system prompt Gemini avec contexte prospect
│   │   ├── params.ts             # Parsing, validation et sanitization des query params URL
│   │   ├── send-brief.ts         # Logique d'envoi email via Resend (formatage HTML du brief)
│   │   ├── rate-limit.ts         # Rate limiting en mémoire (Map<IP, timestamp[]>)
│   │   └── utils.ts              # Utilitaires partagés (sanitize, color validation, contrast check)
│   └── types/
│       └── index.ts              # Types partagés : ProspectParams, BriefData, AppState, ApiError
```

### Architectural Boundaries

**API Boundaries :**
- `/api/chat` : seul point d'entrée vers Gemini. Reçoit les messages + contexte, retourne un stream SSE. Rate limited.
- `/api/brief` : seul point d'entrée vers Resend. Reçoit le brief structuré + métadonnées, envoie l'email.
- Pas d'API publique — toutes les routes sont internes à l'app.

**Component Boundaries :**
- `page.tsx` (Server Component) : parse les query params, passe les props aux composants client
- `Landing`, `Chat`, `BriefSummary` : composants client indépendants, reçoivent le contexte prospect en props
- `Chat` encapsule `ChatMessage`, `ProgressBar` et l'input — c'est le seul composant qui utilise `useChat()`
- `BriefSummary` est le seul composant qui appelle `/api/brief`

**Data Boundaries :**
- Pas de base de données
- Les données vivent dans le state React pendant la session
- L'email est la seule "persistance" (côté Fakossa)
- Le brief JSON est la seule structure de données échangée entre le chat et le récap

### Requirements to Structure Mapping

| Domaine FR | Fichiers impactés |
|---|---|
| Personnalisation (FR1-FR4) | `lib/params.ts`, `page.tsx`, `globals.css`, `Landing.tsx`, `Header.tsx` |
| Landing (FR5-FR7) | `Landing.tsx`, `page.tsx` |
| Chat IA (FR8-FR16) | `Chat.tsx`, `ChatMessage.tsx`, `ProgressBar.tsx`, `api/chat/route.ts`, `lib/system-prompt.ts` |
| Brief (FR17-FR20) | `BriefSummary.tsx`, `Chat.tsx` (extraction brief du stream) |
| Notification (FR21-FR23) | `api/brief/route.ts`, `lib/send-brief.ts` |
| Auth (FR24-FR27) | Post-MVP — futurs fichiers `src/app/livrable/`, `lib/auth.ts`, `middleware.ts` |
| Sécurité (FR28-FR30) | `lib/rate-limit.ts`, `lib/params.ts`, `api/chat/route.ts` |

### Integration Points

**Intégrations externes :**

| Service | Module d'intégration | Variable d'env |
|---|---|---|
| Google Gemini 2.5 Flash | `api/chat/route.ts` via `@ai-sdk/google` | `GOOGLE_GENERATIVE_AI_API_KEY` |
| Resend | `lib/send-brief.ts` via `resend` | `RESEND_API_KEY` |
| Calendly | Lien direct dans `BriefSummary.tsx` (pas d'API) | Hardcodé (URL Calendly de Fakossa) |

**Data Flow :**

```
[Pitch HTML] ──URL params──→ [page.tsx] ──props──→ [Landing]
                                                      │
                                                   [Chat] ←──stream──→ [/api/chat] ←──→ [Gemini 2.5 Flash]
                                                      │
                                                 [brief JSON]
                                                      │
                                              [BriefSummary] ──POST──→ [/api/brief] ──→ [Resend] ──→ [Email Fakossa]
```

---

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility :**
- Next.js 16 + Vercel AI SDK 6 + @ai-sdk/google 3.x : compatibilité native, même écosystème Vercel
- Tailwind CSS 4.2 + CSS custom properties : fonctionne nativement, pas de conflit
- Resend 6.9 + Next.js API routes : intégration triviale (appel API dans un Route Handler)
- TypeScript strict + AI SDK 6 : types fournis par le SDK

**Pattern Consistency :**
- Naming conventions cohérentes entre fichiers (kebab-case), composants (PascalCase), variables (camelCase)
- Brief JSON en snake_case partout (Gemini output → API → email)
- CSS custom properties utilisées uniformément pour le theming

**Structure Alignment :**
- Structure plate et simple (pas de nesting excessif)
- Chaque fichier a une responsabilité claire
- Les boundaries sont évidentes : UI dans `components/`, logique dans `lib/`, API dans `app/api/`

### Requirements Coverage Validation ✅

**Functional Requirements Coverage :**

| FR Range | Coverage | Fichier(s) |
|---|---|---|
| FR1-FR4 (Personnalisation) | ✅ Complet | params.ts, page.tsx, globals.css |
| FR5-FR7 (Landing) | ✅ Complet | Landing.tsx |
| FR8-FR16 (Chat IA) | ✅ Complet | Chat.tsx, api/chat/route.ts, system-prompt.ts |
| FR17-FR20 (Brief) | ✅ Complet | BriefSummary.tsx |
| FR21-FR23 (Notification) | ✅ Complet | api/brief/route.ts, send-brief.ts |
| FR24-FR27 (Auth livrable) | ⏳ Architecture prévue, implémentation post-chat | middleware.ts (à créer) |
| FR28-FR30 (Sécurité) | ✅ Complet | rate-limit.ts, params.ts |

**Non-Functional Requirements Coverage :**

| NFR | Coverage | Comment |
|---|---|---|
| NFR1 (FCP < 1.5s) | ✅ | Server-side rendering landing + Vercel Edge |
| NFR2 (Token < 500ms) | ✅ | Gemini 2.5 Flash + Edge Runtime |
| NFR3 (Email < 30s) | ✅ | Resend API (latence < 1s typique) |
| NFR4-NFR7 (Sécurité) | ✅ | Server-side key, sanitization, rate limit, auth |
| NFR8-NFR9 (Scalabilité) | ✅ | Vercel serverless + architecture extensible |
| NFR10-NFR11 (Accessibilité) | ✅ | Contrast check auto + navigation clavier |

### Implementation Readiness Validation ✅

**Decision Completeness :**
- Toutes les décisions critiques documentées avec versions vérifiées
- Patterns d'implémentation complets avec exemples de code
- Types TypeScript définis pour toutes les structures de données

**Structure Completeness :**
- Arborescence complète avec description de chaque fichier
- Mapping FR → fichiers explicite
- Points d'intégration clairement identifiés

**Pattern Completeness :**
- Naming, structure, format, communication et process patterns tous définis
- Anti-patterns documentés
- Error handling couvrant tous les cas identifiés

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Contexte projet analysé en profondeur
- [x] Complexité évaluée (low)
- [x] Contraintes techniques identifiées (budget zéro, solo dev)
- [x] Cross-cutting concerns mappés (5 identifiés)

**✅ Architectural Decisions**

- [x] Décisions critiques documentées avec versions
- [x] Stack technique complètement spécifiée
- [x] Patterns d'intégration définis
- [x] Considérations de performance adressées

**✅ Implementation Patterns**

- [x] Conventions de nommage établies
- [x] Patterns de structure définis
- [x] Patterns de communication spécifiés
- [x] Patterns de process documentés

**✅ Project Structure**

- [x] Arborescence complète définie
- [x] Boundaries de composants établis
- [x] Points d'intégration mappés
- [x] Mapping requirements → structure complet

### Architecture Readiness Assessment

**Overall Status : READY FOR IMPLEMENTATION**

**Confidence Level : High** — projet de complexité low, stack éprouvée, pas d'inconnues majeures.

**Key Strengths :**

1. Stack homogène Vercel (Next.js + AI SDK + Hosting) — zéro friction d'intégration
2. Architecture simple et plate — facile à comprendre, à implémenter et à maintenir
3. Zéro coût d'infrastructure (tous les services en tier gratuit)
4. Extensibilité prévue (interface abstraite pour Supabase en V2)

**Areas for Future Enhancement :**

1. Base de données (Supabase) quand le volume dépasse 20 briefs/mois
2. Tests automatisés (Playwright E2E) en V2
3. Monitoring avancé (Sentry) si des erreurs récurrentes apparaissent
4. Cache des sessions auth (Redis ou KV Vercel) si le volume d'auth augmente

### Implementation Handoff

**AI Agent Guidelines :**

- Suivre toutes les décisions architecturales exactement comme documentées
- Utiliser les patterns d'implémentation de manière cohérente dans tous les composants
- Respecter la structure projet et les boundaries
- Se référer à ce document pour toute question architecturale
- **IMPORTANT** : Utiliser Gemini **2.5 Flash** (pas 2.0 Flash — déprécié juin 2026)

**Première priorité d'implémentation :**

```bash
pnpm create next-app le-defi-des-5-jours --typescript --tailwind --eslint --app --src-dir --import-alias="@/*" --turbopack --use-pnpm
```

Puis installer les dépendances additionnelles :

```bash
cd le-defi-des-5-jours
pnpm add ai @ai-sdk/google resend
```

### Technology Versions (vérifiées le 2026-03-04)

| Technologie | Version | Package |
|---|---|---|
| Next.js | 16.1.6 | `next` |
| React | 19.x (inclus avec Next.js 16) | `react`, `react-dom` |
| Vercel AI SDK | 6.0.111 | `ai` |
| @ai-sdk/google | 3.0.37 | `@ai-sdk/google` |
| Tailwind CSS | 4.2.1 | `tailwindcss` |
| Resend | 6.9.3 | `resend` |
| TypeScript | 5.x (inclus avec create-next-app) | `typescript` |
| Modèle IA | Gemini 2.5 Flash | Model ID : `gemini-2.5-flash` |
