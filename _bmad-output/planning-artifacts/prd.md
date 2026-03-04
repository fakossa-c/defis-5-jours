---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
inputDocuments: ["product-brief-defis-5-jours-2026-03-04.md"]
workflowType: 'prd'
classification:
  projectType: web_app
  domain: sales-lead-qualification
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - defis-5-jours

**Author:** Fakos
**Date:** 2026-03-04

## Executive Summary

Le Défi 5 Jours est une application web single-page qui convertit l'intérêt généré par les pitchs HTML de Fakossa Conate en briefs de projets structurés et qualifiés. L'app remplace un funnel de conversion cassé (Gem Gemini / Calendly) par une expérience personnalisée aux couleurs de chaque prospect, guidée par un assistant IA conversationnel.

**Cible** : entreprises publiant des offres de stage/alternance pour profils tech — souvent à la recherche de main-d'oeuvre qualifiée à bas coût. Fakossa leur propose une alternative : un freelance senior qui livre un résultat concret en 5 jours, zéro engagement.

**Flux principal** : le prospect arrive depuis un pitch HTML personnalisé → landing aux couleurs de sa boîte → chat IA structuré (3-5 min) → brief généré → Fakossa reçoit le brief par email → le prospect consulte le livrable via un accès authentifié.

### What Makes This Special

- **Niche inexploitée** : ciblage systématique des annonces stage/alternance pour proposer du freelance senior à budget équivalent
- **Personnalisation de bout en bout** : du pitch à l'app, tout porte le nom et les couleurs du prospect
- **IA comme filtre de qualification** : l'assistant cadre le scope et écarte les projets irréalistes avant que Fakossa n'investisse 5 jours
- **Protection anti-bypass** : livrable accessible uniquement via authentification (nom société + email), empêchant le vol de travail
- **Zéro friction** : 3-5 minutes de conversation naturelle, pas de formulaire, pas d'inscription complexe

## Project Classification

- **Type** : Web App (SPA, Next.js App Router)
- **Domaine** : Qualification de leads / Sales automation
- **Complexité** : Low — pas de régulation, pas de données sensibles, pas de paiement
- **Contexte** : Greenfield — nouveau produit from scratch

## Success Criteria

### User Success

| Critère | Métrique | Cible |
|---|---|---|
| Le prospect comprend le concept en < 3 secondes | Time-to-understanding sur la landing | < 3 sec (nom entreprise + proposition visible immédiatement) |
| Le prospect complète le chat sans friction | Taux de complétion (début → brief) | > 70% |
| Le prospect perçoit le brief comme pertinent | Taux de validation directe du récap (pas de correction) | > 80% |
| Le prospect ne ghoste pas après le brief | Taux de réponse au suivi 24h | > 50% |

### Business Success

| Critère | Métrique | Cible | Horizon |
|---|---|---|---|
| Volume de leads qualifiés | Briefs structurés reçus / mois | 5-10 | 3 mois |
| Conversion pitch → brief | % visiteurs pitch qui soumettent un brief | > 30% | 3 mois |
| Filtrage des projets irréalistes | % briefs hors scope 5 jours | < 10% | Immédiat |
| Protection des livrables | Accès non-authentifié aux livrables | 0 | Immédiat |
| Revenu additionnel | Missions converties / mois depuis les briefs | +2-3 | 6 mois |

### Technical Success

| Critère | Métrique | Cible |
|---|---|---|
| Fiabilité du streaming IA | Taux de conversations complétées sans erreur | > 95% |
| Fiabilité de la notification | Emails reçus dans les 30 sec | > 99% |
| Temps de chargement initial | First Contentful Paint | < 1.5 sec |
| Disponibilité | Uptime Vercel | > 99.5% |

### Measurable Outcomes

- **Mois 1** : App déployée, 3-5 briefs reçus, flow validé de bout en bout
- **Mois 3** : 10+ briefs/mois, taux de conversion pitch → brief > 30%, 2-3 missions converties
- **Mois 6** : Pipeline commercial prévisible, revenu récurrent via clients convertis

## Product Scope

### MVP - Minimum Viable Product

1. Landing personnalisée (query params URL)
2. Chat IA conversationnel (Vercel AI SDK + Gemini 2.0 Flash, streaming, 5 étapes)
3. Récapitulatif du brief (document lisible, pas de JSON)
4. Notification email à Fakossa (Resend)
5. Authentification ultra-légère pour les livrables (nom société + email)
6. Sécurité de base (rate limiting, sanitization, API key server-side)
7. Responsive mobile

### Growth Features (Post-MVP)

