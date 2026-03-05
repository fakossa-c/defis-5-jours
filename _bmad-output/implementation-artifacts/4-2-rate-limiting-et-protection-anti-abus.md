# Story 4.2: Rate Limiting & Protection Anti-Abus

Status: done

## Story

As operateur du systeme,
I want limiter les conversations IA par IP et empecher soumissions multiples,
so that l'API Gemini ne soit pas abusee.

## Acceptance Criteria

### AC 4.2.1 — Rate limiting par IP sur /api/chat
```gherkin
Given une IP a effectue 10 requetes vers /api/chat dans la derniere heure
When la 11eme requete est recue
Then le serveur retourne un statut 429
  And le body contient { error: "Beaucoup de demandes, revenez dans quelques minutes", code: "RATE_LIMIT", retryable: false }
  And un message inline amical est affiche dans le chat (FR28)
```

### AC 4.2.2 — Module de rate limiting avec fenetre glissante
```gherkin
Given le module src/lib/rate-limit.ts est initialise
When il recoit une IP a verifier
Then il consulte Map<string, number[]> pour cette IP
  And il filtre les timestamps dans la fenetre glissante de 1 heure
  And il supprime les timestamps expires (> 1h)
  And il retourne true si le nombre de requetes < 10, false sinon
```

### AC 4.2.3 — Detection de soumission de brief en doublon
```gherkin
Given la societe "Otoqi" a deja soumis un brief
When la meme societe (nom normalise) tente de soumettre a nouveau
Then la soumission est bloquee
  And le message "Un brief a deja ete soumis pour Otoqi" est affiche (FR26)
  And le statut HTTP retourne est 409 Conflict
```

### AC 4.2.4 — Reinitialisation au cold start
```gherkin
Given les Maps en memoire contiennent des donnees de rate limiting et de doublons
When un cold start Vercel survient
Then les Maps sont reinitialisees (vides)
  And les limites se reappliquent a partir de zero
  And ceci est acceptable pour le volume MVP (5-10 briefs/mois)
```

## Tasks / Subtasks

### Tache 4.2.1 — Creer le module src/lib/rate-limit.ts
- [x] Creer `src/lib/rate-limit.ts`
- [x] Definir la constante `MAX_CONVERSATIONS_PER_HOUR = 10`
- [x] Definir la constante `WINDOW_MS = 3_600_000` (1 heure en millisecondes)
- [x] Implementer `requestLog: Map<string, number[]>` — cle = IP, valeur = tableau de timestamps
- [x] Exporter `checkRateLimit(ip: string): { allowed: boolean, remaining: number, resetAt: number }`
  - Recuperer les timestamps pour cette IP
  - Filtrer pour ne garder que ceux dans la fenetre (Date.now() - WINDOW_MS)
  - Mettre a jour la Map avec les timestamps filtres
  - Si nombre < MAX : ajouter le timestamp actuel, retourner `{ allowed: true, remaining: MAX - count - 1, resetAt }`
  - Si nombre >= MAX : retourner `{ allowed: false, remaining: 0, resetAt: oldestTimestamp + WINDOW_MS }`
- [x] Exporter `getRateLimitHeaders(result): Record<string, string>` pour les headers de reponse (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)

