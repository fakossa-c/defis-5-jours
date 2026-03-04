# Transformation Guide

Rules and patterns for transforming technical BMAD epics into client-friendly narratives.

---

## Core Principles

### 1. Client-First Language
- **DO:** "Vous pouvez maintenant..."
- **DON'T:** "L'utilisateur peut..."

### 2. Benefits Over Features
- **DO:** "Accès sécurisé à votre espace personnel"
- **DON'T:** "Système d'authentification JWT implémenté"

### 3. Faithful Reformulation
- **DO:** Transform the meaning, keep the facts
- **DON'T:** Invent features or exaggerate benefits

### 4. Appropriate Tone
- **Professional:** Reassuring, expert, trustworthy
- **Friendly:** Warm, approachable, encouraging
- **Concise:** Direct, efficient, no fluff

---

## Story Title Transformations

### Authentication & Security
| Technical | Client-Friendly (FR) |
|-----------|---------------------|
| Login Page & Auth Flow | Connexion et déconnexion |
| User Registration | Création de votre compte |
| Password Reset Flow | Récupération de mot de passe |
| Two-Factor Authentication | Double sécurité pour votre compte |
| Session Management | Gestion de vos connexions |
| OAuth Integration | Connexion avec Google/GitHub |
| JWT Token Refresh | Connexion persistante |
| Role-Based Access Control | Gestion des permissions |

### Profile & Settings
| Technical | Client-Friendly (FR) |
|-----------|---------------------|
| Profile Settings Page | Gestion de votre profil |
| Avatar Upload | Photo de profil personnalisée |
| Password Change | Modification du mot de passe |
| Email Preferences | Préférences de communication |
| Account Deletion | Suppression de compte |
| Notification Settings | Paramètres de notifications |
| Theme Customization | Personnalisation de l'apparence |
| Language Settings | Choix de la langue |

### Data & Content
| Technical | Client-Friendly (FR) |
|-----------|---------------------|
| CRUD Operations | Gestion complète de vos données |
| Data Export | Export de vos informations |
| File Upload | Ajout de fichiers |
| Search & Filter | Recherche et filtres |
| Pagination | Navigation dans les listes |
| Sorting | Tri des résultats |
| Bulk Actions | Actions groupées |
| Data Import | Import de données |

### Project Management
| Technical | Client-Friendly (FR) |
|-----------|---------------------|
| Project Create/Edit | Création et modification de projets |
| Dashboard Overview | Vue d'ensemble de votre activité |
| Status Tracking | Suivi de l'avancement |
| Member Management | Gestion des collaborateurs |
| Document Management | Organisation des documents |
| Timeline View | Vue chronologique |
| Kanban Board | Tableau de suivi visuel |

---

## Technical Term Glossary

### Replace Always
| Technical Term | Client-Friendly |
|---------------|-----------------|
| API | interface de communication |
| endpoint | point d'accès |
| database | base de données |
| query | recherche |
| schema | structure |
| migration | mise à jour |
| deployment | mise en ligne |
| authentication | identification |
| authorization | contrôle d'accès |
| session | connexion |
| token | clé d'accès |
| middleware | traitement |
| validation | vérification |
| cache | mémoire temporaire |
| webhook | notification automatique |
| CRUD | gestion complète |

### Omit Completely
These terms should NOT appear in client narratives:
- Framework names (React, Vue, Angular, Supabase)
- Programming languages (TypeScript, JavaScript, Python)
- Library names (Zod, TanStack Query, shadcn)
- File paths and names
- Function/variable names
- CSS classes
- HTTP methods (GET, POST, PUT, DELETE)
- Database terms (SQL, PostgreSQL, table, column)
- Test terminology (unit test, coverage, mock)
- Architecture patterns (Result pattern, DRY, SOLID)

### Simplify When Mentioned
| Technical | Simplified |
|-----------|------------|
| 395 tests passing | Tests automatisés garantissent la qualité |
| 100% test coverage | Code entièrement vérifié |
| TDD discipline | Développement rigoureux |
| CI/CD pipeline | Déploiement automatisé |
| Error boundaries | Gestion élégante des erreurs |
| Responsive design | Adapté à tous les écrans |
| Accessibility (a11y) | Accessible à tous |
| Performance optimization | Application rapide et fluide |

---

## Acceptance Criteria Transformations

### Pattern: "User can X" → "Vous pouvez X"
| Technical AC | Client-Friendly |
|-------------|-----------------|
| User can authenticate with email/password | Vous pouvez vous connecter avec votre email et mot de passe |
| User can reset password via email | Vous pouvez récupérer votre mot de passe par email |
| User can update profile information | Vous pouvez modifier vos informations personnelles |
| User can delete account | Vous pouvez supprimer votre compte à tout moment |
| User can export data | Vous pouvez télécharger toutes vos données |

