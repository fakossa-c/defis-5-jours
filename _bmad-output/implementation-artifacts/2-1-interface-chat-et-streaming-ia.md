# Story 2.1: Interface Chat & Streaming IA

Status: done

## Story

As a prospect,
I want pouvoir envoyer des messages et recevoir des réponses IA en temps réel,
so that la conversation soit fluide et naturelle.

## Acceptance Criteria

### AC 2.1.1 — Affichage de l'interface chat
```gherkin
Given l'état de l'application est 'chat'
When l'interface chat est affichée
Then le header affiche "Le Défi 5 Jours × [Entreprise]"
  And une zone de messages scrollable est visible
  And un champ input avec placeholder "Tapez votre message..." est sticky en bas
  And un bouton d'envoi ↑ avec la couleur accent est affiché à droite de l'input
```

### AC 2.1.2 — Streaming du premier message IA
```gherkin
Given l'interface chat est affichée
When le premier message IA est reçu
Then le texte apparaît en streaming mot par mot
  And un curseur | clignotant est visible pendant le streaming
  And la bulle est alignée à gauche avec fond cream-100
  And la bulle a une bordure gauche de 2px couleur accent
  And un avatar de 24px est affiché à gauche de la bulle
  And le premier token apparaît en moins de 500ms (NFR2)
```

### AC 2.1.3 — Envoi de message par le prospect
```gherkin
Given le prospect tape un message dans l'input
When il appuie sur Enter ou clique sur le bouton d'envoi
Then une bulle à droite avec fond accent-light et texte charcoal-900 apparaît
  And un POST est envoyé à /api/chat
  And un nouveau stream de réponse IA démarre
  And l'input est vidé après envoi
```

### AC 2.1.4 — Intégration useChat() AI SDK 6
```gherkin
Given useChat() est initialisé avec le hook AI SDK 6
When un message est envoyé
Then le body de la requête contient { messages[], context: { company, role, sector } }
  And la réponse est reçue en SSE stream
  And les messages s'accumulent dans l'état local
```

### AC 2.1.5 — Route API /api/chat sécurisée
```gherkin
Given la route /api/chat reçoit une requête POST
When le traitement est effectué
Then streamText() est appelé avec le provider @ai-sdk/google
  And le modèle utilisé est gemini-2.5-flash
  And le system prompt est injecté côté serveur
  And la clé API Gemini n'est jamais exposée côté client (FR30, NFR4)
```

### AC 2.1.6 — Responsivité mobile
```gherkin
Given l'utilisateur est sur mobile
When le clavier virtuel est ouvert
Then l'input reste visible et sticky en bas de l'écran
  And le scroll automatique suit le dernier message
  And les bulles occupent 90% de la largeur disponible
```

### AC 2.1.7 — Gestion d'erreur Gemini
```gherkin
Given une erreur survient côté Gemini
When le stream échoue
Then un bandeau rouge s'affiche avec "Oups, un souci technique. Réessayez."
  And un bouton "Réessayer" est visible
  And le clic sur Réessayer renvoie le dernier message
```

## Tasks / Subtasks

### Tâche 2.1.1 — Créer la route API /api/chat
- [x] Créer `src/app/api/chat/route.ts`
- [x] Configurer `export const runtime = 'edge'`
- [x] Implémenter le handler POST avec validation du body (messages, context)
- [x] Appeler `streamText()` depuis `'ai'` avec provider `google('gemini-2.5-flash')` depuis `'@ai-sdk/google'`
- [x] Injecter le system prompt via `src/lib/system-prompt.ts`
- [x] Retourner le stream SSE avec `toUIMessageStreamResponse()` (AI SDK v6)
- [x] Gestion d'erreur : try/catch, retourner 503 `{ error: "Erreur du service IA", code: "GEMINI_ERROR", retryable: true }`

### Tâche 2.1.2 — Créer le module system prompt
- [x] Créer `src/lib/system-prompt.ts`
- [x] Exporter `generateSystemPrompt(context: { company: string, role: string, sector: string }): string`
- [x] Inclure le contexte prospect dans le prompt (company, role, sector)
- [x] Prompt initial minimal (sera enrichi dans Story 2.2)

