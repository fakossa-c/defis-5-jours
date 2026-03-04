# Story 4.2: Rate Limiting & Protection Anti-Abus

Status: ready-for-dev

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
- [ ] Creer `src/lib/rate-limit.ts`
- [ ] Definir la constante `MAX_CONVERSATIONS_PER_HOUR = 10`
- [ ] Definir la constante `WINDOW_MS = 3_600_000` (1 heure en millisecondes)
- [ ] Implementer `requestLog: Map<string, number[]>` — cle = IP, valeur = tableau de timestamps
- [ ] Exporter `checkRateLimit(ip: string): { allowed: boolean, remaining: number, resetAt: number }`
  - Recuperer les timestamps pour cette IP
  - Filtrer pour ne garder que ceux dans la fenetre (Date.now() - WINDOW_MS)
  - Mettre a jour la Map avec les timestamps filtres
  - Si nombre < MAX : ajouter le timestamp actuel, retourner `{ allowed: true, remaining: MAX - count - 1, resetAt }`
  - Si nombre >= MAX : retourner `{ allowed: false, remaining: 0, resetAt: oldestTimestamp + WINDOW_MS }`
- [ ] Exporter `getRateLimitHeaders(result): Record<string, string>` pour les headers de reponse (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)

### Tache 4.2.2 — Integrer le rate limiting dans /api/chat
- [ ] Modifier `src/app/api/chat/route.ts`
- [ ] Au debut du handler POST, extraire l'IP : `request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'`
- [ ] Appeler `checkRateLimit(ip)`
- [ ] Si `allowed === false` : retourner `NextResponse.json({ error: "Beaucoup de demandes, revenez dans quelques minutes", code: "RATE_LIMIT", retryable: false }, { status: 429 })` avec les headers rate limit
- [ ] Si `allowed === true` : continuer le traitement normal (streamText)
- [ ] Ajouter les headers rate limit a toutes les reponses (200 et 429)

### Tache 4.2.3 — Creer la verification de doublon dans /api/brief
- [ ] Modifier ou creer le module de stockage des briefs (ex: `src/lib/brief-store.ts`)
- [ ] Implementer `submittedCompanies: Map<string, boolean>` — cle = nom societe normalise (lowercase, trim)
- [ ] Exporter `checkDuplicateSubmission(company: string): boolean` — retourne true si deja soumis
- [ ] Exporter `markCompanySubmitted(company: string): void` — enregistre la soumission
- [ ] Integrer dans `src/app/api/brief/route.ts` :
  - Avant le traitement, appeler `checkDuplicateSubmission(company)`
  - Si doublon : retourner 409 `{ error: "Un brief a deja ete soumis pour [Entreprise]", code: "DUPLICATE_SUBMISSION", retryable: false }`
  - Si nouveau : appeler `markCompanySubmitted(company)` apres traitement reussi

### Tache 4.2.4 — Afficher le message de rate limit dans Chat.tsx
- [ ] Modifier `src/components/Chat.tsx`
- [ ] Detecter les reponses avec statut 429 dans le handler d'erreur de `useChat()`
- [ ] Afficher un message inline amical dans la zone de chat : "Beaucoup de demandes, revenez dans quelques minutes"
- [ ] Style : bulle systeme centree, bg `cream-100`, texte `charcoal-900`, icone horloge optionnelle
- [ ] Ne pas afficher le bandeau d'erreur rouge pour les 429 (message inline a la place)
- [ ] Desactiver l'input temporairement quand rate limited

### Tache 4.2.5 — Afficher le message de doublon dans BriefSummary.tsx
- [ ] Modifier `src/components/BriefSummary.tsx` (ou le composant de soumission de brief)
- [ ] Detecter les reponses avec statut 409 lors de la soumission
- [ ] Afficher le message "Un brief a deja ete soumis pour [Entreprise]" inline
- [ ] Style : texte orange/warning, pas de bandeau d'erreur intrusif
- [ ] Desactiver le bouton de soumission apres detection de doublon

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

### Debug Log References

### Completion Notes List

### File List