### Pattern: "System does X" → Passive benefit
| Technical AC | Client-Friendly |
|-------------|-----------------|
| System validates input | Vos informations sont vérifiées automatiquement |
| System sends confirmation email | Un email de confirmation vous est envoyé |
| System persists session | Vous restez connecté entre les visites |
| System enforces permissions | Vos données restent privées et sécurisées |
| System logs errors | Les problèmes sont détectés automatiquement |

### Pattern: Given/When/Then → Simple benefit
```
TECHNICAL:
Given I am on the login page
When I enter valid credentials and submit
Then I am authenticated and redirected to dashboard

CLIENT-FRIENDLY:
"Connexion simple et rapide vers votre tableau de bord"
```

---

## Epic Goal Transformations

### Structure
```
TECHNICAL:
"Users can create accounts, authenticate, manage their profiles,
and the system enforces role-based permissions."

CLIENT-FRIENDLY:
"Pour que vous puissiez accéder à vos projets en toute sécurité
et gérer vos informations personnelles, nous avons construit
un système d'authentification complet."
```

### Template
```
Pour que vous puissiez [BENEFIT],
nous avons [ACTION/BUILT].
[OPTIONAL: Additional reassurance]
```

### Examples
| Epic Type | Transformation |
|-----------|---------------|
| Authentication | Pour que vous puissiez accéder en toute sécurité à votre espace... |
| Dashboard | Pour que vous ayez une vue claire de votre activité... |
| Settings | Pour que vous puissiez personnaliser votre expérience... |
| Collaboration | Pour faciliter le travail en équipe sur vos projets... |
| Reporting | Pour que vous puissiez suivre et analyser vos résultats... |

---

## Retrospective → Insights

### Success Insights
| Retrospective Item | Client Insight |
|-------------------|----------------|
| TDD discipline established | Tests automatisés garantissent la fiabilité |
| Result pattern consistency | Architecture robuste et évolutive |
| 100% component coverage | Interface utilisateur soigneusement vérifiée |
| Performance benchmarks met | Application rapide et réactive |
| Zero security vulnerabilities | Sécurité renforcée à chaque étape |

### Milestone Insights
| Retrospective Item | Client Insight |
|-------------------|----------------|
| First complete feature shipped | Première fonctionnalité livrée |
| All core flows working | Parcours principaux opérationnels |
| Ready for user testing | Prêt pour vos premiers tests |
| Production deployment | Disponible en ligne |

### Learning Insights (Optional - use sparingly)
| Retrospective Item | Client Insight |
|-------------------|----------------|
| Started with architecture decisions | Fondations solides pour l'avenir |
| Integrated design early | Design et technique alignés dès le départ |

---

## JSON Output Schema

```typescript
interface EpicNarrative {
  id: string;                    // "epic-2"
  title: string;                 // Client-friendly title
  why: string;                   // Business value explanation
  status: "completed" | "in_progress" | "planned";
  deliveryDate: string | null;   // "YYYY-MM-DD" or null
  progress: {
    completed: number;
    total: number;
    percentage: number;          // 0-100
  };
  stories: StoryNarrative[];
  insights: Insight[];
  meta?: {
    sourceEpic: number;
    transformedAt: string;       // ISO timestamp
    transformedBy: string;       // "epic-narrative-formatter"
    language: string;            // "Français"
    tone: string;                // "professional"
  };
}

interface StoryNarrative {
  id: string;                    // "story-2.1"
  title: string;                 // Client-friendly title
  description: string;           // What it means for client
  status: "completed" | "in_progress" | "planned";
}

interface Insight {
  type: "success" | "learning" | "milestone";
  title: string;                 // Short title
  description: string;           // Client explanation
}
```

---

## Quality Checklist

Before finalizing a narrative, verify:

- [ ] **No technical jargon** - All terms from "Omit Completely" list removed
- [ ] **Uses "vous"** - Never "l'utilisateur" or "the user"
- [ ] **Benefits focus** - What client can DO, not how it's built
- [ ] **Appropriate tone** - Matches configured tone_style
- [ ] **Correct language** - Matches configured narrative_language
- [ ] **Valid JSON** - Parses without errors
- [ ] **Complete structure** - All required fields present
- [ ] **Accurate progress** - Percentages calculated correctly
- [ ] **Faithful content** - No invented features or exaggerations