- Téléchargement PDF du brief
- Stockage Supabase des briefs
- Webhook n8n pour automatisations
- Dashboard admin pour Fakossa (vue briefs, statut défis, pipeline)
- Espace client (suivi avancement du défi)
- Analytics avancées (funnel, heatmap)

### Vision (Future)

- Marketplace du Défi : ouverture à d'autres freelances seniors
- Matching entreprise ↔ freelance
- Notation et reviews des défis complétés
- Multi-langue

## User Journeys

### Journey 1 : Sophie (Décideuse PME) — Happy Path

**Opening Scene** : Sophie, CEO d'une PME logistique de 40 employés, a publié une offre de stage "Product Builder" sur LinkedIn. Elle reçoit un pitch HTML de Fakossa dans sa boîte mail. L'objet l'intrigue : "Et si je vous livrais en 5 jours ce qu'un stagiaire mettra 6 mois à produire ?". Elle ouvre le pitch, scroll rapidement — le design est propre, son nom d'entreprise est partout. Elle arrive à la section "Défi 5 Jours" et clique sur "Décrivez votre projet →".

**Rising Action** : L'app s'ouvre. "Le Défi 5 Jours × LogiFleet" s'affiche en bleu marine (la couleur de sa boîte). "Vous cherchiez un(e) Product Builder. Et si on testait autre chose ?" Sophie clique "Commencer". L'assistant lui pose des questions courtes : quel problème, qui utilise la solution, comment elle gère ça aujourd'hui. Sophie décrit son besoin en 4 messages : un dashboard de suivi de flotte pour ses chauffeurs. L'IA reformule à chaque étape.

**Climax** : L'IA affiche le récapitulatif. Sophie lit : "Scope 5 jours : dashboard de suivi en temps réel avec vue carte et statut des livraisons. 3 vues : admin, dispatcher, chauffeur mobile." Elle pense : "Il a compris exactement ce qu'il me faut."

**Resolution** : "Fakossa a reçu votre brief. Il revient vers vous sous 24h." Sophie ferme l'onglet, rassurée. Le lendemain, Fakossa lui envoie un message avec une proposition détaillée. 5 jours plus tard, elle consulte le prototype via son login (LogiFleet + son email). Elle est convaincue et signe un contrat récurrent.

### Journey 2 : Thomas (RH/Recruteur) — Parcours assisté

**Opening Scene** : Thomas, chargé de recrutement chez une agence digitale, voit le pitch de Fakossa dans ses emails. Il n'est pas décideur technique mais l'offre l'intrigue. Il clique sur le CTA "Défi 5 Jours".

**Rising Action** : L'app s'ouvre avec les couleurs de son agence. Thomas clique "Commencer" mais hésite à la première question ("Quel problème aimeriez-vous résoudre ?"). Il tape : "On a plein de problèmes, je sais pas trop par où commencer." L'IA reformule : "Pas de souci ! Si vous deviez choisir UN seul irritant dans votre quotidien professionnel, lequel serait-ce ?" Thomas décrit un problème de reporting client. L'IA le guide question par question.

**Climax** : Le brief est généré. Thomas le trouve clair — suffisamment pour le transmettre à son directeur technique. Il copie le lien et l'envoie en interne.

**Resolution** : Son directeur technique valide l'intérêt. Fakossa reçoit le brief et contacte Thomas sous 24h. Le défi commence.

### Journey 3 : Sophie — Edge Case (Projet irréaliste)

**Opening Scene** : Sophie revient avec un nouveau projet. Cette fois, elle décrit un ERP complet avec gestion RH, comptabilité, CRM et gestion de stock.

**Rising Action** : L'IA écoute, reformule, puis intervient au moment du scope : "C'est un projet ambitieux ! En 5 jours, on pourrait commencer par le module le plus urgent — par exemple le CRM ou le suivi de stock. Le reste viendrait dans des phases suivantes. Quel module est le plus prioritaire pour vous ?"

**Climax** : Sophie réalise qu'un ERP complet en 5 jours n'est pas réaliste. Elle choisit de prioriser le CRM client.

**Resolution** : Le brief est cadré sur le CRM uniquement. Fakossa reçoit un scope réaliste et peut livrer en confiance.

### Journey 4 : Fakossa (Opérateur) — Réception et traitement du brief

**Opening Scene** : Fakossa reçoit un email : "Nouveau Défi 5 Jours — LogiFleet". L'email contient le brief structuré : problème, utilisateurs, existant, résultat attendu, scope 5 jours, livrable suggéré.

**Rising Action** : Fakossa lit le brief en 2 minutes. Le scope est clair et réaliste. Il évalue : faisable en 5 jours, stack évidente (Next.js + Mapbox), prospect sérieux (PME logistique, besoin concret).

