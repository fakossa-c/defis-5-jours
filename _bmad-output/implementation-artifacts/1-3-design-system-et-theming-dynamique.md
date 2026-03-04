# Story 1.3: Design System & Theming Dynamique

Status: done

## Story

As a prospect,
I want que l'interface utilise les couleurs de ma société,
So that je me sente dans un univers familier et professionnel.

## Acceptance Criteria

### AC-1.3.1 : Injection dynamique de la couleur accent

- **Given** le paramètre `color=#4B5EAA` est passé dans l'URL
- **When** la page est chargée
- **Then** la CSS custom property `--accent` est définie à `#4B5EAA` sur l'élément `<html>`
- **And** `--accent-light` est calculée comme accent + 10% d'opacité
- **And** `--accent-dark` est calculée comme accent - 15% de luminosité

### AC-1.3.2 : Vérification et correction automatique du contraste WCAG AA

- **Given** la couleur accent a un ratio de contraste inférieur à 4.5:1 sur le fond crème (`#FFFDF9`)
- **When** la vérification de contraste est exécutée
- **Then** la couleur est automatiquement assombrie jusqu'à atteindre un ratio WCAG AA de 4.5:1 minimum (NFR10)

### AC-1.3.3 : Fallback sans paramètre de couleur

- **Given** aucun paramètre `color` n'est présent dans l'URL
- **When** la page est chargée
- **Then** la couleur de fallback coral `#F96743` est utilisée comme `--accent`
- **And** les variantes `--accent-light` et `--accent-dark` sont calculées à partir du coral

### AC-1.3.4 : Tokens de design dans globals.css

- **Given** le fichier `globals.css` est configuré
- **When** la page est rendue
- **Then** tous les tokens statiques sont définis : couleurs (cream, charcoal, emerald, red), typographie, espacements, radius, ombres
- **And** la police Inter est chargée depuis Google Fonts

## Tasks / Subtasks

### Tâche 1 : Configurer globals.css avec tous les design tokens (AC-1.3.4)
- [x] 1. Définir les couleurs statiques comme CSS custom properties
- [x] 2. Définir les tokens dynamiques avec valeurs par défaut
- [x] 3. Définir les tokens typographiques
- [x] 4. Définir les tokens d'espacement
- [x] 5. Définir les tokens de radius
- [x] 6. Définir les tokens d'ombre
- [x] 7. Configurer les styles de base : fond cream-50, texte charcoal-900

### Tâche 2 : Charger la police Inter via Google Fonts (AC-1.3.4)
- [x] 1. Configurer le chargement de la police Inter dans `src/app/layout.tsx` via `next/font/google`
- [x] 2. Appliquer la police au `<body>` via la className générée
- [x] 3. Vérifier le rendu de la police sur la page

### Tâche 3 : Créer l'utilitaire de contraste dans lib/utils.ts (AC-1.3.2)
- [x] 1. Créer le fichier `src/lib/utils.ts`
- [x] 2. Implémenter `hexToRgb`
- [x] 3. Implémenter `relativeLuminance` selon la formule WCAG
- [x] 4. Implémenter `contrastRatio`
- [x] 5. Implémenter `ensureContrast` (assombrissement progressif HSL par pas de 5%)
- [x] 6. Implémenter `generateAccentLight` — accent + 10% opacité
- [x] 7. Implémenter `generateAccentDark` — accent - 15% luminosité HSL

### Tâche 4 : Implémenter l'injection de --accent dans page.tsx (AC-1.3.1, AC-1.3.3)
- [x] 1. Modifier `src/app/page.tsx` pour lire la couleur accent via `parseProspectParams`
- [x] 2. Injecter `--accent`, `--accent-light`, `--accent-dark` via `<style>` tag server-rendered sur `:root`
- [x] 3. Appliquer la vérification de contraste avant l'injection
- [x] 4. Si pas de couleur fournie, utiliser le fallback `#F96743`

### Tâche 5 : Configurer les tokens Tailwind (AC-1.3.4)
- [x] 1. Utiliser `@theme inline` dans `globals.css` pour exposer les custom properties comme classes Tailwind
- [x] 2. Vérifier que les classes Tailwind fonctionnent (`bg-cream-50`, `text-charcoal-900`, `bg-accent`, etc.)

