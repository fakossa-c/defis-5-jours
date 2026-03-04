# Story 3.2: Envoi Email Brief a Fakossa

Status: ready-for-dev

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

1. Creer le fichier `src/app/api/brief/route.ts`
2. Implementer le handler POST :
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import { sendBriefEmail } from '@/lib/send-brief';

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json();
       const { brief, metadata } = body;

       // Validation des champs requis
       if (!brief || !metadata) {
         return NextResponse.json(
           { success: false, error: 'Donnees manquantes', code: 'VALIDATION_ERROR', retryable: false },
           { status: 400 }
         );
       }

       await sendBriefEmail(brief, metadata);

       return NextResponse.json({ success: true });
     } catch (error) {
       console.error('Erreur envoi email brief:', error);
       return NextResponse.json(
         { success: false, error: 'Email non envoye', code: 'RESEND_ERROR', retryable: true },
         { status: 500 }
       );
     }
   }
   ```
3. Valider les champs obligatoires du brief et des metadonnees
4. Retourner les reponses conformes au format d'erreur du projet : `{ error: string, code: string, retryable: boolean }`

### Tache 2 : Creer le module d'envoi d'email (AC-3.2.2, AC-3.2.5)

1. Creer le fichier `src/lib/send-brief.ts`
2. Configurer le client Resend :
   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);
   ```
3. Implementer la fonction `sendBriefEmail` :
   ```typescript
   type BriefMetadata = {
     company: string;
     contact: string;
     sector: string;
     source: string;
     timestamp: string;
   };

   export async function sendBriefEmail(
     brief: BriefData,
     metadata: BriefMetadata
   ): Promise<void> {
     const html = formatBriefEmail(brief, metadata);

     await resend.emails.send({
       from: 'Le Defi 5 Jours <onboarding@resend.dev>',
       to: process.env.NOTIFICATION_EMAIL!,
       subject: `Nouveau Defi 5 Jours -- ${metadata.company || 'Prospect'}`,
       html,
     });
   }
   ```
4. L'adresse `from` utilise `onboarding@resend.dev` en developpement (domaine verifie par defaut de Resend) -- a remplacer par un domaine verifie en production

### Tache 3 : Creer le template HTML de l'email (AC-3.2.2, AC-3.2.5)

1. Implementer la fonction `formatBriefEmail` dans `src/lib/send-brief.ts`
2. Le template HTML doit utiliser des **styles inline** uniquement (les clients email ne supportent pas les classes CSS)
3. Structure du template :
   ```
   ┌─────────────────────────────────────┐
   │  NOUVEAU DEFI 5 JOURS              │
   │  [Entreprise]                       │
   ├─────────────────────────────────────┤
   │  METADONNEES                        │
   │  Contact : [contact]                │
   │  Secteur : [sector]                 │
   │  Source  : [source]                 │
   │  Date    : [timestamp formatee]     │
   ├─────────────────────────────────────┤
   │  BRIEF PROJET                       │
   │                                     │
   │  Probleme                           │
   │  [problem]                          │
   │                                     │
   │  Utilisateurs cibles                │
   │  [users]                            │
   │                                     │
   │  Solution actuelle                  │
   │  [current_solution]                 │
   │                                     │
   │  Resultat attendu                   │
   │  [desired_outcome]                  │
   │                                     │
   │  Perimetre 5 jours                  │
   │  [five_day_scope]                   │
   │                                     │
   │  Livrable suggere                   │
   │  [suggested_deliverable]            │
   │                                     │
   │  Notes                              │
   │  [notes]                            │
   ├─────────────────────────────────────┤
   │  → Repondre sous 24h               │
   └─────────────────────────────────────┘
   ```
4. Styles inline recommandes :
   ```typescript
   const styles = {
     container: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;',
     header: 'background-color: #2A2724; color: #FFFDF9; padding: 24px; border-radius: 12px 12px 0 0;',
     section: 'padding: 16px 24px; border-bottom: 1px solid #eee;',
     sectionTitle: 'font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px;',
     sectionContent: 'font-size: 15px; color: #2A2724; line-height: 1.6;',
     footer: 'background-color: #FFF8EF; padding: 20px 24px; border-radius: 0 0 12px 12px; text-align: center; font-weight: 600; color: #10B981;',
   };
   ```
5. L'email doit etre lisible dans tous les clients email courants (Gmail, Outlook, Apple Mail)
6. Ne pas inclure d'images externes ni de pieces jointes

### Tache 4 : Validation des donnees entrantes (AC-3.2.1)

1. Valider que le payload contient les champs `brief` et `metadata`
2. Valider les champs requis du brief :
   - `problem`, `users`, `desired_outcome` sont obligatoires
   - Les autres champs peuvent etre vides
3. Valider les champs requis des metadonnees :
   - `company` est obligatoire (utiliser une valeur par defaut "Prospect inconnu" si absent)
   - `timestamp` est obligatoire (generer cote serveur si absent)
4. Retourner une erreur 400 avec `code: 'VALIDATION_ERROR'` et `retryable: false` si la validation echoue

### Tache 5 : Configuration des variables d'environnement (AC-3.2.2)

1. Verifier que `.env.example` contient les variables :
   ```env
   RESEND_API_KEY=
   NOTIFICATION_EMAIL=
   ```
2. Si absentes, les ajouter (normalement deja presentes depuis la Story 1.1)
3. Documenter dans les Dev Notes :
   - `RESEND_API_KEY` : cle API obtenue sur https://resend.com/api-keys
   - `NOTIFICATION_EMAIL` : adresse email de Fakossa pour recevoir les briefs

### Tache 6 : Validation finale (toutes AC)

1. Tester `POST /api/brief` avec un payload valide -- reponse `{ success: true }`
2. Tester `POST /api/brief` avec un payload invalide -- reponse 400 avec erreur de validation
3. Verifier que l'email est recu dans la boite de Fakossa (test avec Resend en mode dev)
4. Verifier le contenu de l'email : toutes les sections presentes, lisibles, pas de JSON brut
5. Verifier le footer "Repondre sous 24h"
6. Simuler une erreur Resend -- verifier le `console.error` serveur et la reponse `RESEND_ERROR`
7. `pnpm tsc --noEmit` -- zero erreur TypeScript
8. `pnpm lint` -- aucune erreur ESLint

## Dev Notes

### Architecture

```
src/
├── app/
│   └── api/
│       └── brief/
│           └── route.ts      # POST handler - reception et envoi du brief
├── lib/
│   └── send-brief.ts         # Integration Resend, template HTML email
└── types/
    └── index.ts               # BriefData, ApiError (deja existant)
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

### Debug Log References

### Completion Notes List

### File List
