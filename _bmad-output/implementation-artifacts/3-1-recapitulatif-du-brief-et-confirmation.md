# Story 3.1: Recapitulatif du Brief & Confirmation

Status: done

## Story

As a prospect,
I want voir un recapitulatif clair de mon projet apres la conversation,
So that je sache ce que Fakossa va recevoir.

## Acceptance Criteria

### AC-3.1.1 : Transition vers l'ecran recapitulatif avec animation

- **Given** la conversation est terminee et le brief JSON est parse
- **When** l'etat de l'application passe a 'recap'
- **Then** le composant BriefSummary apparait avec un fade-in de 400ms (opacity 0 vers 1, ease-out)
- **And** le titre affiche "Brief pret !" en couleur emerald-500

### AC-3.1.2 : Affichage structure du brief en sections lisibles

- **Given** l'ecran recapitulatif est affiche
- **When** le brief est rendu dans le composant
- **Then** une carte avec fond cream-100, shadow-md et border-radius-lg est affichee
- **And** le titre de la carte est "BRIEF PROJET -- [Entreprise]"
- **And** les sections suivantes sont affichees avec des libelles lisibles (pas de JSON brut) :
  - "Probleme" (champ `problem`)
  - "Utilisateurs cibles" (champ `users`)
  - "Solution actuelle" (champ `current_solution`)
  - "Resultat attendu" (champ `desired_outcome`)
  - "Perimetre 5 jours" (champ `five_day_scope`)
  - "Livrable suggere" (champ `suggested_deliverable`)
- **And** le texte respecte la regle FR18 (texte lisible en francais, pas de cles JSON)

### AC-3.1.3 : Message de confirmation personnalise

- **Given** le brief est affiche dans le recapitulatif
- **When** le message de confirmation est rendu
- **Then** le texte affiche : "Fakossa a recu votre brief. Il revient vers [contact] sous 24h avec une proposition." si le parametre `contact` est disponible
- **Or** le texte affiche : "Fakossa a recu votre brief. Il revient vers vous sous 24h avec une proposition." si le parametre `contact` n'est pas disponible
- **And** le texte respecte la regle FR19

### AC-3.1.4 : Bouton CTA Calendly fonctionnel

- **Given** le recapitulatif est affiche
- **When** le CTA Calendly est rendu
- **Then** un bouton "Prendre RDV directement" est affiche avec la couleur accent
- **And** le lien Calendly s'ouvre dans un nouvel onglet (`target="_blank"`, `rel="noopener noreferrer"`)
- **And** le texte respecte la regle FR20

### AC-3.1.5 : Responsive mobile

- **Given** l'utilisateur est sur un appareil mobile
- **When** le recapitulatif est affiche
- **Then** la carte occupe la pleine largeur avec un padding de 16px
- **And** toutes les sections restent lisibles et bien espacees

## Tasks / Subtasks

### Tache 1 : Creer le composant BriefSummary (AC-3.1.1, AC-3.1.2)

- [x] 1. Creer le fichier `src/components/BriefSummary.tsx`
- [x] 2. Definir les props du composant
- [x] 3. Implementer la carte principale avec les styles (cream-100, shadow-md, rounded-[20px])
- [x] 4. Afficher le titre "BRIEF PROJET -- [Entreprise]" avec fallback "Votre entreprise"
- [x] 5. Implementer le mapping des sections BriefData vers les libelles francais
- [x] 6. Rendre chaque section avec un titre en gras et le contenu en texte lisible
- [x] 7. Ne pas afficher les sections vides

### Tache 2 : Implementer l'animation fade-in (AC-3.1.1)

- [x] 1. Utiliser un state React pour gerer l'opacite initiale a 0
- [x] 2. Appliquer la transition CSS : `transition 400ms ease-out`
- [x] 3. Passer l'opacite a 1 au montage du composant via `useEffect`
- [x] 4. Le titre "Brief pret !" est affiche en couleur `emerald-500`