**Climax** : Fakossa décide go. Il répond au prospect sous 24h avec une proposition et commence le défi.

**Resolution** : 5 jours plus tard, il déploie le prototype derrière un accès authentifié. Le prospect se connecte (nom société + email) pour voir le résultat. Satisfaction → contrat récurrent.

### Journey Requirements Summary

| Journey | Capabilities révélées |
|---|---|
| Sophie (happy path) | Landing personnalisée, chat IA structuré, brief generation, email notification, auth livrable |
| Thomas (assisté) | Guidage IA renforcé pour profils non-techniques, reformulations adaptatives |
| Sophie (irréaliste) | Filtrage scope IA, proposition de scope réduit, cadrage réaliste |
| Fakossa (opérateur) | Email structuré, brief lisible, contexte suffisant pour décider go/no-go |

## Web App Specific Requirements

### Browser Support

| Navigateur | Version minimale |
|---|---|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |
| Mobile Safari | 15+ |
| Chrome Android | 90+ |

### Responsive Design

- **Mobile-first** : le chat doit être utilisable au pouce sur smartphone
- **Breakpoints** : mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- **Input chat mobile** : le clavier ne doit pas masquer les messages précédents

### Performance Targets

| Métrique | Cible |
|---|---|
| First Contentful Paint | < 1.5 sec |
| Largest Contentful Paint | < 2.5 sec |
| Time to Interactive | < 3 sec |
| Streaming first token | < 500ms après envoi du message |

### SEO Strategy

- SEO non critique (les prospects arrivent via le CTA du pitch, pas via Google)
- Meta tags basiques pour le partage social (OG tags avec nom entreprise si param présent)

### Accessibility

- Contraste suffisant (WCAG AA) pour le texte sur fond cream
- Navigation au clavier fonctionnelle dans le chat
- Labels ARIA sur les éléments interactifs

### Technical Architecture Considerations

- **Framework** : Next.js 14+ (App Router) — SSR pour la landing, client components pour le chat
- **Déploiement** : Vercel (Edge Runtime pour les API routes)
- **IA** : Vercel AI SDK + Google Gemini 2.0 Flash (gratuit, streaming natif)
- **Email** : Resend API
- **Styling** : Tailwind CSS avec CSS custom properties pour la couleur dynamique
- **Auth** : Session simple ou Supabase Auth (nom société = username, email = password)
- **Font** : Inter (Google Fonts)

### Implementation Considerations

- Single-page avec 3 états React (landing → chat → récap), pas de routing côté client
- CSS custom property `--accent` définie dynamiquement depuis le query param `color`
- Streaming SSE pour le chat (Vercel AI SDK gère nativement)
- System prompt Gemini injecté côté serveur avec les params de contexte (company, role, sector)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Approche MVP** : Problem-solving MVP — livrer la boucle complète pitch → brief → notification le plus vite possible pour valider que le flow convertit.

**Ressources** : Solo developer (Fakossa), 1-2 semaines de développement.

### MVP Feature Set (Phase 1)

**Journeys supportés** : Sophie (happy path), Thomas (assisté), Sophie (irréaliste), Fakossa (opérateur)

**Capabilities essentielles** :
1. Parsing et validation des query params URL
2. Landing personnalisée (company, color, role, contact)
3. Chat IA streaming (Gemini 2.0 Flash, 5 étapes, max 8-10 échanges)
4. Barre de progression visuelle
5. Génération du brief structuré
6. Envoi email formaté à fakossa@gmail.com
7. Écran de confirmation avec CTA Calendly
8. Auth ultra-légère pour accès livrable (nom société + email)
9. Rate limiting (10 conv/heure/IP)
10. Fallback générique sans query params

### Post-MVP Features

**Phase 2 (Growth — 3-6 mois)** :
- Stockage Supabase des briefs
- Dashboard admin Fakossa
- Téléchargement PDF du brief
- Webhook n8n
- Analytics funnel

**Phase 3 (Expansion — 6-12 mois)** :
- Espace client (suivi avancement du défi)
- Galerie de livrables passés
- Marketplace multi-freelances

### Risk Mitigation Strategy

| Risque | Impact | Mitigation |
|---|---|---|
| API Gemini indisponible | Chat bloqué | Message d'erreur gracieux + fallback formulaire simple |
| Prospect soumet un projet absurde | Temps perdu pour Fakossa | System prompt IA avec cadrage strict + reformulation scope |
| Prospect vole le livrable | Perte de travail gratuit | Auth obligatoire + pas de téléchargement direct |
| Rate limit Gemini dépassé | Conversations échouent | Rate limiting côté app (10/h/IP) + monitoring usage |
| Prospect revient et veut recommencer | Confusion UX | Une seule soumission par société (pas de doublons) |

