# Transformation Examples

Real-world examples of technical epic transformations to client-friendly narratives.

---

## Example 1: Authentication Epic

### Source (BMAD Technical)

```markdown
## Epic 2: Authentication & User Management
**Goal:** Users can create accounts, authenticate, manage their profiles, and the system enforces role-based permissions.

**FRs covered:** FR12, FR38-FR45b, FR63-FR66 (16 FRs)

**Key Deliverables:**
- Supabase Auth integration (email/password)
- Profile settings page (password, email, avatar, preferences)
- Account deletion flow (soft delete + 30-day cascade)
- RBAC enforcement (admin/client roles)

### Story 2.1: Login Page & Auth Flow

As a **user**,
I want **to log in with my email and password**,
So that **I can access my dashboard and projects**.

**Acceptance Criteria:**
**Given** I am on the login page (`/auth/login`)
**When** I enter valid credentials and submit
**Then** I am authenticated and redirected to `/app/dashboard`
**And** my session is persisted (survives page refresh)

**Technical Notes:**
- FR12 compliance
- Use shadcn/ui `Input`, `Button`, `Card` components
- Create `src/pages/auth/Login.tsx`
- Zod schema for form validation

### Story 2.2: Profile Settings Page

As a **user**,
I want **to view and edit my profile information**,
So that **I can keep my account up-to-date**.

**Acceptance Criteria:**
**Given** I am on the profile settings page
**When** I modify my display name and save
**Then** changes are persisted to my profile
```

### Output (Client Narrative)

```json
{
  "id": "epic-2",
  "title": "Authentification et gestion de compte",
  "why": "Pour que vous puissiez accéder à vos projets en toute sécurité et gérer vos informations personnelles, nous avons construit un système d'authentification complet.",
  "status": "completed",
  "deliveryDate": "2026-01-03",
  "progress": {
    "completed": 11,
    "total": 11,
    "percentage": 100
  },
  "stories": [
    {
      "id": "story-2.1",
      "title": "Connexion et déconnexion",
      "description": "Page de connexion sécurisée avec email et mot de passe, redirection automatique vers votre tableau de bord. Vous restez connecté même après avoir fermé le navigateur.",
      "status": "completed"
    },
    {
      "id": "story-2.2",
      "title": "Gestion de votre profil",
      "description": "Modifiez votre nom, email et autres informations personnelles à tout moment. Vos changements sont sauvegardés automatiquement.",
      "status": "completed"
    }
  ],
  "insights": [
    {
      "type": "success",
      "title": "Sécurité renforcée dès le départ",
      "description": "L'authentification a été construite avec des tests automatisés qui garantissent que seuls les utilisateurs autorisés accèdent à leurs données."
    }
  ]
}
```

---

## Example 2: Project Management Epic

### Source (BMAD Technical)

```markdown
## Epic 3: Project CRUD & Navigation
**Goal:** Admin users can create, view, edit, and delete projects with proper validation and navigation.

**Key Deliverables:**
- Project list with pagination and filtering
- Project create/edit forms with Zod validation
- Confirmation dialogs for destructive actions
- Breadcrumb navigation

### Story 3.1: Project List Page

As an **admin**,
I want **to see all my projects in a list**,
So that **I can quickly find and manage them**.

**Technical Notes:**
- TanStack Query for data fetching
- Implement pagination (10 per page)
- Add search filter by name
```

### Output (Client Narrative)

```json
{
  "id": "epic-3",
  "title": "Gestion de vos projets",
  "why": "Pour vous permettre de créer, organiser et suivre tous vos projets clients depuis un tableau de bord centralisé.",
  "status": "completed",
  "progress": {
    "completed": 8,
    "total": 8,
    "percentage": 100
  },
  "stories": [
    {
      "id": "story-3.1",
      "title": "Vue d'ensemble de vos projets",
      "description": "Consultez tous vos projets dans une liste claire avec recherche et navigation entre les pages.",
      "status": "completed"
    }
  ],
  "insights": [
    {
      "type": "milestone",
      "title": "Navigation fluide",
      "description": "Vous pouvez maintenant accéder à n'importe quel projet en quelques clics."
    }
  ]
}
```