### Tâche 6 : Validation visuelle
- [x] 1. Tester avec `color=#4B5EAA` — accent bleu injecté correctement
- [x] 2. Tester sans couleur — fallback coral appliqué + ajustement contraste
- [x] 3. Tester avec `#FFFF00` — assombrissement automatique vers `#666600`
- [x] 4. Vérifier le chargement de la police Inter — présente dans le HTML
- [x] 5. Vérifier les tokens — classes Tailwind fonctionnelles

## Dev Notes

### Utilitaire de contraste — Algorithme WCAG 2.1

```typescript
// src/lib/utils.ts

const CREAM_BG = '#FFFDF9';
const MIN_CONTRAST_RATIO = 4.5; // WCAG AA pour texte normal

/**
 * Convertit une couleur hex en composantes RGB.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Calcule la luminance relative selon WCAG 2.1.
 * Formule : L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * où R, G, B sont linéarisés.
 */
export function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcule le ratio de contraste entre deux couleurs.
 */
export function contrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Assombrit progressivement une couleur jusqu'à atteindre le ratio minimum.
 */
export function ensureContrast(accent: string, background: string = CREAM_BG, minRatio: number = MIN_CONTRAST_RATIO): string {
  // Assombrir par pas de 5% en luminosité HSL jusqu'à atteindre le ratio
}

/**
 * Génère --accent-light : couleur accent avec 10% d'opacité.
 * Retourne un format rgba().
 */
export function generateAccentLight(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
}

/**
 * Génère --accent-dark : couleur accent avec luminosité HSL réduite de 15%.
 */
export function generateAccentDark(hex: string): string {
  // Convertir hex -> HSL, réduire L de 15%, reconvertir en hex
}
```

### Injection dans layout.tsx

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { ensureContrast, generateAccentLight, generateAccentDark } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

// L'accent est passé depuis page.tsx ou extrait des params
// Injecter via style={{ '--accent': color, '--accent-light': light, '--accent-dark': dark } as React.CSSProperties}
// sur l'élément <html>
```

### Tokens CSS complets pour globals.css

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Les tokens peuvent etre rendus disponibles a Tailwind via @theme */
}

:root {
  /* Couleurs statiques */
  --cream-50: #FFFDF9;
  --cream-100: #FFF8EF;
  --charcoal-900: #2A2724;
  --charcoal-700: #4A453F;
  --charcoal-500: #7D756B;
  --charcoal-200: #D4CFC8;
  --emerald-500: #10B981;
  --red-500: #EF4444;

  /* Couleurs dynamiques (surchargees par JS) */
  --accent: #F96743;
  --accent-light: rgba(249, 103, 67, 0.1);
  --accent-dark: #D4502E;

  /* Typographie */
  --font-display: 700 36px/1.2 var(--font-inter);
  --font-h1: 700 28px/1.3 var(--font-inter);
  --font-h2: 600 22px/1.4 var(--font-inter);
  --font-h3: 600 18px/1.4 var(--font-inter);
  --font-body: 400 16px/1.6 var(--font-inter);
  --font-small: 400 14px/1.5 var(--font-inter);
  --font-caption: 500 12px/1.4 var(--font-inter);

  /* Espacement */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Ombres */
  --shadow-sm: 0 1px 3px rgba(42, 39, 36, 0.06);
  --shadow-md: 0 4px 12px rgba(42, 39, 36, 0.08);
  --shadow-lg: 0 8px 24px rgba(42, 39, 36, 0.12);
}

body {
  background-color: var(--cream-50);
  color: var(--charcoal-900);
}
```

### Anti-patterns
- Pas de `tailwind.config.ts` pour la config — Tailwind 4.x utilise `@theme` dans `globals.css`
- Pas de librairies tierces pour la gestion des couleurs
- Pas de `useEffect` pour l'injection des styles (fait cote serveur dans layout.tsx)

### Project Structure Notes