### Tache 4.2.2 — Integrer le rate limiting dans /api/chat
- [x] Modifier `src/app/api/chat/route.ts`
- [x] Au debut du handler POST, extraire l'IP : `request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'`
- [x] Appeler `checkRateLimit(ip)`
- [x] Si `allowed === false` : retourner `NextResponse.json({ error: "Beaucoup de demandes, revenez dans quelques minutes", code: "RATE_LIMIT", retryable: false }, { status: 429 })` avec les headers rate limit
- [x] Si `allowed === true` : continuer le traitement normal (streamText)
- [x] Ajouter les headers rate limit a toutes les reponses (200 et 429)

### Tache 4.2.3 — Creer la verification de doublon dans /api/brief
- [x] Modifier ou creer le module de stockage des briefs (ex: `src/lib/brief-store.ts`)
- [x] Implementer `submittedCompanies: Map<string, boolean>` — cle = nom societe normalise (lowercase, trim)
- [x] Exporter `checkDuplicateSubmission(company: string): boolean` — retourne true si deja soumis
- [x] Exporter `markCompanySubmitted(company: string): void` — enregistre la soumission
- [x] Integrer dans `src/app/api/brief/route.ts` : _(débloqué — Story 3.2 done)_
  - Avant le traitement, appeler `checkDuplicateSubmission(company)`
  - Si doublon : retourner 409 `{ error: "Un brief a deja ete soumis pour [Entreprise]", code: "DUPLICATE_SUBMISSION", retryable: false }`
  - Si nouveau : appeler `markCompanySubmitted(company)` apres traitement reussi

### Tache 4.2.4 — Afficher le message de rate limit dans Chat.tsx
- [x] Modifier `src/components/Chat.tsx`
- [x] Detecter les reponses avec statut 429 dans le handler d'erreur de `useChat()`
- [x] Afficher un message inline amical dans la zone de chat : "Beaucoup de demandes, revenez dans quelques minutes"
- [x] Style : bulle systeme centree, bg `cream-100`, texte `charcoal-900`, icone horloge optionnelle
- [x] Ne pas afficher le bandeau d'erreur rouge pour les 429 (message inline a la place)
- [x] Desactiver l'input temporairement quand rate limited

### Tache 4.2.5 — Afficher le message de doublon dans BriefSummary.tsx
- [x] Modifier `src/components/BriefSummary.tsx` _(débloqué — Story 3.1 done)_
- [x] Detecter les reponses avec statut 409 lors de la soumission
- [x] Afficher le message "Un brief a deja ete soumis pour [Entreprise]" inline
- [x] Style : texte orange (#F97316), pas de bandeau d'erreur intrusif
- [x] Soumission auto via useEffect — pas de bouton re-submit à désactiver

## Dev Notes

### Architecture technique

- **Rate limiting** : fenetre glissante (sliding window) basee sur des timestamps en memoire
- **Detection doublon** : Map simple avec nom de societe normalise comme cle
- Tout est en memoire (Map) — reinitialise au cold start Vercel, acceptable pour le MVP

### Implementation du rate limit
```typescript
// src/lib/rate-limit.ts
const MAX_CONVERSATIONS_PER_HOUR = 10;
const WINDOW_MS = 3_600_000; // 1 heure

const requestLog = new Map<string, number[]>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Recuperer et nettoyer les timestamps
  const timestamps = (requestLog.get(ip) || []).filter(t => t > windowStart);

  if (timestamps.length >= MAX_CONVERSATIONS_PER_HOUR) {
    requestLog.set(ip, timestamps);
    return {
      allowed: false,
      remaining: 0,
      resetAt: timestamps[0] + WINDOW_MS,
    };
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);

  return {
    allowed: true,
    remaining: MAX_CONVERSATIONS_PER_HOUR - timestamps.length,
    resetAt: timestamps[0] + WINDOW_MS,
  };
}
```

### Extraction de l'IP sur Vercel
```typescript
function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
```

### Normalisation du nom de societe
```typescript
function normalizeCompany(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
}
```

### Format d'erreur API — Rate limit
```json
{ "error": "Beaucoup de demandes, revenez dans quelques minutes", "code": "RATE_LIMIT", "retryable": false }
```

### Format d'erreur API — Doublon
```json
{ "error": "Un brief a deja ete soumis pour Otoqi", "code": "DUPLICATE_SUBMISSION", "retryable": false }
```

### Headers de rate limiting
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1709568000
```

### Contraintes
- Pas de Redis ni de base de donnees — tout en memoire
- Le nettoyage des timestamps expires se fait a chaque appel (pas de cron)
- `MAX_CONVERSATIONS_PER_HOUR` est une constante exportee pour faciliter les tests
- L'IP 'unknown' est traitee comme une IP normale (rate limitee comme les autres)
- Pas de bypass pour les IP internes en MVP

### Gestion du 429 dans Chat.tsx
```typescript
// Dans le onError ou la gestion de reponse de useChat
if (response.status === 429) {
  // Afficher message inline au lieu du bandeau d'erreur
  setRateLimitMessage("Beaucoup de demandes, revenez dans quelques minutes");
}
```

### Tests a prevoir
- Test unitaire : `checkRateLimit()` autorise 10 requetes
- Test unitaire : `checkRateLimit()` bloque la 11eme requete
- Test unitaire : `checkRateLimit()` nettoie les timestamps expires
- Test unitaire : `checkDuplicateSubmission()` detecte les doublons normalises
- Test unitaire : normalisation ("  Otoqi  " === "otoqi")
- Test integration : /api/chat retourne 429 apres 10 requetes
- Test integration : /api/brief retourne 409 pour doublon
- Test integration : Chat.tsx affiche message inline sur 429
- Test integration : BriefSummary.tsx affiche message doublon sur 409

