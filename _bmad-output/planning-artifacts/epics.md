---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
inputDocuments: ["prd.md", "architecture.md", "ux-design-specification.md"]
status: 'complete'
completedAt: '2026-03-04'
---

# defis-5-jours - Epic Breakdown

## Overview

Ce document décompose les exigences du PRD, de l'architecture et du design UX en epics et stories implémentables pour l'application Le Défi 5 Jours.

## Requirements Inventory

### Functional Requirements

- FR1: L'app peut parser les query params URL (company, role, sector, color, contact, source) et les utiliser pour personnaliser l'expérience
- FR2: L'app peut afficher un fallback générique quand aucun param n'est fourni
- FR3: L'app peut appliquer dynamiquement la couleur d'accent de l'entreprise via le param `color` (fallback : #F96743)
- FR4: L'app peut afficher le nom de l'entreprise dans le header, la landing et le récapitulatif
- FR5: Le prospect peut voir une landing personnalisée avec le nom de l'entreprise, le contexte du poste et les étapes du processus
- FR6: Le prospect peut comprendre le concept "Défi 5 Jours" en moins de 3 secondes via la landing
- FR7: Le prospect peut démarrer le chat via un CTA "Commencer"
- FR8: Le prospect peut envoyer des messages texte à l'assistant IA
- FR9: L'assistant IA peut répondre en streaming (mot par mot, visible en temps réel)
- FR10: L'assistant IA peut suivre un flow structuré en 5 étapes (Problème → Contexte → Existant → Résultat → Priorité)
- FR11: L'assistant IA peut reformuler la réponse du prospect pour confirmer la compréhension
- FR12: L'assistant IA peut proposer un scope réaliste quand le projet demandé dépasse 5 jours
- FR13: L'assistant IA peut adapter son guidage au niveau technique du prospect
- FR14: Le prospect peut voir une barre de progression indiquant l'étape courante (1/5 à 5/5)
- FR15: La conversation peut se terminer automatiquement après 8-10 échanges maximum
- FR16: L'assistant IA peut utiliser le contexte du prospect (company, role, sector) pour poser des questions pertinentes
- FR17: L'app peut générer un brief structuré à partir de la conversation (problème, utilisateurs, existant, résultat, scope 5 jours, livrable suggéré)
- FR18: Le prospect peut voir le brief sous forme de document lisible (pas de JSON)
- FR19: Le prospect peut voir un message de confirmation ("Fakossa revient vers vous sous 24h")
- FR20: Le prospect peut accéder à un CTA vers Calendly pour prendre RDV directement
- FR21: L'app peut envoyer un email structuré à fakossa@gmail.com contenant le brief complet et les métadonnées
- FR22: L'email peut être envoyé dans les 30 secondes après la soumission du brief
- FR23: Fakossa peut lire le brief et décider go/no-go sans avoir besoin d'un call exploratoire
- FR24: Le prospect peut créer un accès avec son nom de société (pré-rempli, non modifiable) et son email comme identifiant
- FR25: Le prospect peut se connecter avec son nom de société et son email pour accéder au livrable du défi
- FR26: Le système peut empêcher les soumissions multiples depuis la même société
- FR27: Le système peut bloquer l'accès au livrable sans authentification
- FR28: Le système peut limiter les conversations à 10 par heure par adresse IP
- FR29: Le système peut valider et sanitiser tous les paramètres URL pour prévenir les injections XSS
- FR30: Le système peut garder la clé API Gemini exclusivement côté serveur

### NonFunctional Requirements

- NFR1: La landing personnalisée charge en moins de 1.5 secondes (First Contentful Paint) sur une connexion 4G
- NFR2: Le premier token de la réponse IA apparaît en moins de 500ms après l'envoi du message utilisateur
- NFR3: L'email de notification est envoyé en moins de 30 secondes après la soumission du brief
- NFR4: La clé API Gemini n'est jamais exposée côté client (server-side uniquement)
- NFR5: Tous les paramètres URL sont sanitisés avant affichage pour prévenir les attaques XSS
- NFR6: Le rate limiting bloque les requêtes au-delà de 10 conversations/heure par IP
- NFR7: Les livrables sont inaccessibles sans authentification valide
- NFR8: L'app supporte 50 conversations simultanées sans dégradation
- NFR9: L'architecture permet l'ajout de Supabase pour le stockage sans refactoring majeur
- NFR10: Le contraste texte/fond respecte WCAG 2.1 AA (ratio minimum 4.5:1) y compris avec la couleur d'accent dynamique
- NFR11: Le chat est navigable au clavier (Tab, Enter pour envoyer, focus visible)

