# Story 1.2: Parsing et Sanitization des Query Params URL

Status: done

## Story

As a prospect arrivant depuis le pitch,
I want que l'app lise automatiquement les paramètres de l'URL,
So that mon expérience est personnalisée sans que je n'aie rien à saisir.

## Acceptance Criteria

### AC-1.2.1 : Extraction et sanitization des paramètres URL valides

- **Given** un prospect arrive avec l'URL `?company=Otoqi&role=Product+Builder&sector=logistique&color=%234B5EAA&contact=Hermine&source=pitch`
- **When** la page est chargée
- **Then** les paramètres sont extraits, sanitizés et passés comme props aux composants enfants
- **And** les valeurs décodées sont : company="Otoqi", role="Product Builder", sector="logistique", color="#4B5EAA", contact="Hermine", source="pitch"

### AC-1.2.2 : Validation d'une couleur hexadécimale valide

- **Given** le paramètre `color` contient une valeur hexadécimale valide (ex : `#4B5EAA`)
- **When** la validation est exécutée
- **Then** la couleur passe la validation regex `/^#[0-9A-Fa-f]{6}$/`
- **And** la valeur est stockée pour injection dans les CSS custom properties

### AC-1.2.3 : Rejet silencieux d'une couleur invalide ou XSS

- **Given** le paramètre `color` contient une valeur invalide ou une tentative XSS (ex : `javascript:alert(1)`, `#ZZZ`, `<script>`)
- **When** la validation est exécutée
- **Then** la valeur est rejetée silencieusement (pas d'erreur visible pour l'utilisateur)
- **And** la couleur de fallback `#F96743` (coral) est utilisée

### AC-1.2.4 : Mode fallback sans paramètres

- **Given** aucun paramètre n'est présent dans l'URL
- **When** la page est chargée
- **Then** les valeurs par défaut sont appliquées : `company=null`, `color=#F96743`
- **And** l'application fonctionne en mode générique de fallback

### AC-1.2.5 : Protection contre les tentatives XSS dans company

- **Given** le paramètre `company` contient une tentative XSS (ex : `<script>alert('xss')</script>`, `Otoqi<img onerror=alert(1)>`)
- **When** la sanitization est exécutée
- **Then** les caractères dangereux sont échappés ou supprimés (FR29)
- **And** le contenu résultant est sûr pour l'affichage dans le DOM

## Tasks / Subtasks

### Tâche 1 : Créer le module de parsing et sanitization (AC-1.2.1, AC-1.2.5)
- [x] 1. Créer le fichier `src/lib/params.ts`
- [x] 2. Implémenter la fonction `parseProspectParams(searchParams: Record<string, string | string[] | undefined>): ProspectParams`
- [x] 3. Implémenter la fonction de sanitization `sanitizeString(value: string): string` :
   - Supprimer toutes les balises HTML (`<...>`)
   - Encoder les caractères spéciaux : `<`, `>`, `&`, `"`, `'`
   - Limiter la longueur à 200 caractères maximum
   - Retourner `null` si la chaîne résultante est vide
- [x] 4. Appliquer la sanitization à tous les paramètres texte (company, role, sector, contact, source)

### Tâche 2 : Implémenter la validation de couleur hexadécimale (AC-1.2.2, AC-1.2.3)
- [x] 1. Implémenter la fonction `validateHexColor(value: string): string` dans `src/lib/params.ts`
- [x] 2. Utiliser la regex `/^#[0-9A-Fa-f]{6}$/` pour la validation
- [x] 3. Retourner la couleur validée si elle passe, sinon retourner `#F96743`
- [x] 4. Gérer les cas limites : valeurs null, undefined, chaînes vides, encodages URL

### Tâche 3 : Implémenter les valeurs par défaut (AC-1.2.4)
- [x] 1. Définir les valeurs par défaut dans `params.ts` :
   - `company`: `null`
   - `role`: `null`
   - `sector`: `null`
   - `color`: `#F96743`
   - `contact`: `null`
   - `source`: `null`
- [x] 2. Retourner un objet `ProspectParams` complet avec les défauts appliqués

### Tâche 4 : Intégrer le parsing dans page.tsx Server Component (AC-1.2.1)
- [x] 1. Modifier `src/app/page.tsx` (Server Component) pour recevoir `searchParams`
- [x] 2. Appeler `parseProspectParams()` avec les searchParams
- [x] 3. Passer l'objet `ProspectParams` résultant comme props aux composants client enfants
- [x] 4. S'assurer que `page.tsx` reste un Server Component (pas de `"use client"`)

### Tâche 5 : Tests manuels (MVP — pas de tests automatisés)
- [x] 1. Build réussi — validation TypeScript et compilation sans erreur
- [x] 2. Lint réussi — aucune erreur ESLint
- [x] 3. Scénarios de test manuels documentés ci-dessous :
   - App sans params → fallback `company=null`, `color=#F96743`
   - App avec `?company=Otoqi&color=%234B5EAA` → extraction correcte
   - XSS dans company (`<script>alert('xss')</script>`) → balises supprimées, caractères encodés
   - Couleur invalide (`#ZZZ`, `javascript:alert(1)`) → fallback `#F96743`
   - Chaînes vides et valeurs null → retournent `null`
   - Caractères URL-encodés (`+`, `%20`, `%23`) → décodés par Next.js avant parsing