### Structure des fichiers
```
src/
  app/
    api/
      chat/
        route.ts          # Integration rate limiting (mise a jour)
      brief/
        route.ts          # Integration detection doublon (mise a jour)
  components/
    Chat.tsx              # Gestion message 429 inline (mise a jour)
    BriefSummary.tsx      # Gestion message 409 doublon (mise a jour)
  lib/
    rate-limit.ts         # Module rate limiting (nouveau)
    brief-store.ts        # Detection doublons (mise a jour)
```

### References
- [Vercel Rate Limiting](https://vercel.com/docs/functions/rate-limiting)
- [HTTP 429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
- Dependance : Epic 2 Story 2.1 (/api/chat doit exister)
- Dependance : Epic 3 Story 3.2 (/api/brief doit exister)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- Lint error: `react-hooks/set-state-in-effect` — corrigé en remplaçant `useState` + `useEffect` par `useMemo` pour dériver `rateLimitMessage`
- Dépendances manquantes : `/api/brief/route.ts` et `BriefSummary.tsx` n'existent pas encore (Epic 3 non implémenté) — tâches 4.2.3 (intégration API) et 4.2.5 bloquées

### Completion Notes List
- ✅ Tâche 4.2.1 : Module `rate-limit.ts` créé avec sliding window, constantes exportées, `checkRateLimit()` et `getRateLimitHeaders()`
- ✅ Tâche 4.2.2 : Rate limiting intégré dans `/api/chat` — extraction IP, vérification avant traitement, headers sur toutes les réponses (200, 400, 429, 503)
- ✅ Tâche 4.2.3 (complet) : `brief-store.ts` avec `checkDuplicateSubmission()`, `markCompanySubmitted()`. Intégré dans `/api/brief/route.ts` — vérification doublon avant envoi (409), marquage après envoi réussi.
- ✅ Tâche 4.2.4 : `Chat.tsx` gère le 429 avec message inline amical (bulle cream-100, icône horloge), masque le bandeau rouge pour les rate limits, désactive l'input
- ✅ Tâche 4.2.5 : `BriefSummary.tsx` détecte le 409, affiche "Un brief a déjà été soumis pour [Entreprise]" en orange (#F97316), non intrusif

### Change Log
- 2026-03-04 : Implémentation partielle — tâches 4.2.1 à 4.2.4 complétées, tâches 4.2.3 (intégration) et 4.2.5 bloquées par dépendances Epic 3
- 2026-03-05 : Tâches 4.2.3 (intégration API brief) et 4.2.5 (message doublon BriefSummary) complétées — Story complète
- 2026-03-05 : Review Follow-ups (AI) — H2: supprimé `runtime = 'edge'` (Maps en mémoire non partagées entre edge workers) ; M1: détection 429 via status HTTP dans custom fetch au lieu de string matching ; M3: `storeBriefCredentials`/`verifyBriefCredentials` utilisent désormais `normalizeCompany` ; H1+M2: tests credentials ajoutés dans `brief-store.test.ts` — 99 tests passent

### File List
- `le-defi-des-5-jours/src/lib/rate-limit.ts` — NOUVEAU — Module rate limiting sliding window
- `le-defi-des-5-jours/src/lib/brief-store.ts` — MODIFIÉ — Ajout détection doublons (checkDuplicateSubmission, markCompanySubmitted, normalizeCompany)
- `le-defi-des-5-jours/src/app/api/chat/route.ts` — MODIFIÉ — Intégration rate limiting (extraction IP, vérification, headers)
- `le-defi-des-5-jours/src/components/Chat.tsx` — MODIFIÉ — Gestion 429 inline (rateLimitMessage via useMemo, désactivation input)
- `le-defi-des-5-jours/src/app/api/brief/route.ts` — MODIFIÉ — Intégration détection doublon (409 si duplicate, markCompanySubmitted après succès)
- `le-defi-des-5-jours/src/components/BriefSummary.tsx` — MODIFIÉ — Détection 409, message warning orange inline
- `le-defi-des-5-jours/src/app/api/brief/__tests__/route.test.ts` — NOUVEAU — Tests unitaires route API brief
- `le-defi-des-5-jours/src/lib/__tests__/rate-limit.test.ts` — NOUVEAU — Tests unitaires rate limiting
- `le-defi-des-5-jours/src/lib/__tests__/brief-store.test.ts` — NOUVEAU — Tests unitaires brief store (doublons)