### Additional Requirements

**Depuis l'Architecture :**
- Starter template : `pnpm create next-app le-defi-des-5-jours --typescript --tailwind --eslint --app --src-dir --import-alias="@/*" --turbopack --use-pnpm`
- Dépendances additionnelles : `ai @ai-sdk/google resend`
- Modèle IA : Gemini 2.5 Flash (pas 2.0 Flash — déprécié juin 2026)
- CSS custom properties pour le theming dynamique (--accent, --cream-50, etc.)
- Rate limiting in-memory (Map<IP, timestamp[]>)
- Types TypeScript partagés dans src/types/index.ts
- Structure : src/app/, src/components/, src/lib/, src/types/

**Depuis le UX Design :**
- Transitions entre états : fade-in/fade-out 400ms ease-out
- Bulles chat : IA à gauche (cream-100, bord accent), prospect à droite (accent-light)
- Streaming : curseur clignotant |, pas de loader
- Micro-interactions : hover bouton translateY(-1px), active scale(0.98)
- Mobile : input sticky bottom, bulles 90% width, CTA pleine largeur
- Touch targets : minimum 44×44px
- Skeleton loading pendant le parsing initial des params
- Responsive breakpoints : mobile < 640px, tablet 640-1024px, desktop > 1024px

### FR Coverage Map

- FR1 → Epic 1 (Story 1.2) — Parsing query params URL
- FR2 → Epic 1 (Story 1.2) — Fallback générique
- FR3 → Epic 1 (Story 1.3) — Couleur d'accent dynamique
- FR4 → Epic 1 (Story 1.3, 1.4) — Nom entreprise dans UI
- FR5 → Epic 1 (Story 1.4) — Landing personnalisée
- FR6 → Epic 1 (Story 1.4) — Compréhension < 3 sec
- FR7 → Epic 1 (Story 1.4) — CTA Commencer
- FR8 → Epic 2 (Story 2.1) — Envoi messages
- FR9 → Epic 2 (Story 2.1) — Streaming IA
- FR10 → Epic 2 (Story 2.2) — Flow 5 étapes
- FR11 → Epic 2 (Story 2.2) — Reformulation
- FR12 → Epic 2 (Story 2.2) — Cadrage scope
- FR13 → Epic 2 (Story 2.2) — Adaptation niveau technique
- FR14 → Epic 2 (Story 2.3) — Barre de progression
- FR15 → Epic 2 (Story 2.2) — Limite 8-10 échanges
- FR16 → Epic 2 (Story 2.2) — Contexte prospect
- FR17 → Epic 3 (Story 3.1) — Génération brief
- FR18 → Epic 3 (Story 3.1) — Brief lisible
- FR19 → Epic 3 (Story 3.1) — Message confirmation
- FR20 → Epic 3 (Story 3.1) — CTA Calendly
- FR21 → Epic 3 (Story 3.2) — Email structuré
- FR22 → Epic 3 (Story 3.2) — Envoi < 30 sec
- FR23 → Epic 3 (Story 3.2) — Brief lisible pour Fakossa
- FR24 → Epic 4 (Story 4.1) — Création accès
- FR25 → Epic 4 (Story 4.1) — Connexion livrable
- FR26 → Epic 4 (Story 4.2) — Unicité par société
- FR27 → Epic 4 (Story 4.1) — Blocage sans auth
- FR28 → Epic 4 (Story 4.2) — Rate limiting
- FR29 → Epic 1 (Story 1.2) — Sanitization XSS
- FR30 → Epic 2 (Story 2.1) — Clé API server-side

## Epic List

### Epic 1: Fondation du Projet & Landing Personnalisée
Le prospect arrive depuis le pitch HTML et voit une landing personnalisée aux couleurs de sa société, comprend le concept en < 3 secondes, et peut démarrer le chat.
**FRs couverts :** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR29