## Dev Notes

### Architecture du module params.ts

```typescript
// src/lib/params.ts
import type { ProspectParams } from '@/types';

const DEFAULT_ACCENT_COLOR = '#F96743';
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const MAX_PARAM_LENGTH = 200;

/**
 * Sanitize une chaîne en supprimant les balises HTML
 * et en encodant les caractères spéciaux.
 */
export function sanitizeString(value: string | undefined | null): string | undefined {
  // 1. Retourner undefined si null/undefined/vide
  // 2. Supprimer toutes les balises HTML
  // 3. Encoder < > & " '
  // 4. Tronquer à MAX_PARAM_LENGTH
  // 5. Retourner undefined si résultat vide
}

/**
 * Valide une couleur hexadécimale.
 * Retourne la couleur si valide, sinon DEFAULT_ACCENT_COLOR.
 */
export function validateHexColor(value: string | undefined | null): string {
  // Validation avec HEX_COLOR_REGEX
}

/**
 * Parse et sanitize les searchParams de l'URL.
 */
export function parseProspectParams(
  searchParams: Record<string, string | string[] | undefined>
): ProspectParams {
  // 1. Extraire chaque param en prenant la première valeur si tableau
  // 2. Sanitizer les chaînes
  // 3. Valider la couleur
  // 4. Retourner l'objet ProspectParams complet
}
```

### Intégration dans page.tsx

```typescript
// src/app/page.tsx (Server Component)
import { parseProspectParams } from '@/lib/params';
import type { ProspectParams } from '@/types';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = parseProspectParams(await searchParams);
  // Passer params aux composants client
}
```

### Contraintes de sécurité
- **JAMAIS** utiliser `dangerouslySetInnerHTML` pour afficher les valeurs des paramètres
- Toujours sanitizer avant de passer aux composants
- La sanitization s'applique côté serveur (Server Component) avant le rendu

### Utilisation du type ProspectParams
- Importer depuis `@/types`
- Les champs optionnels (`company`, `role`, etc.) sont `string | undefined`
- Le champ `color` est toujours une `string` (fallback garanti)

### Project Structure Notes

```
src/
├── lib/
│   └── params.ts                 # parseProspectParams(), sanitizeString(), validateHexColor()
├── app/
│   └── page.tsx                  # Server Component, parse searchParams, passe props
└── types/
    └── index.ts                  # ProspectParams (défini dans Story 1.1)
```

#### Fichiers créés dans cette story
- `src/lib/params.ts` — module de parsing et sanitization

#### Fichiers modifiés dans cette story
- `src/app/page.tsx` — ajout du parsing des searchParams

### References

- Architecture projet : Epic 1, Story 1.2
- Dépendance : Story 1.1 (types `ProspectParams`)
- Next.js App Router searchParams : https://nextjs.org/docs/app/api-reference/file-conventions/page
- Exigence FR29 : protection XSS sur les paramètres utilisateur
- Exigence NFR : sanitization côté serveur

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- Type `ProspectParams` aligné avec project-context.md : champs optionnels passés de `string | undefined` à `string | null`, `color` rendu non-optionnel (fallback garanti)
- Tâche 5 adaptée : project-context spécifie "Pas de tests automatisés en MVP", remplacé par validation build/lint + scénarios manuels documentés

### Completion Notes List
- Créé `src/lib/params.ts` avec 3 fonctions exportées : `sanitizeString()`, `validateHexColor()`, `parseProspectParams()`
- Sanitization XSS : suppression balises HTML via regex, encodage des 5 caractères spéciaux (`<>&"'`), troncature à 200 chars
- Validation couleur : regex `/^#[0-9A-Fa-f]{6}$/`, fallback `#F96743`
- Modifié `src/app/page.tsx` : Server Component async, reçoit `searchParams` Promise, appelle `parseProspectParams()`
- Aligné type `ProspectParams` dans `src/types/index.ts` avec project-context.md (`string | null` + `color: string` non-optionnel)
- Build TypeScript et ESLint passent sans erreur

### Change Log
- 2026-03-04 : Implémentation complète Story 1.2 — parsing, sanitization et validation des query params URL
- 2026-03-04 : [Code Review] Corrections : (H1) suppression double-encodage dans sanitizeString — valeurs affichées en JSX, React gère l'échappement ; (H2) ajout utils.ts au File List ; (M1) suppression bloc `<pre>` debug dans page.tsx ; (M2) ajout commentaire ensureContrast dans page.tsx

### File List
- `le-defi-des-5-jours/src/lib/params.ts` — CRÉÉ — module de parsing et sanitization
- `le-defi-des-5-jours/src/app/page.tsx` — MODIFIÉ — intégration du parsing searchParams
- `le-defi-des-5-jours/src/types/index.ts` — MODIFIÉ — alignement type ProspectParams avec project-context
- `le-defi-des-5-jours/src/lib/utils.ts` — CRÉÉ — utilitaires contraste couleur (ensureContrast, generateAccentLight, generateAccentDark)
