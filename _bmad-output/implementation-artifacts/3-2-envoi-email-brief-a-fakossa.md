# Story 3.2: Envoi Email Brief a Fakossa

Status: done

## Story

As Fakossa (operateur),
I want recevoir un email structure avec le brief complet,
So that je puisse decider go/no-go sans call exploratoire.

## Acceptance Criteria

### AC-3.2.1 : Appel API declenche par le composant BriefSummary

- **Given** le brief JSON est pret et le composant BriefSummary est monte
- **When** le composant declenche l'envoi
- **Then** un `POST /api/brief` est effectue avec le payload :
  ```json
  {
    "brief": { /* BriefData completes */ },
    "metadata": {
      "company": "string",
      "contact": "string",
      "sector": "string",
      "source": "string",
      "timestamp": "ISO 8601"
    }
  }
  ```

### AC-3.2.2 : Email HTML envoye via Resend

- **Given** la route `/api/brief` recoit un brief valide
- **When** le traitement est effectue
- **Then** un email HTML est envoye a `NOTIFICATION_EMAIL` via Resend avec :
  - Sujet : "Nouveau Defi 5 Jours -- [Entreprise]"
  - Metadonnees (entreprise, contact, secteur, source, timestamp)
  - Sections du brief structurees et lisibles
  - Footer : "Repondre sous 24h"
- **And** l'envoi est effectue en moins de 30 secondes (NFR3)

### AC-3.2.3 : Reponse succes

- **Given** l'email est envoye avec succes
- **When** la route retourne la reponse
- **Then** le corps de la reponse est `{ success: true }`
- **And** aucun feedback supplementaire n'est affiche cote client (UX optimiste)

### AC-3.2.4 : Gestion des erreurs Resend

- **Given** l'envoi de l'email echoue (erreur Resend)
- **When** la route traite l'erreur
- **Then** l'erreur est loguee cote serveur via `console.error`
- **And** la reponse retournee est :
  ```json
  {
    "success": false,
    "error": "Email non envoye",
    "code": "RESEND_ERROR",
    "retryable": true
  }
  ```
- **And** le recapitulatif cote client reste visible (pas de blocage UX)

### AC-3.2.5 : Email lisible et suffisant pour decision go/no-go

- **Given** Fakossa recoit l'email dans sa boite de reception
- **When** il lit l'email
- **Then** toutes les informations sont presentes et lisibles sans piece jointe
- **And** les informations sont suffisantes pour prendre une decision go/no-go (FR23)

## Tasks / Subtasks

### Tache 1 : Creer la route API /api/brief (AC-3.2.1, AC-3.2.3, AC-3.2.4)

- [x] 1. Creer le fichier `src/app/api/brief/route.ts`
- [x] 2. Implementer le handler POST
- [x] 3. Valider les champs obligatoires du brief et des metadonnees
- [x] 4. Retourner les reponses conformes au format d'erreur du projet

### Tache 2 : Creer le module d'envoi d'email (AC-3.2.2, AC-3.2.5)

- [x] 1. Creer le fichier `src/lib/send-brief.ts`
- [x] 2. Configurer le client Resend
- [x] 3. Implementer la fonction `sendBriefEmail`
- [x] 4. Adresse `from` : `onboarding@resend.dev` en developpement

### Tache 3 : Creer le template HTML de l'email (AC-3.2.2, AC-3.2.5)

- [x] 1. Implementer la fonction `formatBriefEmail` dans `src/lib/send-brief.ts`
- [x] 2. Styles inline uniquement
- [x] 3. Structure complète avec header, métadonnées, sections brief, footer
- [x] 4. Styles inline selon design system (couleurs charcoal, cream, emerald)
- [x] 5. Compatible tous clients email courants
- [x] 6. Pas d'images externes ni de pieces jointes

### Tache 4 : Validation des donnees entrantes (AC-3.2.1)

- [x] 1. Valider que le payload contient `brief` et `metadata`
- [x] 2. Valider les champs requis du brief (`problem`, `users`, `desired_outcome`)
- [x] 3. Valider les champs requis des metadonnees (company par defaut "Prospect inconnu", timestamp auto-généré si absent)
- [x] 4. Retourner 400 avec `VALIDATION_ERROR` si validation echoue

### Tache 5 : Configuration des variables d'environnement (AC-3.2.2)

- [x] 1. Verifier que `.env.example` contient `RESEND_API_KEY` et `NOTIFICATION_EMAIL` (deja present)
- [x] 2. Variables presentes depuis la Story 1.1 -- aucune modification necessaire