---

## Example 3: In-Progress Epic

### Source (BMAD Technical)

```markdown
## Epic 5: Client Documentation Portal
**Goal:** Clients can access project documentation in a structured, navigable format.

### Story 5.1: Document Tree Navigation
Status: completed

### Story 5.2: Document Viewer
Status: in_progress

### Story 5.3: Document Search
Status: planned
```

### Output (Client Narrative)

```json
{
  "id": "epic-5",
  "title": "Portail de documentation",
  "why": "Pour que vous ayez accès à toute la documentation de votre projet, organisée et facile à naviguer.",
  "status": "in_progress",
  "deliveryDate": null,
  "progress": {
    "completed": 1,
    "total": 3,
    "percentage": 33
  },
  "stories": [
    {
      "id": "story-5.1",
      "title": "Navigation dans vos documents",
      "description": "Parcourez tous vos documents grâce à une arborescence claire et intuitive.",
      "status": "completed"
    },
    {
      "id": "story-5.2",
      "title": "Visualisation des documents",
      "description": "Lisez vos documents directement dans l'application, formatés pour une lecture agréable.",
      "status": "in_progress"
    },
    {
      "id": "story-5.3",
      "title": "Recherche dans la documentation",
      "description": "Trouvez rapidement l'information dont vous avez besoin grâce à la recherche.",
      "status": "planned"
    }
  ]
}
```

---

## Transformation Patterns

### Technical Title → Client Benefit

| Technical | Client-Friendly |
|-----------|----------------|
| Login Page & Auth Flow | Connexion et déconnexion |
| CRUD Operations | Gestion complète de vos données |
| API Integration | Connexion avec vos outils |
| Database Migration | Mise à jour automatique |
| Error Handling | Messages clairs en cas de problème |
| Responsive Design | Adapté à tous vos appareils |
| Performance Optimization | Application rapide et fluide |

### Technical Goal → Business Value (Why)

| Technical | Client-Friendly |
|-----------|----------------|
| "Users can authenticate..." | "Pour que vous puissiez accéder en toute sécurité..." |
| "Admin can manage..." | "Pour vous permettre de gérer facilement..." |
| "System validates..." | "Pour garantir la qualité de vos données..." |
| "Data is persisted..." | "Pour que vos informations soient toujours disponibles..." |

### Acceptance Criteria → Benefit Statement

| Technical AC | Client Description |
|--------------|-------------------|
| "User can log in with email/password" | "Connexion simple avec votre email" |
| "Session persists across refresh" | "Vous restez connecté entre les visites" |
| "Data is validated before save" | "Vos informations sont vérifiées automatiquement" |
| "Confirmation dialog shown" | "Une confirmation vous protège des erreurs" |

---

## Status Mapping

| Technical Status | Narrative Status | Visual |
|-----------------|------------------|--------|
| Story merged/deployed | `completed` | ✅ |
| Story in PR/review | `in_progress` | 🔄 |
| Story in backlog | `planned` | 📋 |

Epic status is derived from stories:
- All completed → `completed`
- Any in_progress → `in_progress`
- All planned → `planned`

---

## Insight Types

### Success
Technical achievements that reassure the client:
```json
{
  "type": "success",
  "title": "Sécurité renforcée",
  "description": "Tests automatisés vérifient chaque fonctionnalité."
}
```

### Milestone
Key delivery points:
```json
{
  "type": "milestone",
  "title": "Première version livrée",
  "description": "L'authentification complète est maintenant disponible."
}
```

### Learning (Use sparingly)
Only when it benefits the client to know:
```json
{
  "type": "learning",
  "title": "Architecture évolutive",
  "description": "Les fondations permettent d'ajouter facilement de nouvelles fonctionnalités."
}
```
