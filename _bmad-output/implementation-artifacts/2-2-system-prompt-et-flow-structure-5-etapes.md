# Story 2.2: System Prompt & Flow Structuré 5 Étapes

Status: ready-for-dev

## Story

As a prospect,
I want être guidé à travers 5 étapes de questions,
so that le brief final soit complet et réaliste pour 5 jours.

## Acceptance Criteria

### AC 2.2.1 — System prompt complet avec flow 5 étapes
```gherkin
Given une nouvelle conversation démarre
When le premier message IA est généré
Then le system prompt contient :
  | Élément                    | Détail                                                    |
  | Contexte prospect          | company, role, sector injectés dynamiquement              |
  | Ton                        | professionnel, chaleureux, vouvoiement                    |
  | Flow 5 étapes              | Problème → Contexte → Existant → Résultat → Priorité     |
  | Limite échanges            | 8-10 échanges maximum                                    |
  | Reformulation              | reformuler les réponses vagues avec exemples concrets     |
  | Tag étape                  | [STEP:N] dans chaque réponse                              |
  | Interdictions              | ne pas promettre techno/prix                              |
  | Format sortie              | JSON brief final en bloc ```json                          |
```

### AC 2.2.2 — Reformulation des réponses vagues
```gherkin
Given le prospect donne une réponse vague ou trop courte
When l'IA détecte le manque de précision
Then l'IA reformule la question avec des exemples concrets (FR13)
  And l'IA ne passe pas à l'étape suivante
  And le tag [STEP:N] reste le même que le message précédent
```

### AC 2.2.3 — Réduction du scope pour projets ambitieux
```gherkin
Given le prospect décrit un projet trop ambitieux
When l'IA atteint l'étape 5 (Priorité)
Then l'IA propose un scope réduit réaliste pour 5 jours
  And le message contient une formulation du type "En 5 jours, on pourrait commencer par [X]..." (FR12)
  And les éléments hors scope sont mentionnés comme perspectives futures