## Functional Requirements

### Personnalisation & Contexte

- FR1: L'app peut parser les query params URL (company, role, sector, color, contact, source) et les utiliser pour personnaliser l'expérience
- FR2: L'app peut afficher un fallback générique quand aucun param n'est fourni
- FR3: L'app peut appliquer dynamiquement la couleur d'accent de l'entreprise via le param `color` (fallback : #F96743)
- FR4: L'app peut afficher le nom de l'entreprise dans le header, la landing et le récapitulatif

### Landing & Onboarding

- FR5: Le prospect peut voir une landing personnalisée avec le nom de l'entreprise, le contexte du poste et les étapes du processus
- FR6: Le prospect peut comprendre le concept "Défi 5 Jours" en moins de 3 secondes via la landing
- FR7: Le prospect peut démarrer le chat via un CTA "Commencer"

### Chat IA Conversationnel

- FR8: Le prospect peut envoyer des messages texte à l'assistant IA
- FR9: L'assistant IA peut répondre en streaming (mot par mot, visible en temps réel)
- FR10: L'assistant IA peut suivre un flow structuré en 5 étapes (Problème → Contexte → Existant → Résultat → Priorité)
- FR11: L'assistant IA peut reformuler la réponse du prospect pour confirmer la compréhension
- FR12: L'assistant IA peut proposer un scope réaliste quand le projet demandé dépasse 5 jours
- FR13: L'assistant IA peut adapter son guidage au niveau technique du prospect (questions plus concrètes pour les profils non-techniques)
- FR14: Le prospect peut voir une barre de progression indiquant l'étape courante (1/5 à 5/5)
- FR15: La conversation peut se terminer automatiquement après 8-10 échanges maximum
- FR16: L'assistant IA peut utiliser le contexte du prospect (company, role, sector) pour poser des questions pertinentes

### Brief & Récapitulatif

- FR17: L'app peut générer un brief structuré à partir de la conversation (problème, utilisateurs, existant, résultat, scope 5 jours, livrable suggéré)
- FR18: Le prospect peut voir le brief sous forme de document lisible (pas de JSON)
- FR19: Le prospect peut voir un message de confirmation ("Fakossa revient vers vous sous 24h")
- FR20: Le prospect peut accéder à un CTA vers Calendly pour prendre RDV directement

### Notification & Communication

- FR21: L'app peut envoyer un email structuré à fakossa@gmail.com contenant le brief complet et les métadonnées (company, contact, sector, source, date)
- FR22: L'email peut être envoyé dans les 30 secondes après la soumission du brief
- FR23: Fakossa peut lire le brief et décider go/no-go sans avoir besoin d'un call exploratoire

### Authentification & Protection des Livrables

- FR24: Le prospect peut créer un accès avec son nom de société (pré-rempli, non modifiable) et son email comme identifiant
- FR25: Le prospect peut se connecter avec son nom de société et son email pour accéder au livrable du défi
- FR26: Le système peut empêcher les soumissions multiples depuis la même société
- FR27: Le système peut bloquer l'accès au livrable sans authentification

### Sécurité

- FR28: Le système peut limiter les conversations à 10 par heure par adresse IP
- FR29: Le système peut valider et sanitizer tous les paramètres URL pour prévenir les injections XSS
- FR30: Le système peut garder la clé API Gemini exclusivement côté serveur

## Non-Functional Requirements

### Performance

- NFR1: La landing personnalisée charge en moins de 1.5 secondes (First Contentful Paint) sur une connexion 4G
- NFR2: Le premier token de la réponse IA apparaît en moins de 500ms après l'envoi du message utilisateur
- NFR3: L'email de notification est envoyé en moins de 30 secondes après la soumission du brief

### Security

- NFR4: La clé API Gemini n'est jamais exposée côté client (server-side uniquement)
- NFR5: Tous les paramètres URL sont sanitisés avant affichage pour prévenir les attaques XSS
- NFR6: Le rate limiting bloque les requêtes au-delà de 10 conversations/heure par IP
- NFR7: Les livrables sont inaccessibles sans authentification valide

### Scalability

- NFR8: L'app supporte 50 conversations simultanées sans dégradation (suffisant pour le volume MVP)
- NFR9: L'architecture permet l'ajout de Supabase pour le stockage sans refactoring majeur

### Accessibility

- NFR10: Le contraste texte/fond respecte WCAG 2.1 AA (ratio minimum 4.5:1) y compris avec la couleur d'accent dynamique
- NFR11: Le chat est navigable au clavier (Tab, Enter pour envoyer, focus visible)
