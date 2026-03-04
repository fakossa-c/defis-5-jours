# Story 1.4: Landing Personnalisée & CTA

Status: done

## Story

As a prospect,
I want voir une page d'accueil personnalisée,
So that je comprenne immédiatement ce que je peux obtenir.

## Acceptance Criteria

### AC-1.4.1 : Affichage personnalisé avec paramètres company et role

- **Given** l'URL contient `company=Otoqi` et `role=Product+Builder`
- **When** la page d'accueil est rendue
- **Then** le titre affiche "LE DEFI 5 JOURS" suivi de " x Otoqi" en couleur accent
- **And** un bloc contextuel affiche "Vous cherchiez un(e) Product Builder..."
- **And** 3 étapes sont présentées pour expliquer le processus
- **And** un bouton CTA "Commencer ->" est visible
- **And** la mention "Zéro engagement. Gratuit." est affichée sous le CTA

### AC-1.4.2 : Mode générique sans paramètres

- **Given** aucun paramètre n'est présent dans l'URL
- **When** la page d'accueil est rendue
- **Then** le titre affiche "LE DEFI 5 JOURS" sans " x [Entreprise]"
- **And** le bloc contextuel de rôle n'est pas affiché
- **And** la couleur accent coral `#F96743` est utilisée
- **And** le bouton CTA reste visible et fonctionnel

### AC-1.4.3 : Responsive mobile < 640px

- **Given** la page est affichée sur un écran de largeur inférieure à 640px
- **When** la page est rendue
- **Then** le padding est de 16px
- **And** le titre est en 28px
- **And** le bouton CTA occupe toute la largeur
- **And** les zones tactiles font au minimum 44x44px

### AC-1.4.4 : Transition landing vers chat au clic sur CTA

- **Given** le prospect est sur la page d'accueil (state = `landing`)
- **When** il clique sur le bouton "Commencer ->"
- **Then** l'état passe de `landing` à `chat`
- **And** une transition en fondu (fade-out / fade-in) de 400ms ease-out est jouée

### AC-1.4.5 : Avatar Fakossa en haut à gauche

- **Given** la page d'accueil est rendue
- **When** le header est affiché
- **Then** un avatar de 32px est visible en haut à gauche
- **And** l'image est chargée depuis `public/avatar-fakossa.webp`

## Tasks / Subtasks

### Tâche 1 : Créer le composant Header.tsx (AC-1.4.5)
- [x] 1. Créer `src/components/Header.tsx`
- [x] 2. Afficher l'avatar Fakossa (32px, rond) en haut à gauche
- [x] 3. Utiliser `next/image` pour le chargement optimisé
- [x] 4. Prévoir un placeholder si l'image n'existe pas encore (`public/avatar-fakossa.webp`)
- [x] 5. Appliquer un padding cohérent avec les tokens de design

### Tâche 2 : Créer le composant Landing.tsx (AC-1.4.1, AC-1.4.2)
- [x] 1. Créer `src/components/Landing.tsx` avec les props : `params: ProspectParams`, `onStart: () => void`
- [x] 2. Implémenter la section titre :
   - "LE DEFI 5 JOURS" en style display
   - Si `company` est défini : ajouter " x {company}" en couleur `var(--accent)`
- [x] 3. Implémenter le bloc contextuel conditionnel :
   - Si `role` est défini : afficher "Vous cherchiez un(e) {role}..."
   - Si `role` est absent : ne pas afficher le bloc
- [x] 4. Implémenter les 3 étapes du processus (contenu statique décrivant le défi)
- [x] 5. Implémenter le bouton CTA :
   - Texte : "Commencer ->"
   - Style : fond `var(--accent)`, texte blanc, shadow-sm, radius-md
   - Hover : `translateY(-1px)` + shadow-md
   - Active : `scale(0.98)`
   - `onClick` : appeler `onStart`
- [x] 6. Afficher "Zéro engagement. Gratuit." sous le CTA en style small/caption
- [x] 7. Layout : centré, max-width 800px