```
src/
├── app/
│   ├── globals.css               # Tokens CSS, @theme Tailwind, styles de base
│   └── layout.tsx                # Chargement Inter, injection --accent sur <html>
└── lib/
    └── utils.ts                  # hexToRgb, relativeLuminance, contrastRatio, ensureContrast, generateAccentLight, generateAccentDark
```

#### Fichiers créés dans cette story
- `src/lib/utils.ts` — utilitaires de couleur et contraste

#### Fichiers modifiés dans cette story
- `src/app/globals.css` — ajout de tous les design tokens
- `src/app/layout.tsx` — chargement Inter, injection accent dynamique

### References

- Architecture projet : Epic 1, Story 1.3
- Dépendance : Story 1.1 (projet initialisé), Story 1.2 (paramètre color parsé)
- WCAG 2.1 contraste : https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Exigence NFR10 : contraste minimum WCAG AA 4.5:1
- Tailwind CSS 4 @theme : https://tailwindcss.com/docs/theme
- Next.js Google Fonts : https://nextjs.org/docs/app/building-your-application/optimizing/fonts

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- Aucun bug rencontré pendant l'implémentation

### Completion Notes List
- globals.css : tous les design tokens (couleurs, typographie, espacement, radius, ombres) définis en CSS custom properties. Tokens exposés à Tailwind via `@theme inline`. `--font-sans` mappé à Inter.
- layout.tsx : police Inter chargée via `next/font/google`, appliquée au body. Metadata mise à jour. Geist remplacé par Inter.
- utils.ts : 7 fonctions implémentées — hexToRgb, relativeLuminance, contrastRatio, ensureContrast (assombrissement HSL par pas de 5%), generateAccentLight (rgba 10% opacité), generateAccentDark (HSL -15% luminosité). Fonctions helper internes rgbToHsl et hslToHex.
- page.tsx : injection server-side des CSS custom properties --accent, --accent-light, --accent-dark via `<style>` tag sur `:root`. Utilise ensureContrast pour garantir WCAG AA 4.5:1 avant injection.
- Note : l'injection est faite dans page.tsx (pas layout.tsx) car en Next.js App Router, layout.tsx n'a pas accès à searchParams. Le `<style>` tag sur `:root` est équivalent à `style` sur `<html>`.
- Note : le fallback coral #F96743 a un contraste de ~2.78:1 contre #FFFDF9, donc ensureContrast l'assombrit automatiquement à #cf2e07 (conforme AC-1.3.2 + AC-1.3.3).

### Change Log
- 2026-03-04 : Implémentation complète du design system et theming dynamique (story 1.3)
- 2026-03-04 : [Code Review] Fix CRITICAL — ajout tokens typographiques manquants dans globals.css
- 2026-03-04 : [Code Review] Fix HIGH — mapping `--font-sans` vers Inter dans @theme inline
- 2026-03-04 : [Code Review] Fix MEDIUM — suppression valeurs accent par défaut (flash prevention)
- 2026-03-04 : [Code Review] Fix MEDIUM — ajout console.warn dans hexToRgb pour input invalide
- 2026-03-04 : [Code Review] Fix MEDIUM — ajout 17 tests unitaires pour utils.ts (vitest)
- 2026-03-04 : [Code Review] Ajout script test dans package.json
- 2026-03-04 : [Code Review] Fix LOW — remplacement injection `<style>` par `React.CSSProperties` sur wrapper div
- 2026-03-04 : [Code Review] Fix LOW — documentation limitation `ensureContrast` (assombrissement uniquement)
- 2026-03-04 : [Code Review] Fix LOW — commentaire explicatif tokens typo non exposés dans @theme (shorthands CSS)

### File List
- `src/app/globals.css` — modifié : design tokens CSS (couleurs + typographie + espacement + radius + ombres) + @theme Tailwind + styles de base
- `src/app/layout.tsx` — modifié : Inter font, metadata, lang="fr"
- `src/app/page.tsx` — modifié : injection --accent server-side via <style> tag
- `src/lib/utils.ts` — créé : utilitaires couleur/contraste WCAG (avec console.warn)
- `src/lib/__tests__/utils.test.ts` — créé : 17 tests unitaires (hexToRgb, luminance, contraste, ensureContrast, generateAccent*)
- `package.json` — modifié : ajout vitest + scripts test/test:watch
