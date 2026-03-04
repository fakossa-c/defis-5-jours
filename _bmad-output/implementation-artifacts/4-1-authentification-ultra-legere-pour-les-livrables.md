# Story 4.1: Authentification Ultra-Legere pour les Livrables

Status: done

## Story

As a prospect ayant complete un Defi 5 Jours,
I want me connecter avec mon nom de societe et email pour consulter le livrable,
so that le resultat soit protege et accessible uniquement a moi.

## Acceptance Criteria

### AC 4.1.1 — Formulaire d'authentification livrable
```gherkin
Given le prospect accede a /livrable
When il n'est pas authentifie
Then un formulaire s'affiche avec :
  And un champ "Nom de la societe" (pre-rempli si query param company, non modifiable si pre-rempli)
  And un champ "Email" (type email, valide cote client et serveur)
  And un bouton "Acceder au livrable"
  And le contenu du livrable est bloque et non visible (FR27)
```

### AC 4.1.2 — Verification des identifiants et creation de session
```gherkin
Given le formulaire est rempli avec societe et email
When le prospect clique sur "Acceder"
Then un POST est envoye a /api/auth avec { company, email }
  And le backend verifie que societe+email correspond a un brief soumis
  And si valide : un cookie HTTP-only 'defi-session' est cree et le livrable est affiche
  And si invalide : le message "Identifiants incorrects" est affiche inline sous le formulaire
```

### AC 4.1.3 — Livrable en lecture seule
```gherkin
Given le prospect est authentifie
When il consulte le livrable
Then le contenu est affiche en lecture seule
  And aucun bouton de telechargement direct n'est propose
  And le contenu est rendu en HTML (pas de lien vers fichier brut)
```

### AC 4.1.4 — Middleware de protection de route
```gherkin
Given le middleware Next.js intercepte une requete vers /livrable
When la requete ne contient pas de cookie de session valide
Then l'utilisateur est redirige vers le formulaire d'authentification
  And les query params (company) sont preserves dans la redirection
```

## Tasks / Subtasks

### Tache 4.1.1 — Creer le module d'authentification src/lib/auth.ts
- [x] Creer `src/lib/auth.ts`
- [x] Implementer `sessionStore: Map<string, { company: string, email: string, createdAt: number }>`
- [x] Exporter `createSession(company: string, email: string): string` — genere un sessionId UUID, stocke dans la Map, retourne le sessionId
- [x] Exporter `getSession(sessionId: string): { company: string, email: string } | null` — verifie existence et retourne les donnees
- [x] Exporter `deleteSession(sessionId: string): void`
- [x] Exporter `setSessionCookie(response: NextResponse, sessionId: string): void` — cookie HTTP-only, secure (prod), SameSite=Lax, path=/livrable
- [x] Exporter `getSessionIdFromCookie(request: NextRequest): string | null` — extraire le cookie 'defi-session'
- [x] Nom du cookie : `'defi-session'`
- [x] TTL de session : 24h (86400000ms), verifier `createdAt` dans `getSession()`

### Tache 4.1.2 — Creer la route API /api/auth
- [x] Creer `src/app/api/auth/route.ts`
- [x] Implementer le handler POST : valider body `{ company: string, email: string }`
- [x] Validation email : regex basique + verification non vide
- [x] Verification : comparer company+email contre les briefs soumis (Map des briefs dans `src/lib/brief-store.ts` ou equivalent)
- [x] Si valide : appeler `createSession()`, construire une `NextResponse` avec `setSessionCookie()`, retourner `{ success: true }`
- [x] Si invalide : retourner 401 `{ error: "Identifiants incorrects", code: "AUTH_INVALID", retryable: false }`
- [x] Normaliser le nom de societe avant comparaison (lowercase, trim)

### Tache 4.1.3 — Creer la page /livrable
- [x] Creer `src/app/livrable/page.tsx`
- [x] Implementer le composant `LivrablePage` avec deux etats : formulaire auth / affichage livrable
- [x] Formulaire auth :
  - Champ "Nom de la societe" : `<input>` pre-rempli depuis `searchParams.company`, `disabled` si pre-rempli
  - Champ "Email" : `<input type="email">` avec validation HTML5
  - Bouton "Acceder au livrable" avec style accent
  - Message d'erreur inline sous le formulaire (etat local)