### Tâche 3 : Implémenter la gestion d'état dans page.tsx (AC-1.4.4)
- [x] 1. Créer un composant client wrapper (`src/components/AppShell.tsx`)
- [x] 2. Utiliser `useState<AppState>('landing')` pour gérer l'état de l'application
- [x] 3. Passer la fonction de transition `setAppState('chat')` au composant Landing via `onStart`
- [x] 4. Afficher conditionnellement Landing ou Chat selon l'état
- [x] 5. Maintenir `page.tsx` comme Server Component qui passe les params au client wrapper

### Tâche 4 : Implémenter les transitions CSS fade (AC-1.4.4)
- [x] 1. Implémenter une transition CSS : `opacity` de 1 a 0 puis 0 a 1, durée 400ms, `ease-out`
- [x] 2. Utiliser le rendu conditionnel avec une classe CSS de transition
- [x] 3. Ne pas utiliser de librairie d'animation tierce

### Tâche 5 : Responsive et optimisation mobile (AC-1.4.3)
- [x] 1. Appliquer les breakpoints :
   - Mobile (< 640px) : padding 16px, titre 28px (clamp), CTA full-width, touch targets 44x44px
   - Tablette (640-1024px) : padding 24px
   - Desktop (> 1024px) : padding 32px
- [x] 2. Vérifier les tailles tactiles minimales (44x44px) sur tous les éléments interactifs
- [x] 3. Tester le rendu sur différentes largeurs d'écran

### Tâche 6 : Créer le placeholder de l'avatar (AC-1.4.5)
- [x] 1. Fallback inline implémenté dans `Header.tsx` (cercle coloré "F") via `onError`
- [x] 2. L'image finale sera fournie ultérieurement en `public/avatar-fakossa.webp`

### Tâche 7 : Validation et intégration
- [x] 1. Build TypeScript réussi (0 erreurs, 0 warnings)
- [x] 2. Lint ESLint réussi (0 erreurs)
- [x] 3. Transition landing -> chat implementée avec fade 400ms
- [x] 4. Responsive mobile via `clamp()` + breakpoints Tailwind

## Dev Notes

### Architecture des composants

```
page.tsx (Server Component)
  |-- parseProspectParams(searchParams)
  |-- <AppShell params={params}>      (Client Component, "use client")
        |-- useState<AppState>('landing')
        |-- {appState === 'landing' && <Landing params={params} onStart={...} />}
        |-- {appState === 'chat' && <Chat params={params} />}   (Story future)
        |-- <Header />
```

### Composant Landing.tsx — Structure

```typescript
// src/components/Landing.tsx
'use client';

import type { ProspectParams } from '@/types';

type LandingProps = {
  params: ProspectParams;
  onStart: () => void;
};

export default function Landing({ params, onStart }: LandingProps) {
  return (
    <main className="...">
      {/* Header avec avatar */}
      {/* Titre : LE DEFI 5 JOURS */}
      {/* Sous-titre conditionnel : x {company} */}
      {/* Bloc role conditionnel */}
      {/* 3 etapes */}
      {/* CTA */}
      {/* Mention zero engagement */}
    </main>
  );
}
```

### Styles du bouton CTA

```css
.cta-button {
  background-color: var(--accent);
  color: white;
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-xl);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;
  min-height: 44px;
  min-width: 44px;
}

.cta-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.cta-button:active {
  transform: scale(0.98);
}

/* Mobile */
@media (max-width: 639px) {
  .cta-button {
    width: 100%;
  }
}
```

### Transition fade

Implémentée via un état `visible: boolean` dans `AppShell.tsx` (pas via des classes CSS) :

```tsx
// AppShell.tsx
const [visible, setVisible] = useState(true);

function handleStart() {
  setVisible(false); // fade-out
  setTimeout(() => {
    setAppState('chat');
    setVisible(true); // fade-in
  }, 400);
}

// style inline
style={{ opacity: visible ? 1 : 0, transition: 'opacity 400ms ease-out' }}
```

> Les classes `.fade-enter` / `.fade-exit` décrites initialement n'ont **pas** été utilisées.

### Breakpoints responsive
- **Mobile** : < 640px — padding 16px, titre 28px, CTA full-width
- **Tablette** : 640px - 1024px — padding 24px
- **Desktop** : > 1024px — padding 32px, max-width 800px centré