### Epic 2: Chat IA Conversationnel
Le prospect décrit son projet via une conversation IA guidée en 5 étapes, avec streaming temps réel, reformulation et cadrage du scope.
**FRs couverts :** FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR30

### Epic 3: Brief & Notification
Le prospect reçoit un récapitulatif structuré de son brief, Fakossa reçoit un email formaté prêt à décider go/no-go.
**FRs couverts :** FR17, FR18, FR19, FR20, FR21, FR22, FR23

### Epic 4: Sécurité & Protection des Livrables
Le système protège les livrables derrière une authentification ultra-légère, empêche les abus (rate limiting, unicité par société) et garantit la sécurité.
**FRs couverts :** FR24, FR25, FR26, FR27, FR28

---

## Epic 1: Fondation du Projet & Landing Personnalisée

Le prospect arrive depuis un pitch HTML personnalisé et voit une landing aux couleurs de sa société. Il comprend le concept "Défi 5 Jours" instantanément et peut lancer le chat en un clic.

### Story 1.1: Initialisation du projet Next.js

As a développeur,
I want initialiser le projet avec le starter template Next.js et les dépendances requises,
So that la base technique est prête pour le développement de toutes les features.

**Acceptance Criteria:**

**Given** aucun projet n'existe encore
**When** j'exécute `pnpm create next-app le-defi-des-5-jours --typescript --tailwind --eslint --app --src-dir --import-alias="@/*" --turbopack --use-pnpm`
**Then** le projet est créé avec la structure src/app/, TypeScript strict, Tailwind CSS 4.x, ESLint configuré
**And** le fichier `src/app/page.tsx` affiche une page par défaut accessible sur localhost:3000

**Given** le projet est initialisé
**When** j'installe les dépendances additionnelles avec `pnpm add ai @ai-sdk/google resend`
**Then** les packages `ai`, `@ai-sdk/google` et `resend` sont dans package.json
**And** le projet compile sans erreur TypeScript

**Given** le projet est initialisé
**When** je crée le fichier `.env.example` avec les variables `GOOGLE_GENERATIVE_AI_API_KEY`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL`
**Then** le fichier `.env.example` existe à la racine sans valeurs sensibles
**And** le fichier `.env.local` est dans `.gitignore`

**Given** le projet est initialisé
**When** je crée `src/types/index.ts` avec les types `ProspectParams`, `BriefData`, `AppState`, `ApiError`
**Then** les types sont exportés et importables via `@/types`

### Story 1.2: Parsing et Sanitization des Query Params URL

As a prospect arrivant depuis le pitch,
I want que l'app lise automatiquement les paramètres de l'URL (company, role, sector, color, contact, source),
So that mon expérience est personnalisée sans que je n'aie rien à saisir.

**Acceptance Criteria:**

**Given** l'URL contient `?company=Otoqi&role=Product+Builder&sector=logistique&color=%234B5EAA&contact=Hermine&source=pitch`
**When** la page se charge
**Then** les paramètres sont extraits et passés en props aux composants enfants
**And** les valeurs sont sanitisées (suppression de balises HTML, caractères spéciaux encodés)

**Given** l'URL contient un paramètre `color` avec une valeur hex valide (`#4B5EAA`)
**When** le parsing des params est exécuté
**Then** la valeur est validée comme hex color (regex `/^#[0-9A-Fa-f]{6}$/`)
**And** la valeur est stockée pour injection CSS

**Given** l'URL contient un paramètre `color` avec une valeur invalide (`<script>alert(1)</script>`)
**When** le parsing des params est exécuté
**Then** la valeur est rejetée silencieusement
**And** la couleur fallback `#F96743` (coral) est utilisée