### Tache 6 : Validation finale (toutes AC)

- [x] 1. Tests `POST /api/brief` payload valide -- `{ success: true }` ✅
- [x] 2. Tests `POST /api/brief` payload invalide -- 400 VALIDATION_ERROR ✅
- [x] 3. Tests envoi email via Resend (mock) ✅
- [x] 4. Contenu email : toutes les sections presentes, lisibles, pas de JSON brut ✅
- [x] 5. Footer "Repondre sous 24h" ✅
- [x] 6. Tests erreur Resend -- `console.error` serveur + reponse `RESEND_ERROR` ✅
- [x] 7. `pnpm tsc --noEmit` -- zero erreur TypeScript ✅
- [x] 8. `pnpm lint` -- aucune erreur ESLint ✅

## Dev Notes

### Architecture

```
src/
├── app/
│   └── api/
│       └── brief/
│           ├── route.ts              # POST handler - reception et envoi du brief
│           └── __tests__/
│               └── route.test.ts    # Tests de la route API
├── lib/
│   ├── send-brief.ts                # Integration Resend, template HTML email
│   └── __tests__/
│       └── send-brief.test.ts      # Tests formatBriefEmail + sendBriefEmail
└── types/
    └── index.ts                     # BriefData, ApiError (deja existant)
```

### Route API

- **Fichier** : `src/app/api/brief/route.ts`
- **Methode** : POST uniquement
- **Runtime** : Compatible Edge Runtime (le SDK Resend fonctionne sur Edge)
- **Payload attendu** :
  ```typescript
  {
    brief: BriefData;
    metadata: {
      company: string;
      contact: string;
      sector: string;
      source: string;
      timestamp: string;
    };
  }
  ```
- **Reponses** :
  - Succes : `200 { success: true }`
  - Erreur validation : `400 { success: false, error: "...", code: "VALIDATION_ERROR", retryable: false }`
  - Erreur Resend : `500 { success: false, error: "Email non envoye", code: "RESEND_ERROR", retryable: true }`

### Integration Resend

- **Fichier** : `src/lib/send-brief.ts`
- **Package** : `resend` (version 6.9.3, deja installe via Story 1.1)
- **Configuration** :
  ```typescript
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  ```
- **Adresse from** :
  - Developpement : `Le Defi 5 Jours <onboarding@resend.dev>` (domaine par defaut de Resend)
  - Production : `Le Defi 5 Jours <noreply@votre-domaine.com>` (domaine verifie requis)
- **Adresse to** : `process.env.NOTIFICATION_EMAIL`

### Template email HTML

- Utiliser **uniquement des styles inline** (les clients email ignorent les balises `<style>` et les classes CSS)
- Structure simple : table-based layout pour la compatibilite
- Couleurs du design system :
  - Header : fond charcoal-900 (`#2A2724`), texte cream-50 (`#FFFDF9`)
  - Sections : fond blanc, texte charcoal-900
  - Footer : fond cream-100 (`#FFF8EF`), texte emerald-500 (`#10B981`)
- Police : system font stack (pas de Google Fonts dans les emails)
- Pas d'images externes, pas de pieces jointes, pas de JavaScript

### Mapping des sections dans l'email

| Champ BriefData         | Libelle dans l'email    |
|-------------------------|-------------------------|
| `problem`               | Probleme                |
| `users`                 | Utilisateurs cibles     |
| `current_solution`      | Solution actuelle       |
| `desired_outcome`       | Resultat attendu        |
| `five_day_scope`        | Perimetre 5 jours       |
| `suggested_deliverable` | Livrable suggere        |
| `notes`                 | Notes                   |

### Variables d'environnement requises