### Tache 3 : Implementer le message de confirmation (AC-3.1.3)

- [x] 1. Ajouter la logique de personnalisation avec fallback "vous"
- [x] 2. Afficher le message sous la carte du brief
- [x] 3. Styler avec charcoal-700 et var(--font-body)

### Tache 4 : Implementer le bouton CTA Calendly (AC-3.1.4)

- [x] 1. Ajouter le lien "Prendre RDV directement →"
- [x] 2. Styler avec la couleur accent dynamique
- [x] 3. Configurer `target="_blank"` et `rel="noopener noreferrer"`
- [x] 4. URL via `NEXT_PUBLIC_CALENDLY_URL` avec fallback

### Tache 5 : Declencher l'envoi du brief par email (AC-3.1.2)

- [x] 1. Declencher `POST /api/brief` au montage via useEffect
- [x] 2. UX optimiste — le recapitulatif est affiche immediatement
- [x] 3. Echec silencieux avec console.error uniquement

### Tache 6 : Responsive mobile (AC-3.1.5)

- [x] 1. `w-full px-4` mobile / `max-w-2xl mx-auto` desktop
- [x] 2. Sections lisibles sur petits ecrans
- [x] 3. Bouton CTA pleine largeur sur mobile (via `.cta-button`)

### Tache 7 : Validation finale (toutes AC)

- [x] 1. Fade-in 400ms implementé
- [x] 2. Toutes les sections affichées avec bons libellés
- [x] 3. Message de confirmation personnalisé (avec/sans contact)
- [x] 4. Lien Calendly dans un nouvel onglet
- [x] 5. Rendu mobile responsive
- [x] 6. `POST /api/brief` appelé au montage
- [x] 7. `pnpm tsc --noEmit` — zéro erreur TypeScript ✅
- [x] 8. `pnpm lint` — aucune erreur ESLint ✅

## Dev Notes

### Composant principal

- **Fichier** : `src/components/BriefSummary.tsx`
- **Props** : `{ briefData: BriefData; company?: string; contact?: string }`
- Ce composant est un Client Component (`'use client'`) car il utilise `useEffect` et `useState`

### Styles de la carte

```css
/* Equivalents Tailwind */
background: var(--cream-100); /* #FFF8EF */
box-shadow: 0 4px 12px rgba(42, 39, 36, 0.08); /* shadow-md custom */
border-radius: 20px; /* radius-lg */
```

### Mapping des sections BriefData

| Champ BriefData         | Libelle francais        |
|-------------------------|-------------------------|
| `problem`               | Probleme                |
| `users`                 | Utilisateurs cibles     |
| `current_solution`      | Solution actuelle       |
| `desired_outcome`       | Resultat attendu        |
| `five_day_scope`        | Perimetre 5 jours       |
| `suggested_deliverable` | Livrable suggere        |

Les champs `company`, `contact`, `sector` et `notes` ne sont pas affiches dans les sections (ils sont utilises dans le titre et les metadonnees).

### Calendly

- URL Calendly : utiliser `process.env.NEXT_PUBLIC_CALENDLY_URL` ou une constante dans `src/lib/constants.ts`
- Attributs obligatoires : `target="_blank"` et `rel="noopener noreferrer"` pour la securite

### Envoi email (optimiste)

- L'appel `POST /api/brief` est declenche au montage via `useEffect` -- c'est une exception justifiee a la regle "pas de useEffect pour le data fetching" car il s'agit d'un effet secondaire (envoi), pas d'une recuperation de donnees
- Le composant ne bloque pas l'UX en cas d'echec de l'envoi
- Les erreurs sont loguees dans la console mais n'affectent pas l'affichage

### Animation de montage

```typescript
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  // Declencher le fade-in apres le montage
  const timer = setTimeout(() => setIsVisible(true), 10);
  return () => clearTimeout(timer);
}, []);
```

