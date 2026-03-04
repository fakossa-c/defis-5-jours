---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: ["user-provided-brief-inline"]
date: 2026-03-04
author: Fakos
---

# Product Brief: defis-5-jours

## Executive Summary

**Le Défi 5 Jours** est une application web qui sert de pont entre le pitch commercial de Fakossa Conate et la conversion d'un prospect en client. Elle remplace un flow cassé (Gem Gemini / Calendly) par une expérience personnalisée où le prospect décrit son projet via un assistant IA, reçoit un scope réaliste, et Fakossa obtient un brief structuré prêt à exécuter.

L'app s'inscrit dans une stratégie commerciale ciblant les entreprises qui publient des offres de stage/alternance — souvent pour obtenir de la main-d'œuvre qualifiée à bas coût ou bénéficier d'aides. Fakossa leur propose une alternative : un freelance senior qui livre un résultat concret en 5 jours, sans engagement, sans formation à donner, sans risque RH. Le Défi 5 Jours est l'outil de qualification et de collecte du brief qui transforme l'intérêt en projet cadré.

---

## Core Vision

### Problem Statement

Fakossa génère de l'intérêt via des pitchs HTML personnalisés envoyés aux entreprises, mais le funnel de conversion se brise au moment critique : le CTA. Actuellement, il redirige soit vers un Gem Gemini (interface Google, pas professionnelle, pas brandée), soit vers Calendly (aucune collecte de brief, le prospect arrive en call sans préparation). Il manque une étape intermédiaire qui transforme l'intérêt en brief structuré tout en maintenant l'image professionnelle et la personnalisation du pitch.

### Problem Impact

- **Prospects perdus** : le changement de contexte (pitch soigné → interface Google générique) casse la confiance et le momentum
- **Calls non qualifiés** : sans brief préalable, les premiers échanges sont exploratoires au lieu d'être décisionnels
- **Projets irréalistes** : sans cadrage en amont, des prospects arrivent avec des demandes hors scope ("construis-moi une fusée en 5 jours")
- **Risque de bypass** : sans mécanisme de protection, un prospect peut récupérer le livrable et disparaître — ou pire, l'utiliser pour répondre à ses propres clients
- **Perte de revenus** : chaque prospect mal qualifié = 5 jours de travail gratuit potentiellement gaspillés

### Why Existing Solutions Fall Short

| Solution actuelle | Limitation |
|---|---|
| **Gem Gemini** | UX Google, pas brandée, pas personnalisable, pas d'envoi de brief structuré |
| **Calendly** | Zéro collecte d'information, le prospect arrive sans contexte |
| **Formulaire classique** | Froid, pas conversationnel, le prospect ne sait pas quoi écrire |
| **Email direct** | Pas structuré, réponses vagues, pas de cadrage du scope |