### Accessibilité
- Toutes les zones tactiles : minimum 44x44px
- Bouton CTA : `<button>` sémantique (pas un `<div>` cliquable)
- Avatar : `alt="Avatar Fakossa"`
- Contraste texte/fond respecté (garanti par Story 1.3)

### Anti-patterns
- Pas de `dangerouslySetInnerHTML` pour afficher company/role
- Pas de `useEffect` pour la gestion de l'état initial
- Pas de librairie d'animation (Framer Motion, etc.) — CSS pur
- Pas de shadcn/Radix/MUI pour les composants

### Project Structure Notes

```
src/
├── app/
│   └── page.tsx                  # Server Component, passe params au client wrapper
├── components/
│   ├── Header.tsx                # Avatar Fakossa 32px top-left
│   ├── Landing.tsx               # Page d'accueil personnalisee, CTA
│   └── AppShell.tsx              # Client Component wrapper, gestion AppState
└── types/
    └── index.ts                  # ProspectParams, AppState (Story 1.1)
public/
└── avatar-fakossa.webp           # Avatar 32px (placeholder ou image finale)
```

#### Fichiers créés dans cette story
- `src/components/Landing.tsx` — composant page d'accueil
- `src/components/Header.tsx` — composant header avec avatar
- `src/components/AppShell.tsx` — client wrapper avec gestion d'état (ou intégré dans page.tsx)

#### Fichiers modifiés dans cette story
- `src/app/page.tsx` — intégration du AppShell et passage des props

#### Assets requis
- `public/avatar-fakossa.webp` — avatar Fakossa, 32px, format WebP

### References

- Architecture projet : Epic 1, Story 1.4
- Dépendance : Story 1.1 (projet, types), Story 1.2 (params parsés), Story 1.3 (design system, tokens CSS)
- Type `ProspectParams` : `src/types/index.ts`
- Type `AppState` : `src/types/index.ts`
- Design tokens : `src/app/globals.css` (Story 1.3)
- Next.js Image : https://nextjs.org/docs/app/api-reference/components/image

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- `api/chat/route.ts` : méthode `toDataStreamResponse()` inexistante en AI SDK v6 → remplacée par `toUIMessageStreamResponse()` (corrigée par linter en `DefaultChatTransport`)
- `Chat.tsx` : API `useChat` v4 incompatible avec v6 → reécrite pour utiliser `sendMessage`, `status`, `clearError` et `DefaultChatTransport` depuis `ai`
- `Header.tsx` : enrichi par le linter pour accepter `appState` et `company` props (affichage titre dans état chat)

### Completion Notes List

- `Header.tsx` créé avec avatar 32px, fallback inline `"F"` si `avatar-fakossa.webp` absent
- `Landing.tsx` créé avec titre conditionnel, bloc rôle conditionnel, 3 étapes statiques, bouton CTA complet
- `AppShell.tsx` créé : client wrapper avec `useState<AppState>`, transition fade `opacity` 400ms ease-out
- `page.tsx` modifié : Server Component minimaliste qui injecte les CSS custom properties accent et passe les params à `AppShell`
- `globals.css` enrichi : règles `.cta-button` hover/active, media query mobile full-width, keyframes `blink` et `slide-up`
- `api/chat/route.ts` corrigé : méthode streaming renommée en v6
- `Chat.tsx` corrigé : API `useChat` v6 (`DefaultChatTransport`, `sendMessage`, `status`)
- Build TypeScript et ESLint : 0 erreur

### File List

- `src/components/Header.tsx` — CRÉÉ
- `src/components/Landing.tsx` — CRÉÉ (texte CTA : `{'Commencer ->'}`)
- `src/components/AppShell.tsx` — CRÉÉ + CORRIGÉ (code review: timeout cleanup, recap state, error boundary)
- `src/app/page.tsx` — MODIFIÉ
- `src/app/globals.css` — MODIFIÉ
- `src/app/api/chat/route.ts` — CORRIGÉ (bug v6)
- `src/components/Chat.tsx` — CORRIGÉ (API v6)