**Given** l'URL ne contient aucun paramètre
**When** la page se charge
**Then** tous les paramètres ont leurs valeurs par défaut (company: null, color: #F96743, etc.)
**And** l'app fonctionne en mode fallback générique

**Given** l'URL contient un paramètre `company` avec du contenu XSS (`<img onerror=alert(1)>`)
**When** le parsing est exécuté
**Then** les caractères dangereux sont échappés ou supprimés
**And** le texte affiché est sûr (FR29)

### Story 1.3: Design System & Theming Dynamique

As a prospect,
I want que l'interface utilise les couleurs de ma société,
So that je me sente dans un univers familier et professionnel.

**Acceptance Criteria:**

**Given** le paramètre `color` vaut `#4B5EAA`
**When** la page est rendue
**Then** la CSS custom property `--accent` est définie à `#4B5EAA` dans le `<html>`
**And** `--accent-light` est calculée (accent + opacity 10%)
**And** `--accent-dark` est calculée (accent - 15% luminosité)

**Given** la couleur d'accent fournie a un contraste < 4.5:1 sur fond cream (#FFFDF9)
**When** le theming est appliqué
**Then** la couleur est automatiquement assombrie jusqu'à atteindre le ratio WCAG AA (NFR10)

**Given** aucun paramètre `color` n'est fourni
**When** la page est rendue
**Then** la couleur fallback coral `#F96743` est utilisée comme accent

**Given** le fichier `globals.css` est configuré
**When** le design system est en place
**Then** les tokens statiques sont définis : `--cream-50: #FFFDF9`, `--cream-100: #FFF8EF`, `--charcoal-900: #2A2724`, `--charcoal-700: #4A453F`, `--charcoal-500: #7D756B`, `--charcoal-200: #D4CFC8`, `--emerald-500: #10B981`, `--red-500: #EF4444`
**And** la font Inter est chargée via Google Fonts
**And** les tokens de spacing, radius et shadows sont configurés dans Tailwind

### Story 1.4: Landing Personnalisée & CTA

As a prospect,
I want voir une page d'accueil qui mentionne le nom de ma société et m'explique le concept en quelques secondes,
So that je comprenne immédiatement ce que je peux obtenir et que je sois incité à continuer.

**Acceptance Criteria:**

**Given** les paramètres `company=Otoqi` et `role=Product Builder` sont présents
**When** la landing s'affiche
**Then** le titre affiche "LE DÉFI 5 JOURS" avec en dessous "× Otoqi" en couleur accent
**And** un bloc contextuel affiche "Vous cherchiez un(e) Product Builder. Et si on testait autre chose ?"
**And** les 3 étapes du processus sont visibles (Décrivez, Je scope, Je livre)
**And** un bouton "Commencer →" en couleur accent est affiché
**And** le texte "Zéro engagement. Gratuit." apparaît sous le CTA

**Given** aucun paramètre n'est fourni
**When** la landing s'affiche en mode fallback
**Then** le titre affiche "LE DÉFI 5 JOURS" sans "× [Entreprise]"
**And** le bloc contextuel sur le rôle est masqué
**And** la couleur accent est coral (#F96743)
**And** le CTA "Commencer →" est toujours visible

**Given** le prospect est sur mobile (< 640px)
**When** la landing s'affiche
**Then** le padding est 16px, le titre est en 28px
**And** le CTA est en pleine largeur
**And** les touch targets font minimum 44×44px

**Given** le prospect clique sur "Commencer →"
**When** la transition se déclenche
**Then** l'état de l'app passe de `'landing'` à `'chat'`
**And** la landing fait un fade-out (400ms ease-out)
**And** l'interface chat fait un fade-in (400ms ease-out)

**Given** un avatar Fakossa (public/avatar-fakossa.webp) est disponible
**When** la landing s'affiche
**Then** un avatar de 32px est visible dans le coin supérieur gauche

---

## Epic 2: Chat IA Conversationnel

Le prospect décrit son projet via une conversation guidée par un assistant IA. L'IA suit un flow en 5 étapes, reformule les réponses, cadre le scope réaliste pour 5 jours, et adapte son guidage au niveau technique du prospect. Le tout en streaming temps réel.

### Story 2.1: Interface Chat & Streaming IA

As a prospect,
I want pouvoir envoyer des messages et recevoir des réponses IA en temps réel (mot par mot),
So that la conversation soit fluide et naturelle, comme un échange avec un consultant.

**Acceptance Criteria:**

**Given** l'app est en état `'chat'`
**When** l'interface chat s'affiche
**Then** un header compact affiche "Le Défi 5 Jours × [Entreprise]" (ou "Le Défi 5 Jours" sans params)
**And** une zone de messages scrollable occupe l'espace central
**And** un champ de saisie "Tapez votre message..." est fixé en bas
**And** un bouton d'envoi (flèche ↑ en accent color) est visible à droite de l'input

**Given** l'interface chat est affichée
**When** le premier message IA arrive
**Then** le texte apparaît mot par mot (streaming) avec un curseur clignotant `|`
**And** la bulle IA est alignée à gauche, fond cream-100, bord gauche accent (2px), avatar Fakossa (24px)
**And** le streaming commence en < 500ms (NFR2)

**Given** le prospect tape un message et appuie sur Enter (desktop) ou le bouton ↑ (mobile)
**When** le message est envoyé
**Then** une bulle prospect apparaît à droite, fond accent-light, texte charcoal-900
**And** le message est envoyé à `/api/chat` via POST
**And** un nouveau stream IA commence

**Given** le composant Chat utilise le hook `useChat()` du AI SDK 6
**When** chaque message est envoyé
**Then** le body contient `{ messages[], context: { company, role, sector } }`
**And** la réponse est un stream SSE consommé par `useChat()`

**Given** l'API route `/api/chat` reçoit une requête
**When** elle traite le message
**Then** elle appelle `streamText()` avec le provider `@ai-sdk/google` et le modèle `gemini-2.5-flash`
**And** le system prompt est injecté côté serveur avec le contexte prospect
**And** la clé API Gemini n'est jamais envoyée côté client (FR30, NFR4)

**Given** le prospect est sur mobile
**When** le clavier virtuel s'ouvre
**Then** le champ de saisie reste visible (sticky bottom)
**And** la zone de messages scrolle automatiquement vers le dernier message
**And** les bulles ont un max-width de 90% (vs 85% desktop)

**Given** une erreur survient lors de l'appel Gemini
**When** le stream échoue
**Then** un bandeau rouge apparaît : "Oups, un souci technique. Réessayez."
**And** un bouton "Réessayer" permet de renvoyer le dernier message

### Story 2.2: System Prompt & Flow Structuré 5 Étapes

As a prospect,
I want être guidé à travers 5 étapes de questions pour décrire mon projet,
So that le brief final soit complet, structuré et réaliste pour 5 jours.

**Acceptance Criteria:**

**Given** une nouvelle conversation démarre
**When** le premier message IA est envoyé
**Then** le system prompt injecté côté serveur contient :
- Le contexte prospect (company, role, sector)
- Le ton : professionnel, chaleureux, vouvoiement
- Le flow en 5 étapes : Problème → Contexte → Existant → Résultat → Priorité
- Les règles : max 8-10 échanges, reformulation après chaque réponse, cadrage scope
- L'instruction de retourner un tag `[STEP:N]` dans chaque réponse pour la détection de progression
- L'instruction de ne jamais promettre de technologies spécifiques ni parler de prix
- Le format JSON du brief final

**Given** le prospect donne une réponse vague
**When** l'IA détecte le manque de précision
**Then** elle reformule avec des exemples concrets pour guider le prospect (FR13)
**And** elle ne passe pas à l'étape suivante tant que le sujet n'est pas clarifié

**Given** le prospect décrit un projet trop ambitieux pour 5 jours
**When** l'IA arrive à l'étape 5 (Priorité)
**Then** elle propose un scope réduit réaliste : "En 5 jours, on pourrait commencer par [X]. Le reste viendrait après." (FR12)

**Given** la conversation atteint 8-10 échanges
**When** l'IA a suffisamment d'informations
**Then** elle clôt la conversation avec "Parfait, j'ai tout ce qu'il faut. Voici le récapitulatif de votre projet..."
**And** elle inclut un JSON structuré du brief (invisible pour le prospect, parsé par le frontend)
**And** l'état de l'app passe de `'chat'` à `'recap'` (FR15)

**Given** chaque réponse IA contient un tag `[STEP:N]`
**When** le frontend reçoit le stream terminé
**Then** le tag est extrait par regex et supprimé du texte affiché
**And** la valeur N est utilisée pour mettre à jour la barre de progression

### Story 2.3: Barre de Progression Visuelle

As a prospect,
I want voir où j'en suis dans la conversation (étape X sur 5),
So that je sache que la conversation est courte et structurée, pas infinie.

**Acceptance Criteria:**

**Given** le chat est en cours
**When** la barre de progression est affichée
**Then** elle est positionnée au-dessus du champ de saisie
**And** elle affiche : la barre remplie en accent color + le label "Étape X/5 — [Nom étape]"
**And** les noms d'étapes sont : Problème, Contexte, Existant, Résultat, Priorité

**Given** le tag `[STEP:2]` est détecté dans la réponse IA
**When** la progression se met à jour
**Then** la barre passe de 20% à 40% avec une transition smooth (300ms ease-in-out)
**And** le label change de "Étape 1/5 — Problème" à "Étape 2/5 — Contexte"

**Given** le prospect est sur mobile avec le clavier ouvert
**When** la barre de progression est affichée
**Then** elle reste visible au-dessus de l'input, même avec le clavier ouvert

**Given** l'étape 5 est complétée
**When** la barre atteint 100%
**Then** la couleur de la barre passe à emerald-500 brièvement avant la transition vers le récap

---

## Epic 3: Brief & Notification

Le prospect voit un récapitulatif professionnel de son brief. Fakossa reçoit automatiquement un email structuré avec toutes les informations pour décider go/no-go.

### Story 3.1: Récapitulatif du Brief & Confirmation

As a prospect,
I want voir un récapitulatif clair et structuré de mon projet après la conversation,
So that je sache exactement ce que Fakossa va recevoir et que je sois rassuré sur la suite.

**Acceptance Criteria:**

**Given** la conversation IA est terminée et le brief JSON est parsé
**When** l'état passe à `'recap'`
**Then** une transition fade-in (400ms) affiche l'écran de récapitulatif
**And** un titre "✓ Brief prêt !" en emerald-500 est visible en haut

**Given** l'écran récapitulatif est affiché
**When** le brief est rendu
**Then** une carte (fond cream-100, shadow-md, radius-lg) affiche le brief avec :
- Titre "BRIEF PROJET — [Entreprise]"
- Section "Problème" avec le texte correspondant
- Section "Utilisateurs cibles"
- Section "Solution actuelle"
- Section "Résultat attendu"
- Section "Périmètre 5 jours"
- Section "Livrable suggéré"
**And** le brief est en texte lisible, pas en JSON (FR18)

**Given** le brief est affiché
**When** le message de confirmation est rendu
**Then** le texte affiche : "Fakossa a reçu votre brief. Il revient vers [contact/vous] sous 24h avec une proposition." (FR19)
**And** si le param `contact` est disponible, le prénom du contact est utilisé

**Given** l'écran récapitulatif est affiché
**When** le CTA Calendly est rendu
**Then** un bouton "Prendre RDV directement →" en accent color renvoie vers le lien Calendly de Fakossa (FR20)
**And** le lien s'ouvre dans un nouvel onglet

**Given** le prospect est sur mobile
**When** le récapitulatif s'affiche
**Then** la carte prend toute la largeur (padding 16px)
**And** les sections du brief sont lisibles et bien espacées

### Story 3.2: Envoi Email Brief à Fakossa

As a Fakossa (opérateur),
I want recevoir un email structuré contenant le brief complet dès qu'un prospect termine le chat,
So that je puisse lire le brief et décider go/no-go sans call exploratoire.

**Acceptance Criteria:**

**Given** le brief JSON est prêt côté client
**When** le composant BriefSummary est monté
**Then** un appel POST est envoyé à `/api/brief` avec `{ brief: BriefData, metadata: { company, contact, sector, source, timestamp } }`

**Given** l'API route `/api/brief` reçoit le brief
**When** elle traite la requête
**Then** elle formate un email HTML structuré avec :
- Sujet : "🎯 Nouveau Défi 5 Jours — [Entreprise]"
- Métadonnées : entreprise, contact, secteur, source, date
- Sections du brief : Problème, Utilisateurs, Solution actuelle, Résultat attendu, Scope 5 jours, Livrable suggéré, Notes
- Footer : "→ Répondre sous 24h"
**And** l'email est envoyé à `NOTIFICATION_EMAIL` (fakossa@gmail.com) via Resend
**And** l'envoi se fait en < 30 secondes (NFR3)

**Given** l'email est envoyé avec succès
**When** la réponse arrive au frontend
**Then** l'API retourne `{ success: true }`
**And** aucun feedback supplémentaire n'est affiché (le récap est déjà visible)

**Given** l'envoi de l'email échoue
**When** Resend retourne une erreur
**Then** l'erreur est loguée côté serveur (`console.error`)
**And** l'API retourne `{ success: false, error: "Email non envoyé", code: "RESEND_ERROR", retryable: true }`
**And** le prospect voit quand même le récapitulatif (pas de blocage UX)

**Given** Fakossa reçoit l'email
**When** il lit le brief
**Then** toutes les informations sont suffisantes pour décider go/no-go (FR23)
**And** le format est lisible sans ouvrir de pièce jointe

---

## Epic 4: Sécurité & Protection des Livrables

Le système protège les livrables de Fakossa derrière une authentification ultra-légère, empêche les abus de l'API IA via rate limiting, et garantit une seule soumission par société.

### Story 4.1: Authentification Ultra-Légère pour les Livrables

As a prospect ayant complété un Défi 5 Jours,
I want me connecter avec le nom de ma société et mon email pour consulter le livrable,
So that le résultat du défi soit protégé et accessible uniquement à moi.

**Acceptance Criteria:**

**Given** un prospect accède à la page livrable (route `/livrable` ou `/deliverable`)
**When** il n'est pas authentifié
**Then** un formulaire de connexion s'affiche avec :
- Champ "Nom de la société" (pré-rempli si query param company présent, non modifiable)
- Champ "Email" (type email, validé)
- Bouton "Accéder au livrable"
**And** l'accès au contenu du livrable est bloqué (FR27)

**Given** le prospect remplit le formulaire de connexion
**When** il clique sur "Accéder au livrable"
**Then** le backend vérifie que la combinaison société + email correspond à un brief soumis
**And** si valide : une session est créée (cookie HTTP-only) et le livrable s'affiche
**And** si invalide : un message d'erreur "Identifiants incorrects" s'affiche

**Given** le prospect est authentifié
**When** il consulte le livrable
**Then** le contenu est affiché en lecture seule
**And** le téléchargement direct n'est pas disponible (protection anti-bypass)

**Given** un middleware Next.js est configuré
**When** une requête arrive sur la route livrable
**Then** le middleware vérifie la session
**And** redirige vers le formulaire de connexion si pas de session valide

### Story 4.2: Rate Limiting & Protection Anti-Abus

As a opérateur du système,
I want limiter le nombre de conversations IA par IP et empêcher les soumissions multiples,
So that l'API Gemini ne soit pas abusée et qu'une société ne puisse pas saturer le système.

**Acceptance Criteria:**

**Given** une IP a envoyé 10 requêtes à `/api/chat` dans la dernière heure
**When** une 11ème requête arrive
**Then** l'API retourne un statut 429
**And** le body contient `{ error: "Beaucoup de demandes, revenez dans quelques minutes", code: "RATE_LIMIT", retryable: false }`
**And** le frontend affiche un message inline amical (FR28)

**Given** le module `lib/rate-limit.ts` est implémenté
**When** il reçoit une IP
**Then** il vérifie le nombre de requêtes dans la fenêtre glissante d'une heure via un `Map<string, number[]>`
**And** il retourne `true` (autorisé) ou `false` (limité)

**Given** une société "Otoqi" a déjà soumis un brief
**When** un prospect de la même société tente de soumettre un nouveau brief
**Then** le système détecte le doublon (basé sur le nom de société normalisé)
**And** un message s'affiche : "Un brief a déjà été soumis pour [Entreprise]"
**And** la soumission est bloquée (FR26)

**Given** le rate limiting utilise un Map en mémoire
**When** le serveur Edge redémarre (cold start Vercel)
**Then** le Map est réinitialisé (acceptable pour le volume MVP)
**And** les limites se réappliquent normalement après le redémarrage