| Variable              | Description                                    | Exemple                        |
|-----------------------|------------------------------------------------|--------------------------------|
| `RESEND_API_KEY`      | Cle API Resend (https://resend.com/api-keys)  | `re_xxxxxxxxxxxxx`             |
| `NOTIFICATION_EMAIL`  | Email de Fakossa pour recevoir les briefs      | `fakossa@exemple.com`          |

### Format d'erreur du projet

Conforme a la specification globale :
```typescript
type ApiError = {
  error: string;
  code: string;
  retryable: boolean;
};
```

### UX optimiste

- Le composant BriefSummary (Story 3.1) affiche le recapitulatif immediatement
- L'appel `POST /api/brief` est effectue en arriere-plan
- En cas d'echec, le recapitulatif reste visible -- l'utilisateur n'est pas bloque
- Aucun indicateur de chargement ni message d'erreur n'est affiche cote client

### Performance

- L'envoi de l'email doit etre effectue en moins de 30 secondes (NFR3)
- Resend repond generalement en moins de 2 secondes
- Pas de retry automatique cote serveur dans le MVP

### Securite

- Les variables d'environnement `RESEND_API_KEY` et `NOTIFICATION_EMAIL` ne sont jamais exposees cote client
- La route API est accessible uniquement en POST
- Les donnees du brief sont envoyees en HTTPS (garanti par Vercel en production)
- Echapper les caracteres HTML dans le contenu du brief pour eviter l'injection XSS dans l'email

### Dependances

- **Story 1.1** : Types BriefData et ApiError, package Resend installe
- **Story 3.1** : Le composant BriefSummary declenche l'appel a cette route API
- **Epic 2** : La conversation IA produit le brief JSON qui est envoye ici

### Anti-patterns a eviter

- Pas de `dangerouslySetInnerHTML` dans le template email (construire le HTML avec des template literals)
- Pas de classes CSS dans l'email (styles inline uniquement)
- Pas de retry automatique complexe (hors scope MVP)
- Pas de base de donnees -- l'email est la seule persistance
- Pas de file d'attente (queue) -- envoi synchrone dans le handler

### References

- Documentation Resend : https://resend.com/docs
- Documentation Next.js Route Handlers : https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Guide emails HTML : https://www.caniemail.com/
- Type BriefData : `src/types/index.ts` (Story 1.1)
- Composant appelant : `src/components/BriefSummary.tsx` (Story 3.1)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Fix mock Resend : `vi.hoisted()` requis pour les variables utilisées dans les factories `vi.mock` (vitest hoist les appels avant l'initialisation des variables `const`)

### Completion Notes List

- Route `POST /api/brief` implementee avec validation des champs obligatoires (`problem`, `users`, `desired_outcome`)
- Valeurs par defaut : `company` → "Prospect inconnu", `timestamp` → `new Date().toISOString()`
- Module `send-brief.ts` : client Resend instancie au niveau module, `sendBriefEmail` + `formatBriefEmail` (exportee pour tests)
- Template HTML : styles inline, table-based, protection XSS via `escapeHtml`, sections optionnelles omises si vides
- 26 tests nouveaux (16 lib + 10 route), 69 tests total, 0 regression
- TypeScript : 0 erreur. ESLint : 0 erreur.

### File List

- `src/app/api/brief/route.ts` (créé)
- `src/lib/send-brief.ts` (créé)
- `src/app/api/brief/__tests__/route.test.ts` (créé)
- `src/lib/__tests__/send-brief.test.ts` (créé)
- `src/types/index.ts` (modifié — ajout BriefMetadata)
- `src/components/BriefSummary.tsx` (créé par Story 3.1 — implémente AC-3.2.1)

## Senior Developer Review (AI)

**Review Date:** 2026-03-05
**Reviewer:** claude-sonnet-4-6 (code-review workflow)
**Outcome:** Changes Requested → Fixed

### Action Items

- [x] [High] `BriefSummary.tsx:2,33` — useState non importé / useRef inutilisé → déjà corrigé par Story 3.1 (version actualisée utilise useRef correctement)
- [x] [High] `route.ts:43` — JSON parse errors retournaient RESEND_ERROR au lieu de VALIDATION_ERROR → try/catch séparé pour request.json()
- [x] [Medium] `BriefMetadata` dupliqué dans route.ts et send-brief.ts → centralisé dans types/index.ts
- [x] [Medium] `NOTIFICATION_EMAIL!` sans garde → garde explicite ajoutée dans sendBriefEmail
- [x] [Medium] BriefSummary.tsx absent du File List → documenté
- [x] [Medium] Test "sections vides" testait valeur mock et non le label de section → assertion renforcée

## Change Log

- 2026-03-04 : Implémentation Story 3.2 — Route POST /api/brief + module send-brief avec template HTML email Resend. 26 nouveaux tests. (claude-sonnet-4-6)
- 2026-03-05 : Code review — 2 High + 4 Medium corrigés. BriefMetadata centralisé dans types/index.ts, JSON parse séparé, garde NOTIFICATION_EMAIL, tests renforcés. 71 tests total. (claude-sonnet-4-6)