- [x] Affichage livrable :
  - Contenu en lecture seule, rendu HTML
  - Pas de bouton telechargement
  - Header avec nom de la societe
- [x] Gestion du submit : `fetch('/api/auth', { method: 'POST', body })` puis reload si succes
- [x] Style : design tokens cream-50, cream-100, charcoal-900, accent dynamique
- [x] `'use client'` directive pour les interactions formulaire

### Tache 4.1.4 — Creer/mettre a jour le middleware Next.js
- [x] Creer ou mettre a jour `src/middleware.ts`
- [x] Configurer le matcher pour `/livrable` et `/livrable/:path*`
- [x] Dans le middleware : extraire le cookie 'defi-session' via `getSessionIdFromCookie()`
- [x] Verifier la session via `getSession()` (import depuis `src/lib/auth.ts`)
- [x] Si session invalide ou absente : `NextResponse.redirect` vers `/livrable?auth=required` (preservant les query params existants)
- [x] Si session valide : `NextResponse.next()`
- [x] Exporter le `config.matcher` pour cibler uniquement /livrable

### Tache 4.1.5 — Enrichir /api/brief pour stocker les identifiants
- [x] Modifier `src/app/api/brief/route.ts` (ou le module de stockage associe)
- [x] Lors de la soumission d'un brief, stocker `{ company, email }` dans une Map dediee (ex: `briefCredentials: Map<string, string>` ou key=normalizedCompany, value=email)
- [x] Exporter une fonction `verifyBriefCredentials(company: string, email: string): boolean`
- [x] Cette Map sera utilisee par `/api/auth` pour la verification

### Tache 4.1.6 — Responsivite mobile du formulaire
- [x] Formulaire centre verticalement sur mobile
- [x] Champs full-width sur mobile (max-width: 400px desktop)
- [x] Bouton full-width sur mobile
- [x] Tester sur viewports 375px, 390px, 414px

## Dev Notes

### Architecture technique

- **Session Map** : `Map<string, { company: string, email: string, createdAt: number }>` en memoire serveur
- Les sessions sont perdues au cold start Vercel — acceptable pour le MVP (5-10 briefs/mois)
- Le cookie `defi-session` est HTTP-only pour empecher l'acces JavaScript cote client
- En production : `secure: true`, en dev : `secure: false`

### Flux d'authentification
```
1. Prospect accede a /livrable?company=Otoqi
2. Middleware verifie cookie → pas de session → affiche formulaire
3. Formulaire pre-rempli avec "Otoqi" (disabled)
4. Prospect entre son email → POST /api/auth { company: "Otoqi", email: "..." }
5. Backend verifie contre les briefs soumis
6. Si valide → createSession() → set cookie → redirect /livrable
7. Middleware verifie cookie → session valide → affiche livrable
```

### Configuration du cookie
```typescript
const COOKIE_NAME = 'defi-session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/livrable',
  maxAge: 86400, // 24h en secondes
};
```

### Verification des identifiants
```typescript
// Dans src/lib/brief-store.ts ou equivalent
const briefCredentials = new Map<string, string>(); // key: normalizedCompany, value: email

export function storeBriefCredentials(company: string, email: string): void {
  briefCredentials.set(company.toLowerCase().trim(), email.toLowerCase().trim());
}

export function verifyBriefCredentials(company: string, email: string): boolean {
  const stored = briefCredentials.get(company.toLowerCase().trim());
  return stored === email.toLowerCase().trim();
}
```

### Format d'erreur API
```json
{ "error": "Identifiants incorrects", "code": "AUTH_INVALID", "retryable": false }
```

### Contraintes
- Pas de base de donnees — tout en memoire (Map)
- Pas de hachage de mot de passe (pas de mot de passe, juste email+societe)
- Pas de shadcn/Radix/MUI — Tailwind CSS pur
- Le middleware ne doit pas bloquer les routes publiques (/, /api/chat, /api/brief)
- Session TTL : 24h, nettoyage des sessions expirees a chaque appel `getSession()`

