# Story 2.3: Barre de Progression Visuelle

Status: ready-for-dev

## Story

As a prospect,
I want voir où j'en suis dans la conversation,
so that je sache que c'est court et structuré.

## Acceptance Criteria

### AC 2.3.1 — Affichage de la barre de progression
```gherkin
Given le chat est en cours
When la barre de progression est affichée
Then elle est positionnée au-dessus de l'input
  And elle affiche une barre de couleur accent
  And un label indique "Étape X/5 — [Nom]"
  And les noms des étapes sont : Problème, Contexte, Existant, Résultat, Priorité
```

### AC 2.3.2 — Mise à jour de la progression
```gherkin
Given le tag [STEP:2] est détecté dans une réponse IA
When la progression est mise à jour
Then la barre passe de 20% à 40% de remplissage
  And la transition est animée sur 300ms avec ease-in-out
  And le label change pour afficher le nom de la nouvelle étape
```

### AC 2.3.3 — Responsivité mobile avec clavier ouvert
```gherkin
Given l'utilisateur est sur mobile
When le clavier virtuel est ouvert
Then la barre de progression reste visible au-dessus de l'input
  And elle ne chevauche pas les bulles de message
  And elle ne chevauche pas l'input
```

### AC 2.3.4 — Complétion à 100% avec flash émeraude
```gherkin
Given l'étape 5 est complétée
When la barre atteint 100%
Then la couleur de remplissage passe brièvement à emerald-500
  And cette couleur reste visible pendant environ 1 seconde
  And la transition vers l'état recap se déclenche ensuite
```

## Tasks / Subtasks

### Tâche 2.3.1 — Créer le composant ProgressBar.tsx
- [ ] Créer `src/components/ProgressBar.tsx`
- [ ] Définir les props : `{ currentStep: number; totalSteps?: number }` (default totalSteps = 5)
- [ ] Définir le tableau des noms d'étapes : `['Problème', 'Contexte', 'Existant', 'Résultat', 'Priorité']`
- [ ] Calculer la largeur de remplissage : `(currentStep / totalSteps) * 100 + '%'`
- [ ] Rendre la barre extérieure (fond charcoal-200, hauteur 4px, border-radius full)
- [ ] Rendre la barre intérieure (fond accent, largeur dynamique, border-radius full)
- [ ] Rendre le label "Étape X/5 — [Nom]" au-dessus de la barre

### Tâche 2.3.2 — Implémenter la transition animée
- [ ] Ajouter `transition: width 300ms ease-in-out` sur la barre intérieure
- [ ] Utiliser les classes Tailwind : `transition-all duration-300 ease-in-out`
- [ ] Vérifier que la transition est fluide entre chaque changement d'étape

### Tâche 2.3.3 — Implémenter le flash émeraude à la complétion
- [ ] Ajouter un état local `isComplete` (boolean)
- [ ] Quand `currentStep === totalSteps`, passer `isComplete` à true
- [ ] Changer la couleur de la barre intérieure de accent à `emerald-500` quand `isComplete`
- [ ] Utiliser `transition: background-color 300ms` pour l'animation de couleur
- [ ] Le flash emerald-500 dure ~1 seconde avant la transition vers recap (géré par le parent)

### Tâche 2.3.4 — Câbler au composant Chat.tsx
- [ ] Importer `ProgressBar` dans `Chat.tsx`
- [ ] Passer `currentStep` (extrait du parsing [STEP:N]) en prop
- [ ] Positionner la barre au-dessus de l'input dans le layout du chat
- [ ] Vérifier que la mise à jour du step déclenche bien l'animation

### Tâche 2.3.5 — Responsivité mobile
- [ ] Sur mobile : la barre est sticky au-dessus de l'input (même position fixe)
- [ ] Sur desktop : la barre est positionnée en relatif dans le container chat
- [ ] Vérifier que la barre reste visible quand le clavier virtuel est ouvert
- [ ] Tester sur les viewports 375px, 390px, 414px
- [ ] S'assurer que la barre + label ne prennent pas trop de hauteur verticale

## Dev Notes

### Architecture du composant

```typescript
interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_NAMES = ['Problème', 'Contexte', 'Existant', 'Résultat', 'Priorité'];

export default function ProgressBar({ currentStep, totalSteps = 5 }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;
  const isComplete = currentStep >= totalSteps;
  const stepName = STEP_NAMES[currentStep - 1] ?? '';

  return (
    <div className="w-full px-4 py-2">
      <p className="text-xs font-medium text-[var(--charcoal-500)] mb-1">
        Étape {currentStep}/{totalSteps} — {stepName}
      </p>
      <div className="h-1 w-full rounded-full bg-[var(--charcoal-200)]">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-in-out ${
            isComplete ? 'bg-[var(--emerald-500)]' : 'bg-[var(--accent)]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

### Design tokens utilisés

| Token           | Valeur    | Usage                           |
|-----------------|-----------|----------------------------------|
| --charcoal-200  | #D4CFC8   | Fond de la barre (track)        |
| --charcoal-500  | #7D756B   | Couleur du label texte          |
| --accent        | #F96743   | Couleur de remplissage (défaut) |
| --emerald-500   | #10B981   | Couleur de complétion (flash)   |

### Spécifications visuelles

- **Barre extérieure (track)** : hauteur 4px (h-1), bg `charcoal-200`, border-radius full
- **Barre intérieure (fill)** : hauteur 4px, bg accent (ou emerald-500 si complet), border-radius full
- **Label** : taille 12px (text-xs), font-weight 500 (font-medium), couleur `charcoal-500`
- **Transition largeur** : 300ms ease-in-out
- **Transition couleur (complétion)** : 300ms ease-in-out

### Positionnement dans le layout

```
+---------------------------+
|        Header             |
+---------------------------+
|                           |
|    Zone Messages          |
|    (scrollable)           |
|                           |
+---------------------------+
|  Étape 2/5 — Contexte    |  <-- ProgressBar
|  [====------]             |
+---------------------------+
|  [Input message...]  [↑]  |  <-- Input sticky
+---------------------------+
```

### Contraintes

- Le composant est purement contrôlé (pas d'état interne pour le step, uniquement pour isComplete)
- La barre ne doit pas prendre plus de ~40px de hauteur totale (label + barre)
- Sur mobile, la barre doit rester visible même avec le clavier ouvert
- Pas de dépendance externe (pas de librairie d'animation)
- Utiliser uniquement Tailwind CSS pour les styles

### Tests à prévoir

- Test unitaire : le composant rend le bon label pour chaque étape (1 à 5)
- Test unitaire : la largeur de la barre est correcte pour chaque step (20%, 40%, 60%, 80%, 100%)
- Test unitaire : la couleur passe à emerald-500 quand currentStep === totalSteps
- Test snapshot : vérifier que le composant ne régresse pas visuellement
- Test accessibilité : la barre a un rôle `progressbar` avec `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

### Project Structure Notes

```
src/
  components/
    ProgressBar.tsx       # Composant barre de progression (nouveau)
    Chat.tsx              # Intégration de ProgressBar au-dessus de l'input
```

### References

- [WAI-ARIA Progressbar](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)
- [Tailwind CSS Transitions](https://tailwindcss.com/docs/transition-property)
- Dépendance : Story 2.1 (Interface Chat), Story 2.2 (parsing [STEP:N])

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