### Tâche 2.1.3 — Créer le composant Chat.tsx
- [x] Créer `src/components/Chat.tsx`
- [x] Utiliser `useChat()` depuis `'@ai-sdk/react'` (AI SDK 6)
- [x] Configurer `useChat({ transport: new DefaultChatTransport({ api, body: { context } }) })`
- [x] Afficher la liste des messages avec scroll automatique
- [x] Implémenter le champ input sticky en bas avec bouton d'envoi
- [x] Gérer l'état de chargement (status === 'submitted' | 'streaming') pendant le streaming
- [x] Gérer les erreurs avec bandeau rouge et bouton Réessayer (regenerate())
- [x] Implémenter `useRef` pour le scroll automatique vers le dernier message

### Tâche 2.1.4 — Créer le composant ChatMessage.tsx
- [x] Créer `src/components/ChatMessage.tsx`
- [x] Props : `{ role: 'user' | 'assistant', content: string, isStreaming?: boolean }`
- [x] Bulle IA (assistant) : alignée gauche, bg `cream-100`, border-left 2px accent, avatar 24px
- [x] Bulle prospect (user) : alignée droite, bg accent-light, text `charcoal-900`
- [x] Curseur streaming : caractère `|` avec animation CSS `opacity` blink 800ms
- [x] Max-width : 85% desktop, 90% mobile
- [x] Animation d'apparition : slide-up + fade-in 200ms ease-out

### Tâche 2.1.5 — Mettre à jour le Header pour l'état chat
- [x] Modifier `src/components/Header.tsx` pour accepter l'état 'chat'
- [x] Afficher "Le Défi 5 Jours × [Entreprise]" quand appState === 'chat'
- [x] Adapter le style du header pour le mode chat (compact)

### Tâche 2.1.6 — Câbler la transition landing → chat dans page.tsx
- [x] Modifier `src/components/AppShell.tsx` pour afficher `<Chat />` quand appState === 'chat'
- [x] Passer les ProspectParams au composant Chat
- [x] Gérer la transition d'état `setAppState('chat')` depuis le formulaire landing

### Tâche 2.1.7 — Responsivité mobile
- [x] Input sticky : `position: sticky; bottom: 0` avec gestion du clavier virtuel
- [x] Bulles : `max-width: 90%` sur mobile (breakpoint `sm:`)
- [x] Auto-scroll : `scrollIntoView({ behavior: 'smooth' })` sur chaque nouveau message
- [x] Tester avec les viewports 375px, 390px, 414px

## Dev Notes

### Architecture technique

- **useChat()** depuis `'@ai-sdk/react'` (AI SDK 6) gère automatiquement le streaming, l'état des messages et les requêtes POST.
- **streamText()** depuis `'ai'` est utilisé côté serveur pour le streaming.
- **google()** provider depuis `'@ai-sdk/google'` avec modèle `'gemini-2.5-flash'` (pas 2.0 Flash qui est deprecated juin 2026).
- La route API utilise Edge Runtime : `export const runtime = 'edge'`

### Configuration useChat
```typescript
const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
  api: '/api/chat',
  body: { context: { company, role, sector } },
});
```

### Styles des bulles
- **IA (assistant)** : gauche, `bg-[var(--cream-100)]`, `border-l-2 border-[var(--accent)]`, avatar 24px
- **Prospect (user)** : droite, `bg-accent-light`, `text-[var(--charcoal-900)]`
- Curseur streaming : `|` avec `@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }` durée 800ms

### Format d'erreur API
```json
{ "error": "Erreur du service IA", "code": "GEMINI_ERROR", "retryable": true }
```

### Contraintes
- La clé API Gemini (`GOOGLE_GENERATIVE_AI_API_KEY`) ne doit jamais être exposée côté client
- Pas de `dangerouslySetInnerHTML`
- Pas de `useEffect` pour le fetch de données (useChat gère cela)
- Pas de shadcn/Radix/MUI — Tailwind CSS pur