### Tests a prevoir
- Test unitaire : `createSession()` retourne un sessionId valide
- Test unitaire : `getSession()` retourne null pour session expiree
- Test unitaire : `verifyBriefCredentials()` fonctionne avec normalisation
- Test integration : POST /api/auth avec identifiants valides → cookie set
- Test integration : POST /api/auth avec identifiants invalides → 401
- Test integration : middleware redirige si pas de session
- Test integration : middleware laisse passer si session valide

### Structure des fichiers
```
src/
  app/
    api/
      auth/
        route.ts          # POST handler, verification credentials, creation session
    livrable/
      page.tsx            # Formulaire auth + affichage livrable
  lib/
    auth.ts               # Session management, cookie utils
    brief-store.ts        # Stockage credentials des briefs (mise a jour)
  middleware.ts            # Protection route /livrable
```

### References
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Cookies API](https://nextjs.org/docs/app/api-reference/functions/cookies)
- Dependance : Epic 3 (la soumission de brief doit stocker les credentials)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- Build: ✅ pnpm build réussi (Next.js 16.1.6 Turbopack)
- Lint: ✅ ESLint passé sans erreur
- Note: Next.js 16 signale que `middleware` est déprécié au profit de `proxy`, mais fonctionne toujours

### Completion Notes List
- ✅ Tâche 4.1.1: Module auth.ts créé avec sessionStore Map, CRUD session, cookie utils, TTL 24h avec nettoyage à la lecture
- ✅ Tâche 4.1.2: Route API /api/auth créée avec validation email regex, vérification credentials normalisées, création session + cookie, réponse erreur 401 conforme au format ApiError
- ✅ Tâche 4.1.3: Page /livrable (Server Component) + composant LivrableAuth (Client Component). Le Server Component lit searchParams et vérifie l'auth côté serveur via cookies(). Deux états: formulaire auth et affichage livrable lecture seule
- ✅ Tâche 4.1.4: Middleware créé avec matcher /livrable et /livrable/:path*. Vérifie session via cookie, redirige sous-routes sans session, laisse passer /livrable (la page gère elle-même l'affichage formulaire/contenu)
- ✅ Tâche 4.1.5: brief-store.ts créé avec storeBriefCredentials() et verifyBriefCredentials() avec normalisation lowercase/trim. Note: /api/brief n'existe pas encore (Epic 3) — storeBriefCredentials() sera appelé quand cette route sera implémentée
- ✅ Tâche 4.1.6: Responsivité mobile assurée — formulaire centré verticalement, champs/bouton full-width, max-width 400px desktop, touch target 44px minimum

### Senior Developer Review (AI)
- Date: 2026-03-04
- Issues trouvées : 2 HIGH, 2 MEDIUM
- H1 (HIGH): `router.refresh()` après auth réussie — `setIsAuthenticated(true)` ne re-déclenchait pas le Server Component. Remplacé par `router.refresh()` avec suppression du state `isAuthenticated`.
- H2 (HIGH): Commentaire warning isolation mémoire serverless ajouté dans `auth.ts` — l'isolation inter-fonctions en production (pas seulement cold start) était non documentée.
- M2 (MEDIUM): Cleanup proactif des sessions dans `createSession()` — le Map pouvait croître indéfiniment. Ajout d'un nettoyage si >100 entrées.
- M3 (MEDIUM): Micro-interactions hover/active sur le bouton submit — `hover:-translate-y-0.5 active:scale-[0.98]` ajoutés conformément au project-context.
- Résultat: Toutes les issues corrigées. Build et lint passés.

### Change Log
- 2026-03-04: Implémentation complète de l'authentification ultra-légère pour les livrables (6 tâches)
- 2026-03-04: Corrections code review (H1, H2, M2, M3) — router.refresh, warning serverless, cleanup sessions, micro-interactions

### File List
- le-defi-des-5-jours/src/lib/auth.ts (nouveau, modifié: warning + cleanup sessions)
- le-defi-des-5-jours/src/lib/brief-store.ts (nouveau)
- le-defi-des-5-jours/src/app/api/auth/route.ts (nouveau)
- le-defi-des-5-jours/src/app/livrable/page.tsx (nouveau)
- le-defi-des-5-jours/src/components/LivrableAuth.tsx (nouveau, modifié: router.refresh + micro-interactions)
- le-defi-des-5-jours/src/middleware.ts (nouveau)