Aucune solution existante ne combine : personnalisation (nom/couleurs de l'entreprise), guidage conversationnel IA, cadrage réaliste du scope 5 jours, et notification structurée au freelance.

### Proposed Solution

Une app web single-page déployée sur Vercel qui :

1. **Accueille le prospect dans son univers** — nom de l'entreprise, couleurs, contexte du poste, via des paramètres URL passés depuis le pitch
2. **Guide via un assistant IA** — conversation structurée en 5 étapes (~3-5 min) qui extrait le problème, les utilisateurs, l'existant, le résultat attendu et la priorité
3. **Cadre le scope** — l'IA reformule et propose un périmètre réaliste pour 5 jours, filtrant les demandes irréalistes
4. **Notifie Fakossa** — brief structuré envoyé par email, prêt à décider go/no-go
5. **Protège le livrable** — le résultat du défi sera accessible uniquement via un lien authentifié (le prospect doit se connecter pour voir le rendu, empêchant le vol de travail)

### Key Differentiators

- **Niche inexploitée** : personne ne cible systématiquement les annonces stage/alternance pour proposer du freelance senior à budget équivalent
- **Expérience personnalisée de bout en bout** : du pitch HTML à l'app de brief, tout porte les couleurs et le nom du prospect — effet "c'est fait pour moi"
- **IA comme filtre de qualification** : l'assistant ne collecte pas seulement, il cadre — les projets irréalistes sont requalifiés ou écartés avant que Fakossa n'investisse 5 jours
- **Protection anti-bypass** : le livrable derrière un accès authentifié empêche le prospect de voler le travail pour l'utiliser sans engagement
- **Zéro friction** : pas d'inscription complexe, pas de formulaire, 3-5 minutes de conversation naturelle — le prospect passe du pitch au brief sans effort

---

## Target Users

### Primary Users

#### Persona 1 : Le Décideur PME — "Sophie"

- **Profil** : Responsable opérations ou CEO d'une PME/startup (10-100 employés), secteur tech, logistique, ou services
- **Contexte** : A publié une offre de stage/alternance pour un profil tech (développeur, product builder, data analyst). En réalité, elle a un besoin concret et immédiat mais un budget limité — l'alternance semblait être la solution économique
- **Frustration actuelle** : Former un junior prend du temps, le résultat est incertain, et le besoin est souvent urgent. Les freelances seniors sont trop chers pour son budget
- **Motivation** : Obtenir un résultat concret rapidement, sans le risque RH ni le temps de formation
- **Comportement dans l'app** : Arrive depuis le pitch, curieuse mais sceptique. Veut comprendre vite ce qu'elle obtient. Décrit son projet en termes business (pas techniques). Apprécie la personnalisation (nom de sa boîte, ses couleurs)
- **Moment "aha"** : Quand le récapitulatif du brief montre un scope réaliste et précis — "il a compris mon besoin en 5 minutes"
- **Critère de succès** : Brief soumis → réponse de Fakossa sous 24h → livrable en 5 jours → conversion en client récurrent

#### Persona 2 : Le RH/Recruteur — "Thomas"

- **Profil** : Chargé de recrutement dans une entreprise moyenne, gère les annonces stage/alternance
- **Contexte** : A reçu le pitch de Fakossa et l'a transmis en interne, ou a cliqué par curiosité. N'est pas le décideur final mais peut influencer
- **Frustration actuelle** : Recruter un alternant compétent est chronophage, et les profils tech juniors sont rares ou déçoivent
- **Motivation** : Présenter une alternative crédible à sa hiérarchie. Si le brief est clair et le scope réaliste, il peut vendre l'idée en interne
- **Comportement dans l'app** : Moins technique, réponses plus génériques. L'IA doit le guider davantage avec des exemples concrets
- **Critère de succès** : Réussit à décrire le besoin de son entreprise même sans expertise technique

### Secondary Users

#### Fakossa Conate (l'opérateur)

- **Rôle** : Reçoit les briefs structurés, évalue la faisabilité, décide go/no-go, livre le défi
- **Interaction** : Ne passe pas par l'app directement — reçoit le brief par email. Utilise le brief comme base de décision et de cadrage
- **Besoin** : Briefs structurés, projets réalistes et cadrés, contexte suffisant pour démarrer sans call exploratoire
- **Pain point à résoudre** : Éviter les projets irréalistes, les prospects qui ghostent, le vol de livrables

### User Journey

```
[Prospect voit l'annonce stage/alternance]
        ↓
[Fakossa envoie un pitch HTML personnalisé]
        ↓
[Prospect clique sur le CTA "Défi 5 Jours"]
        ↓
[APP] État 1 — Landing personnalisée (nom, couleurs, contexte du poste)
   → Comprend le concept en < 3 secondes
   → Clique "Commencer"
        ↓
[APP] État 2 — Chat IA (3-5 min, 5 étapes)
   → Décrit son problème
   → L'IA reformule et cadre
   → Barre de progression visible
        ↓
[APP] État 3 — Récapitulatif du brief
   → Voit un scope clair et réaliste
   → Confirmation : "Fakossa revient vers vous sous 24h"
   → Option : télécharger le brief / prendre RDV Calendly
        ↓
[EMAIL] Fakossa reçoit le brief structuré
   → Évalue faisabilité
   → Répond sous 24h
        ↓
[LIVRABLE] Accès authentifié (nom société + email)
   → Le prospect peut consulter le rendu
   → Pas de téléchargement direct / pas de vol possible
```

---

## Success Metrics

### Métriques utilisateur

| Métrique | Cible | Méthode de mesure |
|---|---|---|
| Taux de complétion du chat | > 70% des prospects qui cliquent "Commencer" finissent le brief | Analytics : ratio début/fin de conversation |
| Temps de complétion | < 5 minutes en moyenne | Timestamp début/fin de la conversation |
| Qualité perçue du brief | Le prospect ne modifie pas/peu sa description après le récap | Taux de validation directe du récapitulatif |
| Satisfaction prospect | Le prospect prend RDV ou attend la réponse (ne ghoste pas) | Taux de réponse au suivi 24h |

### Business Objectives

| Objectif | Horizon | Cible |
|---|---|---|
| **Augmenter le volume de leads qualifiés** | 3 mois | 5-10 briefs structurés/mois (vs ~0 actuellement) |
| **Améliorer le taux de conversion pitch → brief** | 3 mois | > 30% des prospects qui visitent le pitch soumettent un brief |
| **Réduire les projets irréalistes** | Immédiat | < 10% de briefs reçus avec un scope hors 5 jours |
| **Éliminer le vol de livrables** | Immédiat | 0 livrable accessible sans authentification |
| **Augmenter le revenu freelance** | 6 mois | +2-3 missions/mois converties depuis les briefs |
| **Construire un pipeline commercial prévisible** | 6 mois | Flux régulier de briefs entrants = revenus prévisibles |

### Key Performance Indicators

1. **KPI Acquisition** : Nombre de briefs soumis / semaine (leading indicator de revenu futur)
2. **KPI Conversion** : Ratio briefs soumis → défis acceptés → missions récurrentes
3. **KPI Qualité** : Score de faisabilité moyen des briefs (estimé par Fakossa : 1-5)
4. **KPI Rétention** : % de clients "Défi 5 Jours" qui deviennent des clients récurrents
5. **KPI Protection** : Nombre de tentatives d'accès non-authentifié aux livrables (doit rester à 0 succès)

---

## MVP Scope

### Core Features

#### Must-Have (MVP)

1. **Landing personnalisée** (État 1)
   - Parsing des query params URL (company, role, sector, color, contact, source)
   - Affichage personnalisé : nom d'entreprise, couleur d'accent dynamique, contexte du poste
   - Fallback générique si pas de paramètres
   - CTA "Commencer" pour lancer le chat

2. **Chat IA conversationnel** (État 2)
   - Intégration Vercel AI SDK + Gemini 2.0 Flash
   - Streaming en temps réel (mot par mot)
   - System prompt structuré avec flow en 5 étapes (Problème → Contexte → Existant → Résultat → Priorité)
   - Barre de progression visuelle (5 étapes)
   - Bulles de chat style iMessage
   - Maximum 8-10 échanges

3. **Récapitulatif du brief** (État 3)
   - Brief structuré lisible (pas de JSON visible)
   - Sections claires : Problème, Utilisateurs, Existant, Résultat, Scope 5 jours, Livrable suggéré
   - Message de confirmation ("Fakossa revient vers vous sous 24h")
   - CTA vers Calendly (accélérer la prise de contact)

4. **Notification email**
   - Envoi automatique du brief structuré à fakossa@gmail.com via Resend
   - Email formaté avec toutes les sections + métadonnées (entreprise, contact, secteur, source, date)

5. **Authentification ultra-légère pour les livrables**
   - Nom d'utilisateur = nom de la société (pré-rempli, non modifiable)
   - Mot de passe = email du contact (zéro friction)
   - Une seule soumission par société (pas de doublons)
   - Accès authentifié pour consulter le livrable du défi

6. **Sécurité de base**
   - Rate limiting : max 10 conversations/heure par IP
   - Clé API Gemini côté serveur uniquement
   - Sanitization des paramètres URL (anti-XSS)
   - Validation des inputs

### Out of Scope for MVP

| Feature | Raison du report | Horizon envisagé |
|---|---|---|
| Sauvegarde de session (reprise de conversation) | Trop complexe pour le MVP, la conversation dure 3-5 min | V2 si besoin identifié |
| Téléchargement PDF du brief | Nice-to-have, pas critique pour la conversion | V1.5 |
| Base de données Supabase pour stocker les briefs | L'email suffit pour le MVP, Supabase vient si le volume augmente | V2 quand > 20 briefs/mois |
| Webhook n8n pour automatisations | L'email est suffisant comme notification initiale | V2 |
| Dashboard admin pour Fakossa | Pas nécessaire tant que le volume est < 20 briefs/mois | V2 |
| Multi-langue | Cible exclusivement le marché français | V3 si expansion |
| Analytics avancées (heatmap, funnel) | Vercel Analytics basique suffit pour le MVP | V2 |
| Galerie de livrables passés | Nécessite d'abord d'avoir des défis complétés | V2 |

### MVP Success Criteria

| Critère | Seuil de validation |
|---|---|
| Un prospect peut compléter le flow de bout en bout (landing → chat → brief) | Fonctionnel sans bug bloquant |
| Fakossa reçoit un email structuré avec le brief | Email reçu < 30 sec après soumission |
| L'app est personnalisée via les query params du pitch | company + color fonctionnent correctement |
| Le chat filtre les projets irréalistes (scope > 5 jours) | L'IA propose un scope réaliste dans > 80% des cas |
| Le livrable est protégé derrière une authentification | Accès impossible sans login |
| L'app est responsive et utilisable sur mobile | Chat fonctionnel au pouce |
| Le CTA du pitch redirige correctement vers l'app | Paramètres passés et interprétés sans erreur |

### Future Vision

**V2 — Plateforme de gestion des défis (6-12 mois)**
- Dashboard Fakossa : vue de tous les briefs, statut des défis, pipeline commercial
- Espace client : le prospect suit l'avancement de son défi, échange avec Fakossa
- Historique des livrables avec accès authentifié persistant
- Stockage Supabase + webhook n8n pour automatiser le suivi

**V3 — Marketplace du Défi (12-24 mois)**
- Ouverture à d'autres freelances seniors (même modèle)
- Système de matching entreprise ↔ freelance
- Notation et reviews des défis complétés
- Monétisation : commission sur les missions récurrentes converties

---

## Stack Technique

| Composant | Choix | Justification |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR, API routes intégrées, déploiement Vercel natif |
| IA | Vercel AI SDK + Gemini 2.0 Flash | Gratuit, rapide, streaming natif via le SDK |
| Styling | Tailwind CSS | Cohérent avec le design system du pitch, CSS variables pour couleur dynamique |
| Déploiement | Vercel | Gratuit, domaine custom (defi.fakossa.dev), edge functions |
| Email | Resend | API gratuite, fiable, intégration simple |
| Auth | Custom minimal (Supabase Auth ou session simple) | Nom société + email, zéro friction |
| Font | Inter (Google Fonts) | Cohérence avec les pitchs HTML |

---

## Design System

| Token | Valeur | Usage |
|---|---|---|
| `--accent` | `[param color]` ou `#F96743` (coral, fallback) | Boutons, liens, accents |
| `--cream-50` | `#FFFDF9` | Background principal |
| `--charcoal-900` | `#2A2724` | Texte principal |
| `--charcoal-500` | `#7D756B` | Texte secondaire |
| `--emerald-500` | `#10b981` | Succès, validations |
| Border radius | 14-16px | Cohérence avec le langage visuel du pitch |
| Ombres | `rgba(42,39,36,.06)` | Légères, cream |