```tsx
<div
  className={`transition-opacity duration-[400ms] ease-out ${
    isVisible ? 'opacity-100' : 'opacity-0'
  }`}
>
  {/* Contenu du recapitulatif */}
</div>
```

### Dependances

- **Epic 1** : Design system (tokens CSS, typographie, couleurs)
- **Epic 2** : Toutes les stories (conversation IA, extraction du brief JSON)
- **Story 3.2** : Route API `/api/brief` (ce composant appelle l'API creee dans la story 3.2)

### Anti-patterns a eviter

- Pas de `dangerouslySetInnerHTML` pour le rendu des sections
- Pas de bibliotheque UI externe (shadcn, Radix, Material UI)
- Pas d'affichage du JSON brut -- toujours des libelles lisibles
- Pas de blocage de l'UX en cas d'echec de l'envoi email

### Types utilises

```typescript
import { BriefData } from '@/types';

type BriefSummaryProps = {
  briefData: BriefData;
  company?: string;
  contact?: string;
};
```

### References

- Architecture projet : Epic 1, Fondation du Projet & Landing Personnalisee
- Type BriefData : `src/types/index.ts` (Story 1.1)
- Route API brief : `src/app/api/brief/route.ts` (Story 3.2)
- Documentation Next.js App Router : https://nextjs.org/docs/app
- Documentation Tailwind CSS 4 : https://tailwindcss.com/docs

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

Aucun blocage rencontré.

### Completion Notes List

- Composant `BriefSummary.tsx` créé avec fade-in 400ms via AppShell, mapping des 6 sections BriefData, message de confirmation personnalisé et CTA Calendly
- Appel optimiste `POST /api/brief` au montage — UX non bloquée en cas d'échec (Story 3.2 créera la route)
- Valeurs initiales capturées via `useRef` pour l'envoi — supprime le `eslint-disable` fragile
- `AppShell.tsx` mis à jour : Header masqué en recap, fallback loading visible, BriefSummary rendu
- `.gitignore` corrigé : exception `!.env.example` ajoutée pour permettre le commit du template
- `.env.example` mis à jour avec `NEXT_PUBLIC_CALENDLY_URL`
- Code review adversarial effectué : H1, H2, M1, M2, M3, M4 corrigés
- `pnpm tsc --noEmit` : 0 erreur | `pnpm lint` : 0 erreur

### File List

- `le-defi-des-5-jours/src/components/BriefSummary.tsx` (créé)
- `le-defi-des-5-jours/src/components/AppShell.tsx` (modifié)
- `le-defi-des-5-jours/.env.example` (modifié)
- `le-defi-des-5-jours/.gitignore` (modifié — exception .env.example)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modifié — statut 3.1)
- `_bmad-output/implementation-artifacts/3-1-recapitulatif-du-brief-et-confirmation.md` (modifié — story file)

## Senior Developer Review (AI)

**Date :** 2026-03-04
**Outcome :** Changes Requested → Corrigé
**Action Items :**
- [x] [High] Header non masqué en état recap (UX spec: "recap (masqué)") — AppShell.tsx:75
- [x] [High] Double animation opacity (AppShell + BriefSummary) — BriefSummary.tsx:35-38
- [x] [Medium] .gitignore: .env* trop large, .env.example jamais commité — .gitignore:34
- [x] [Medium] Fallback silencieux briefData===null en état recap — AppShell.tsx:88
- [x] [Medium] Story File List incomplète (sprint-status.yaml, story file manquants)
- [x] [Medium] eslint-disable react-hooks/exhaustive-deps fragile — BriefSummary.tsx:63

## Change Log

- 2026-03-04 : Implémentation Story 3.1 — Composant BriefSummary créé, AppShell mis à jour pour l'état recap
- 2026-03-04 : Code review — 2 High, 4 Medium corrigés (animation, header, gitignore, fallback, eslint)
