# Story 3.1: Recapitulatif du Brief & Confirmation

Status: ready-for-dev

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

1. Creer le fichier `src/components/BriefSummary.tsx`
2. Definir les props du composant :
   ```typescript
   type BriefSummaryProps = {
     briefData: BriefData;
     company?: string;
     contact?: string;
   };
   ```
3. Implementer la carte principale avec les styles :
   - Fond : `bg-[var(--cream-100)]` ou equivalent Tailwind (`#FFF8EF`)
   - Ombre : `shadow-md` (0 4px 12px rgba(42,39,36,.08))
   - Border-radius : 20px (`rounded-[20px]`)
4. Afficher le titre "BRIEF PROJET -- [Entreprise]" en utilisant `company` ou "Votre entreprise" par defaut
5. Implementer le mapping des sections BriefData vers les libelles francais :
   ```typescript
   const sectionLabels: Record<string, string> = {
     problem: 'Probleme',
     users: 'Utilisateurs cibles',
     current_solution: 'Solution actuelle',
     desired_outcome: 'Resultat attendu',
     five_day_scope: 'Perimetre 5 jours',
     suggested_deliverable: 'Livrable suggere',
   };
   ```
6. Rendre chaque section avec un titre en gras et le contenu en texte lisible
7. Ne pas afficher les sections vides (filtrer les champs vides ou undefined)

### Tache 2 : Implementer l'animation fade-in (AC-3.1.1)

1. Utiliser un state React pour gerer l'opacite initiale a 0
2. Appliquer la transition CSS : `transition-opacity duration-[400ms] ease-out`
3. Passer l'opacite a 1 au montage du composant via `useEffect` (exception justifiee : animation de montage)
4. Le titre "Brief pret !" doit etre affiche en couleur `emerald-500` (`#10B981`)

### Tache 3 : Implementer le message de confirmation (AC-3.1.3)

1. Ajouter la logique de personnalisation :
   ```typescript
   const destinataire = contact ? contact : 'vous';
   const message = `Fakossa a recu votre brief. Il revient vers ${destinataire} sous 24h avec une proposition.`;
   ```
2. Afficher le message sous la carte du brief
3. Styler le message avec une couleur charcoal-900 et une taille de texte lisible

### Tache 4 : Implementer le bouton CTA Calendly (AC-3.1.4)

1. Ajouter un bouton/lien "Prendre RDV directement" avec une fleche
2. Styler avec la couleur accent dynamique (ou emerald-500 par defaut)
3. Configurer le lien :
   ```tsx
   <a
     href={CALENDLY_URL}
     target="_blank"
     rel="noopener noreferrer"
     className="..."
   >
     Prendre RDV directement →
   </a>
   ```
4. L'URL Calendly doit etre definie comme constante ou variable d'environnement (`NEXT_PUBLIC_CALENDLY_URL`)

### Tache 5 : Declencher l'envoi du brief par email (AC-3.1.2)

1. Au montage du composant, declencher un `POST /api/brief` avec les donnees :
   ```typescript
   useEffect(() => {
     const sendBrief = async () => {
       try {
         await fetch('/api/brief', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             brief: briefData,
             metadata: {
               company: company || briefData.company,
               contact: contact || briefData.contact,
               sector: briefData.sector,
               source: 'chat',
               timestamp: new Date().toISOString(),
             },
           }),
         });
       } catch (error) {
         console.error('Erreur envoi brief:', error);
       }
     };
     sendBrief();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps
   ```
2. L'UX est optimiste : le recapitulatif est affiche immediatement, l'email est envoye en arriere-plan
3. En cas d'echec de l'envoi, le recapitulatif reste visible (pas de blocage UX)

### Tache 6 : Responsive mobile (AC-3.1.5)

1. Appliquer les classes Tailwind responsives :
   - Mobile : `w-full px-4`
   - Desktop : `max-w-2xl mx-auto`
2. Verifier que les sections sont lisibles sur petits ecrans
3. Le bouton CTA doit etre en pleine largeur sur mobile

### Tache 7 : Validation finale (toutes AC)

1. Verifier le fade-in de 400ms a l'affichage du composant
2. Verifier que toutes les sections du brief sont affichees avec les bons libelles
3. Verifier la personnalisation du message de confirmation (avec et sans contact)
4. Verifier que le lien Calendly s'ouvre dans un nouvel onglet
5. Verifier le rendu mobile (carte pleine largeur, sections lisibles)
6. Verifier que `POST /api/brief` est appele au montage
7. `pnpm tsc --noEmit` -- zero erreur TypeScript
8. `pnpm lint` -- aucune erreur ESLint

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

### Debug Log References

### Completion Notes List

### File List
