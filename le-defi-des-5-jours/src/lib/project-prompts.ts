export type ProjectType = 'site-web' | 'mvp' | 'automatisation' | 'dashboard' | 'app-mobile';

export type BriefTemplate = {
  project_type: ProjectType;
  title: string;
  summary: string;
  deliverables: string[];
  stack: string[];
  day_by_day: { day: number; label: string; tasks: string[] }[];
};

export const PROJECT_BRIEFS: BriefTemplate[] = [
  // ── SITE WEB ──────────────────────────────────────
  {
    project_type: 'site-web',
    title: 'Site vitrine moderne avec CMS headless',
    summary:
      'Un site vitrine performant et elegant avec gestion de contenu autonome. Pages personnalisables, formulaire de contact, SEO optimise. Vous pourrez modifier textes et images sans toucher au code.',
    deliverables: [
      'Site responsive 5-7 pages (accueil, services, a propos, contact, mentions legales)',
      'CMS headless pour modifier le contenu en autonomie',
      'Formulaire de contact avec notifications email',
      'Optimisation SEO technique (meta, sitemap, structured data)',
      'Deploiement sur Vercel avec domaine personnalise',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Sanity CMS', 'Vercel', 'Resend'],
    day_by_day: [
      { day: 1, label: 'Setup & Structure', tasks: ['Initialisation projet + CI/CD', 'Maquette des pages principales', 'Configuration CMS headless'] },
      { day: 2, label: 'Pages principales', tasks: ['Accueil hero + sections', 'Page services/offres', 'Page a propos'] },
      { day: 3, label: 'Fonctionnalites', tasks: ['Formulaire de contact + emails', 'Page mentions legales', 'Navigation responsive + mobile'] },
      { day: 4, label: 'SEO & Perf', tasks: ['Meta tags, sitemap, robots.txt', 'Optimisation images + Core Web Vitals', 'Structured data schema.org'] },
      { day: 5, label: 'Polish & Deploy', tasks: ['Tests cross-browser', 'Animations et micro-interactions', 'Deploiement production + domaine'] },
    ],
  },
  {
    project_type: 'site-web',
    title: 'Landing page de conversion avec A/B testing',
    summary:
      'Une landing page haute conversion pour un produit ou service. Design persuasif, social proof, CTA optimises, et tracking analytique pour mesurer les resultats.',
    deliverables: [
      'Landing page single-page avec sections modulaires',
      'Formulaire de capture email/lead',
      'Integration analytics (events, conversions)',
      'Version mobile-first optimisee',
      'Deploiement + configuration domaine',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Vercel', 'Resend', 'Plausible'],
    day_by_day: [
      { day: 1, label: 'Strategy & Design', tasks: ['Analyse du positionnement', 'Wireframe + copywriting structure', 'Setup projet + design system'] },
      { day: 2, label: 'Build', tasks: ['Hero section + CTA', 'Sections features/benefices', 'Social proof + temoignages'] },
      { day: 3, label: 'Conversion', tasks: ['Formulaire de capture', 'Email de confirmation automatique', 'FAQ + objections'] },
      { day: 4, label: 'Tracking', tasks: ['Integration analytics', 'Event tracking (clics, scroll, formulaire)', 'Tests mobile + performance'] },
      { day: 5, label: 'Launch', tasks: ['Copywriting final', 'Tests cross-browser', 'Deploiement + DNS'] },
    ],
  },
  {
    project_type: 'site-web',
    title: 'Site e-commerce minimaliste',
    summary:
      'Une boutique en ligne epuree pour vendre 5-20 produits. Panier, paiement Stripe, gestion de commandes. Pas de marketplace complexe, juste ce qu\'il faut pour vendre.',
    deliverables: [
      'Catalogue produits avec fiches detaillees',
      'Panier + tunnel de paiement Stripe',
      'Emails de confirmation de commande',
      'Dashboard admin basique (commandes)',
      'Deploiement production',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Stripe', 'Supabase', 'Resend'],
    day_by_day: [
      { day: 1, label: 'Foundation', tasks: ['Schema DB produits/commandes', 'Setup Stripe + webhooks', 'Layout + navigation'] },
      { day: 2, label: 'Catalogue', tasks: ['Liste produits + filtres', 'Fiches produit detaillees', 'Gestion images produits'] },
      { day: 3, label: 'Checkout', tasks: ['Panier (ajout, suppression, quantite)', 'Tunnel de paiement Stripe Checkout', 'Webhook confirmation paiement'] },
      { day: 4, label: 'Post-achat', tasks: ['Email confirmation commande', 'Page de suivi commande', 'Admin: liste des commandes'] },
      { day: 5, label: 'Polish', tasks: ['Responsive mobile', 'SEO produits', 'Tests E2E + deploiement'] },
    ],
  },

  // ── MVP ───────────────────────────────────────────
  {
    project_type: 'mvp',
    title: 'MVP SaaS - Tableau de bord client',
    summary:
      'Un prototype fonctionnel de SaaS avec authentification, espace client, et une fonctionnalite cle. Suffisant pour tester l\'idee avec de vrais utilisateurs et collecter du feedback.',
    deliverables: [
      'Authentification email (inscription/connexion)',
      'Dashboard utilisateur avec donnees personnalisees',
      'Une fonctionnalite cle complete (CRUD)',
      'Page de settings/profil',
      'Deploiement accessible en ligne',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Supabase Auth', 'Supabase DB', 'Vercel'],
    day_by_day: [
      { day: 1, label: 'Auth & DB', tasks: ['Schema base de donnees', 'Auth Supabase (email/password)', 'Layout app + routing protege'] },
      { day: 2, label: 'Dashboard', tasks: ['Dashboard principal avec widgets', 'Liste de donnees + pagination', 'Vue detail / edition'] },
      { day: 3, label: 'Feature cle', tasks: ['CRUD complet sur la ressource principale', 'Validation formulaires', 'Feedback utilisateur (toasts, etats)'] },
      { day: 4, label: 'Profil & UX', tasks: ['Page profil/settings', 'Onboarding premiere connexion', 'Responsive mobile'] },
      { day: 5, label: 'Ship', tasks: ['Tests manuels E2E', 'Corrections bugs', 'Deploiement + partage lien beta'] },
    ],
  },
  {
    project_type: 'mvp',
    title: 'MVP Marketplace de services',
    summary:
      'Une plateforme simple mettant en relation prestataires et clients. Profils, annonces, messagerie basique. Le minimum pour valider le concept de votre marketplace.',
    deliverables: [
      'Double inscription (prestataire / client)',
      'Publication et recherche d\'annonces',
      'Profils publics prestataires',
      'Systeme de contact / demande de devis',
      'Deploiement production',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
    day_by_day: [
      { day: 1, label: 'Users & Auth', tasks: ['Auth avec roles (prestataire/client)', 'Profils utilisateurs', 'Schema DB annonces'] },
      { day: 2, label: 'Annonces', tasks: ['Creation d\'annonce (formulaire)', 'Liste + recherche/filtres', 'Page detail annonce'] },
      { day: 3, label: 'Matching', tasks: ['Profils publics prestataires', 'Bouton contact / demande devis', 'Notifications email'] },
      { day: 4, label: 'UX', tasks: ['Dashboard prestataire (mes annonces)', 'Dashboard client (mes demandes)', 'Responsive'] },
      { day: 5, label: 'Launch', tasks: ['Tests parcours complets', 'Corrections', 'Deploiement + seed data demo'] },
    ],
  },
  {
    project_type: 'mvp',
    title: 'MVP App de reservation',
    summary:
      'Un systeme de reservation en ligne simple. Calendrier de disponibilites, formulaire de reservation, confirmations automatiques. Ideal pour coachs, consultants, salons.',
    deliverables: [
      'Calendrier de disponibilites configurable',
      'Formulaire de reservation public',
      'Confirmations email automatiques',
      'Admin: gestion des creneaux et reservations',
      'Deploiement en ligne',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Supabase', 'Resend', 'Vercel'],
    day_by_day: [
      { day: 1, label: 'Schema & Auth', tasks: ['Schema DB creneaux/reservations', 'Auth admin', 'Config creneaux horaires'] },
      { day: 2, label: 'Calendrier', tasks: ['Vue calendrier (disponibilites)', 'Selection de creneau', 'Formulaire reservation'] },
      { day: 3, label: 'Confirmations', tasks: ['Email confirmation client', 'Email notification admin', 'Page recapitulatif reservation'] },
      { day: 4, label: 'Admin', tasks: ['Dashboard admin reservations', 'Gestion creneaux (bloquer/debloquer)', 'Annulation de reservation'] },
      { day: 5, label: 'Polish', tasks: ['Responsive mobile', 'Tests parcours complet', 'Deploiement production'] },
    ],
  },

  // ── AUTOMATISATION ────────────────────────────────
  {
    project_type: 'automatisation',
    title: 'Pipeline d\'onboarding client automatise',
    summary:
      'Automatisation du processus d\'onboarding : a la soumission d\'un formulaire, declenchement automatique d\'emails de bienvenue, creation de dossier, notification equipe, suivi.',
    deliverables: [
      'Formulaire d\'onboarding intelligent',
      'Sequence de 3 emails automatiques (J0, J+1, J+3)',
      'Creation automatique fiche client en base',
      'Notification Slack/email a l\'equipe',
      'Dashboard de suivi des onboardings',
    ],
    stack: ['Next.js', 'Supabase', 'Resend', 'Cron (Vercel)', 'Webhooks'],
    day_by_day: [
      { day: 1, label: 'Formulaire & DB', tasks: ['Schema DB clients/onboarding', 'Formulaire multi-etapes', 'API de soumission'] },
      { day: 2, label: 'Emails', tasks: ['Template email bienvenue', 'Sequence emails automatiques (cron)', 'Tracking ouverture/clic'] },
      { day: 3, label: 'Notifications', tasks: ['Webhook notification equipe', 'Creation automatique fiche client', 'Regles de validation metier'] },
      { day: 4, label: 'Dashboard', tasks: ['Vue liste onboardings en cours', 'Statuts et progression', 'Filtres et recherche'] },
      { day: 5, label: 'Test & Deploy', tasks: ['Test du parcours complet', 'Gestion des erreurs/retry', 'Deploiement + documentation'] },
    ],
  },
  {
    project_type: 'automatisation',
    title: 'Generateur de rapports automatique',
    summary:
      'Un systeme qui collecte des donnees depuis vos sources (API, spreadsheet, DB), genere un rapport formate automatiquement, et l\'envoie par email a frequence reguliere.',
    deliverables: [
      'Connecteur pour 1-2 sources de donnees',
      'Template de rapport HTML/PDF',
      'Generation automatique planifiee (quotidien/hebdo)',
      'Envoi email avec rapport en piece jointe',
      'Interface de configuration basique',
    ],
    stack: ['Next.js', 'Supabase', 'Resend', 'Vercel Cron', 'Puppeteer'],
    day_by_day: [
      { day: 1, label: 'Sources', tasks: ['Connecteur source de donnees #1', 'Schema DB rapports', 'API d\'aggregation des donnees'] },
      { day: 2, label: 'Template', tasks: ['Template HTML du rapport', 'Injection des donnees dynamiques', 'Generation PDF'] },
      { day: 3, label: 'Automation', tasks: ['Cron job de generation', 'Envoi email avec piece jointe', 'Historique des rapports generes'] },
      { day: 4, label: 'Config', tasks: ['Interface de configuration (frequence, destinataires)', 'Connecteur source #2', 'Preview du rapport'] },
      { day: 5, label: 'Fiabilite', tasks: ['Gestion erreurs + retry', 'Logs et monitoring', 'Deploiement + documentation'] },
    ],
  },
  {
    project_type: 'automatisation',
    title: 'Workflow de traitement de leads',
    summary:
      'Automatisation de la qualification et du routage des leads : scraping formulaire, enrichissement donnees, scoring, attribution automatique, notifications.',
    deliverables: [
      'Webhook de capture de leads (formulaire/Typeform/etc)',
      'Enrichissement automatique (domaine, taille entreprise)',
      'Scoring et qualification automatique',
      'Routage vers le bon commercial',
      'Dashboard pipeline leads',
    ],
    stack: ['Next.js', 'Supabase', 'Resend', 'Vercel', 'API enrichissement'],
    day_by_day: [
      { day: 1, label: 'Capture', tasks: ['Webhook de reception leads', 'Schema DB leads/pipeline', 'Validation et deduplication'] },
      { day: 2, label: 'Enrichissement', tasks: ['Extraction domaine email', 'API enrichissement basique', 'Stockage donnees enrichies'] },
      { day: 3, label: 'Scoring', tasks: ['Regles de scoring configurables', 'Qualification automatique (hot/warm/cold)', 'Attribution au commercial'] },
      { day: 4, label: 'Notifications', tasks: ['Email notification nouveau lead', 'Dashboard pipeline avec kanban', 'Filtres et tri'] },
      { day: 5, label: 'Polish', tasks: ['Stats et metriques', 'Tests du workflow complet', 'Deploiement + doc'] },
    ],
  },

  // ── DASHBOARD ─────────────────────────────────────
  {
    project_type: 'dashboard',
    title: 'Dashboard KPI temps reel',
    summary:
      'Un tableau de bord qui affiche vos metriques business en temps reel. Graphiques interactifs, filtres par periode, export CSV. Connecte a votre base de donnees ou API.',
    deliverables: [
      '4-6 widgets KPI (chiffres cles, tendances)',
      'Graphiques interactifs (barres, lignes, camemberts)',
      'Filtres par periode (jour, semaine, mois, custom)',
      'Export des donnees en CSV',
      'Authentification admin',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Recharts', 'Supabase', 'Vercel'],
    day_by_day: [
      { day: 1, label: 'Data & Auth', tasks: ['Schema DB metriques', 'Auth admin', 'API endpoints aggregation'] },
      { day: 2, label: 'KPI Cards', tasks: ['Widgets KPI avec tendance', 'Comparaison periode precedente', 'Layout responsive grid'] },
      { day: 3, label: 'Charts', tasks: ['Graphique barres (revenus/volumes)', 'Graphique lignes (evolution)', 'Graphique camembert (repartition)'] },
      { day: 4, label: 'Filtres & Export', tasks: ['Filtre par periode', 'Filtre par categorie/segment', 'Export CSV'] },
      { day: 5, label: 'Polish', tasks: ['Animations de chargement', 'Responsive mobile', 'Deploiement production'] },
    ],
  },
  {
    project_type: 'dashboard',
    title: 'Dashboard de suivi de projet',
    summary:
      'Un outil interne pour suivre l\'avancement de vos projets. Vue kanban, timeline, indicateurs de sante projet. Simple mais efficace pour une equipe de 5-15 personnes.',
    deliverables: [
      'Vue kanban drag & drop',
      'Fiches projet avec statut et progression',
      'Timeline / vue calendrier',
      'Indicateurs de sante (en avance, a l\'heure, en retard)',
      'Authentification equipe',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Supabase', 'dnd-kit', 'Vercel'],
    day_by_day: [
      { day: 1, label: 'Schema & Auth', tasks: ['Schema DB projets/taches', 'Auth equipe', 'CRUD projets'] },
      { day: 2, label: 'Kanban', tasks: ['Vue kanban colonnes', 'Drag & drop entre colonnes', 'Fiches taches'] },
      { day: 3, label: 'Detail projet', tasks: ['Page detail projet', 'Barre de progression', 'Indicateurs de sante'] },
      { day: 4, label: 'Timeline', tasks: ['Vue calendrier/timeline', 'Filtres par projet/responsable', 'Dashboard global'] },
      { day: 5, label: 'Ship', tasks: ['Responsive', 'Tests', 'Deploiement + seed data demo'] },
    ],
  },
  {
    project_type: 'dashboard',
    title: 'Dashboard analytics web',
    summary:
      'Un dashboard pour visualiser le trafic et les conversions de votre site. Alternative legere a Google Analytics, respectueuse de la vie privee, avec les metriques essentielles.',
    deliverables: [
      'Script de tracking leger (<3kb)',
      'Dashboard: visiteurs, pages vues, sources',
      'Graphiques d\'evolution temporelle',
      'Top pages et sources de trafic',
      'Respect RGPD (pas de cookies)',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'Supabase', 'Recharts', 'Vercel'],
    day_by_day: [
      { day: 1, label: 'Tracking', tasks: ['Script de collecte JS leger', 'API d\'ingestion events', 'Schema DB events'] },
      { day: 2, label: 'Aggregation', tasks: ['Requetes d\'aggregation (visiteurs uniques, pages vues)', 'Cache des metriques', 'Auth dashboard'] },
      { day: 3, label: 'Visualisation', tasks: ['Graphique visiteurs / jour', 'Top pages', 'Sources de trafic'] },
      { day: 4, label: 'Filtres', tasks: ['Filtre par periode', 'Filtre par page/source', 'Donnees en temps reel'] },
      { day: 5, label: 'Deploy', tasks: ['Script d\'integration one-liner', 'Documentation', 'Deploiement production'] },
    ],
  },

  // ── APP MOBILE ────────────────────────────────────
  {
    project_type: 'app-mobile',
    title: 'App mobile de prise de notes vocales',
    summary:
      'Une app mobile cross-platform pour capturer des notes vocales, les transcrire automatiquement, et les organiser par categories. Simple, rapide, offline-first.',
    deliverables: [
      'Enregistrement vocal avec transcription auto',
      'Liste des notes avec recherche',
      'Categories / tags',
      'Mode offline (sync au retour)',
      'Build iOS + Android',
    ],
    stack: ['React Native (Expo)', 'Supabase', 'Whisper API', 'EAS Build'],
    day_by_day: [
      { day: 1, label: 'Setup & Audio', tasks: ['Init Expo + navigation', 'Capture audio', 'Stockage local'] },
      { day: 2, label: 'Transcription', tasks: ['Integration API transcription', 'Affichage texte transcrit', 'Edition manuelle'] },
      { day: 3, label: 'Organisation', tasks: ['Liste des notes + recherche', 'Categories / tags', 'Swipe to delete'] },
      { day: 4, label: 'Sync', tasks: ['Auth Supabase', 'Sync cloud', 'Mode offline'] },
      { day: 5, label: 'Build', tasks: ['UI polish', 'Build iOS + Android (EAS)', 'Test sur device reel'] },
    ],
  },
  {
    project_type: 'app-mobile',
    title: 'App mobile de suivi d\'habitudes',
    summary:
      'Une app pour tracker ses habitudes quotidiennes. Check-in quotidien, streaks, statistiques de progression. Motivante et minimaliste.',
    deliverables: [
      'Creation d\'habitudes personnalisees',
      'Check-in quotidien (tap pour valider)',
      'Streaks et calendrier de progression',
      'Statistiques (taux de completion, tendances)',
      'Build iOS + Android',
    ],
    stack: ['React Native (Expo)', 'Supabase', 'Expo Notifications', 'EAS Build'],
    day_by_day: [
      { day: 1, label: 'Setup & CRUD', tasks: ['Init Expo + navigation', 'Schema DB habitudes/check-ins', 'CRUD habitudes'] },
      { day: 2, label: 'Check-in', tasks: ['Ecran du jour (liste habitudes)', 'Tap pour check-in', 'Animation de validation'] },
      { day: 3, label: 'Streaks', tasks: ['Calcul des streaks', 'Calendrier de progression (heatmap)', 'Notifications de rappel'] },
      { day: 4, label: 'Stats', tasks: ['Taux de completion par habitude', 'Graphique d\'evolution', 'Best streak / record'] },
      { day: 5, label: 'Ship', tasks: ['UI polish + dark mode', 'Build iOS + Android', 'Test sur device'] },
    ],
  },
  {
    project_type: 'app-mobile',
    title: 'App mobile annuaire / carnet d\'adresses pro',
    summary:
      'Un annuaire professionnel mobile pour votre equipe ou communaute. Profils, recherche, favoris, appel/email en un tap. Synchronise avec une base centralisee.',
    deliverables: [
      'Annuaire avec recherche instantanee',
      'Fiches contact detaillees',
      'Favoris + contacts recents',
      'Actions rapides (appel, email, maps)',
      'Build iOS + Android',
    ],
    stack: ['React Native (Expo)', 'Supabase', 'Expo Linking', 'EAS Build'],
    day_by_day: [
      { day: 1, label: 'Setup & Data', tasks: ['Init Expo + navigation', 'Schema DB contacts', 'Import initial contacts'] },
      { day: 2, label: 'Liste & Search', tasks: ['Liste contacts avec avatar', 'Recherche instantanee', 'Tri alphabetique / par equipe'] },
      { day: 3, label: 'Fiches', tasks: ['Fiche contact detaillee', 'Actions rapides (tel, email, maps)', 'Favoris'] },
      { day: 4, label: 'Sync & Offline', tasks: ['Auth Supabase', 'Sync contacts', 'Cache offline'] },
      { day: 5, label: 'Build', tasks: ['UI polish', 'Build iOS + Android', 'Tests'] },
    ],
  },
];