```

### AC 2.2.4 — Clôture automatique et génération du brief JSON
```gherkin
Given 8 à 10 échanges ont eu lieu et assez d'informations sont collectées
When l'IA a complété les 5 étapes
Then l'IA envoie un message de clôture "Parfait, j'ai tout ce qu'il me faut..." (FR15)
  And un bloc JSON contenant le brief complet est inclus dans la réponse (invisible pour l'utilisateur)
  And le JSON est parsé et extrait en tant que BriefData
  And l'état de l'application passe de 'chat' à 'recap'
```

### AC 2.2.5 — Extraction et suppression du tag [STEP:N]
```gherkin
Given un tag [STEP:N] est présent dans la réponse IA
When le stream est terminé
Then le tag est extrait par regex /\[STEP:(\d)\]/g
  And le numéro N est utilisé pour mettre à jour la progression
  And le tag est supprimé du texte affiché à l'utilisateur
```

## Tasks / Subtasks

### Tâche 2.2.1 — Enrichir src/lib/system-prompt.ts avec le flow complet
- [ ] Structurer le system prompt en sections : identité, contexte prospect, flow 5 étapes, règles, format de sortie
- [ ] Section identité : "Tu es l'assistant de Fakossa pour Le Défi 5 Jours..."
- [ ] Section contexte : injection dynamique de company, role, sector
- [ ] Section ton : professionnel, chaleureux, vouvoiement systématique
- [ ] Section flow 5 étapes avec instructions détaillées pour chaque étape :
  - Étape 1 — Problème : "Quel problème cherchez-vous à résoudre ?"
  - Étape 2 — Contexte : "Qui va utiliser la solution ? Combien d'utilisateurs ?"
  - Étape 3 — Existant : "Quelle est la solution actuelle ? Qu'est-ce qui ne fonctionne pas ?"
  - Étape 4 — Résultat : "Quel serait le résultat idéal ?"
  - Étape 5 — Priorité : "Si on ne pouvait faire qu'une chose en 5 jours, ce serait quoi ?"
- [ ] Section règles : reformulation si vague, pas de promesse techno/prix, max 8-10 échanges
- [ ] Section tag : instruction d'inclure [STEP:N] dans chaque réponse
- [ ] Section sortie : instruction de générer un bloc ```json avec BriefData à la fin

### Tâche 2.2.2 — Implémenter le parsing du tag [STEP:N] dans Chat.tsx
- [ ] Ajouter un état `currentStep` (number, initial: 1) dans Chat.tsx
- [ ] Après chaque message assistant complété (stream terminé), appliquer regex `/\[STEP:(\d)\]/g`
- [ ] Extraire le numéro N et mettre à jour `currentStep`
- [ ] Supprimer le tag du contenu affiché (remplacement par chaîne vide)
- [ ] Gérer le cas où le tag est absent (garder le step actuel)

### Tâche 2.2.3 — Implémenter l'extraction du brief JSON
- [ ] Détecter la présence d'un bloc ```json{...}``` dans la réponse IA finale
- [ ] Regex d'extraction : `` /```json\s*([\s\S]*?)\s*```/ ``
- [ ] Parser le JSON extrait avec `JSON.parse()` et valider la structure BriefData
- [ ] Gérer les erreurs de parsing (JSON malformé) : log erreur, ne pas transitionner
- [ ] Stocker le BriefData parsé dans l'état parent (page.tsx)

### Tâche 2.2.4 — Implémenter la transition chat → recap
- [ ] Quand un BriefData valide est extrait, appeler `setAppState('recap')`
- [ ] Passer le BriefData au composant parent via callback prop `onBriefComplete(brief: BriefData)`
- [ ] Ajouter un délai de 1s avant la transition pour laisser l'utilisateur lire le dernier message
- [ ] Supprimer le bloc JSON du dernier message affiché (invisible pour l'utilisateur)

### Tâche 2.2.5 — Gérer la limite d'échanges (8-10 messages)
- [ ] Compter les messages utilisateur dans le tableau messages
- [ ] Quand le nombre de messages utilisateur atteint 5+, le system prompt instruit l'IA de conclure
- [ ] Implémenter un mécanisme d'injection dynamique dans le system prompt : ajouter une instruction de clôture quand la limite approche
- [ ] Tester que l'IA conclut proprement même si toutes les étapes ne sont pas parfaitement couvertes

## Dev Notes

### Architecture du system prompt

Le system prompt est structuré en sections clairement délimitées :

```
[IDENTITÉ]
Tu es l'assistant de Fakossa pour Le Défi 5 Jours...

[CONTEXTE PROSPECT]
Entreprise : {company} | Rôle : {role} | Secteur : {sector}

[TON]
Professionnel, chaleureux, vouvoiement systématique.

[FLOW 5 ÉTAPES]
Étape 1 — Problème : ...
Étape 2 — Contexte : ...
Étape 3 — Existant : ...
Étape 4 — Résultat : ...
Étape 5 — Priorité : ...

[RÈGLES]
- Reformuler si réponse vague (avec exemples concrets)
- Ne jamais promettre de technologie ou de prix
- Maximum 8-10 échanges au total
- Scope réaliste pour 5 jours

[FORMAT TAG]
Inclure [STEP:N] au début de chaque réponse (N = numéro d'étape actuelle)

[FORMAT SORTIE FINALE]
Quand toutes les étapes sont complétées, générer un bloc ```json contenant le BriefData.
```

### Parsing du tag [STEP:N]

```typescript
const STEP_TAG_REGEX = /\[STEP:(\d)\]/g;

function extractStep(content: string): { step: number | null; cleanContent: string } {
  const match = STEP_TAG_REGEX.exec(content);
  const step = match ? parseInt(match[1], 10) : null;
  const cleanContent = content.replace(STEP_TAG_REGEX, '').trim();
  return { step, cleanContent };
}
```

### Extraction du brief JSON

```typescript
const JSON_BLOCK_REGEX = /```json\s*([\s\S]*?)\s*```/;

function extractBrief(content: string): BriefData | null {
  const match = JSON_BLOCK_REGEX.exec(content);
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as BriefData;
  } catch {
    console.error('Brief JSON malformé');
    return null;
  }
}
```

### Gestion dynamique du system prompt

Le system prompt peut être enrichi dynamiquement en fonction du nombre de messages :

```typescript
function generateSystemPrompt(context: ProspectParams, messageCount: number): string {
  let prompt = buildBasePrompt(context);
  if (messageCount >= 5) {
    prompt += '\n\n[INSTRUCTION URGENTE] Il reste peu d\'échanges. Commence à conclure et génère le brief final.';
  }
  return prompt;
}
```

### Contraintes

- Le system prompt est toujours injecté côté serveur (jamais envoyé depuis le client)
- Le tag [STEP:N] ne doit jamais être visible par l'utilisateur dans l'interface
- Le bloc JSON du brief ne doit jamais être visible dans le chat
- Le vouvoiement est obligatoire dans toutes les réponses IA
- L'IA ne doit jamais promettre une technologie spécifique ni un prix

### Tests à prévoir

- Test unitaire : `generateSystemPrompt()` retourne un prompt contenant les 5 sections obligatoires
- Test unitaire : `extractStep()` extrait correctement le numéro d'étape et nettoie le contenu
- Test unitaire : `extractBrief()` parse correctement un JSON valide et retourne null pour un JSON invalide
- Test intégration : flow complet de 5 étapes avec transition vers recap
- Test edge case : réponse IA sans tag [STEP:N] ne casse pas l'interface
- Test edge case : JSON brief malformé ne provoque pas de transition

### Project Structure Notes

```
src/
  lib/
    system-prompt.ts      # generateSystemPrompt() enrichi avec flow 5 étapes
  components/
    Chat.tsx              # Parsing [STEP:N], extraction brief, transition état
  types/
    index.ts              # BriefData type utilisé pour le brief final
```

### References

- [Vercel AI SDK 6 — System prompt](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text#system)
- [Gemini 2.5 Flash — System instructions](https://ai.google.dev/gemini-api/docs/system-instructions)
- Dépendance : Story 2.1 (Interface Chat & Streaming IA)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