### Tests à prévoir
- Test unitaire : ChatMessage.tsx rend correctement bulle IA et prospect
- Test unitaire : streaming cursor visible quand `isStreaming=true`
- Test intégration : route /api/chat retourne un stream SSE valide
- Test intégration : envoi message → réponse streamée affichée
- Test erreur : simuler erreur Gemini → bandeau rouge + bouton Réessayer

### Project Structure Notes

```
src/
  app/
    api/
      chat/
        route.ts          # POST handler, streamText, system prompt injection
    page.tsx              # Transition landing → chat (mise à jour)
  components/
    Chat.tsx              # Composant principal chat avec useChat()
    ChatMessage.tsx       # Bulle de message (IA/prospect)
    Header.tsx            # Header mis à jour pour état chat
  lib/
    system-prompt.ts      # Génération du system prompt
  types/
    index.ts              # ProspectParams, BriefData, AppState, ApiError
```

### References

- [Vercel AI SDK 6 — useChat](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat)
- [Vercel AI SDK 6 — streamText](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text)
- [@ai-sdk/google provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- Dépendance : Epic 1 (toutes les stories complétées)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Debug Log References
- AI SDK v6 breaking changes : `useChat()` déplacé vers `@ai-sdk/react`, API refactorisée (sendMessage/status/regenerate au lieu de input/handleSubmit/isLoading/reload). `UIMessage.parts[]` remplace `UIMessage.content`.
- `toDataStreamResponse()` → `toUIMessageStreamResponse()` requis par `DefaultChatTransport` dans AI SDK v6.
- `@ai-sdk/react` n'était pas installé — ajouté comme dépendance.

### Completion Notes List
- route.ts : Route POST Edge Runtime, streamText avec google('gemini-2.5-flash'), validation body, system prompt injection, toUIMessageStreamResponse(), error handling 503.
- system-prompt.ts : generateSystemPrompt() avec contexte company/role/sector conditionnel. 5 tests unitaires.
- Chat.tsx : useChat via @ai-sdk/react avec DefaultChatTransport (api + body context). Gestion input manuelle (useState), sendMessage({ text }), status streaming, error banner avec regenerate(), scroll auto.
- ChatMessage.tsx : Bulles IA (gauche, cream-100, border-l accent, avatar 24px) et prospect (droite, accent-light). Curseur | blink 800ms. max-w 90% mobile / 85% desktop. Animation slide-up 200ms.
- Header.tsx : Mis à jour avec props appState et company. Affiche "Le Défi 5 Jours × [Entreprise]" en mode chat.
- AppShell.tsx : Import et rendu de Chat quand appState === 'chat'. Transition fade-out/in conservée.
- globals.css : Ajout keyframes blink (800ms) et slide-up (200ms) + classes .animate-blink et .animate-slide-up.

### Change Log
- 2026-03-04 : Implémentation complète de l'interface chat et streaming IA (story 2.1)
- 2026-03-04 : Code review — 8 issues corrigées (4 HIGH, 4 MEDIUM) : séparation try/catch route.ts, message initial auto, bouton 44px, validation messages, accessibilité aria, gestion contenu vide, docs AI SDK corrigées

### File List
- `src/app/api/chat/route.ts` — créé : route POST Edge, streamText, google gemini-2.5-flash, system prompt
- `src/lib/system-prompt.ts` — créé : generateSystemPrompt avec contexte prospect
- `src/components/Chat.tsx` — créé : composant chat principal avec useChat() AI SDK v6
- `src/components/ChatMessage.tsx` — créé : bulle de message IA/prospect avec streaming cursor
- `src/components/Header.tsx` — modifié : ajout props appState/company, texte chat mode
- `src/components/AppShell.tsx` — modifié : import Chat, rendu conditionnel chat state
- `src/app/globals.css` — modifié : ajout animations blink et slide-up
- `src/lib/__tests__/system-prompt.test.ts` — créé : 5 tests unitaires
- `package.json` — modifié : ajout @ai-sdk/react
