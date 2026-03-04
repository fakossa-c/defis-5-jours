# Epic Narrative Formatter

Transform technical BMAD epics into client-friendly narratives and sync them to CRM Client via secure API.

## Overview

When you're building software using the BMAD methodology, your epics and stories are written in technical language. This module transforms that technical content into client-friendly narratives that explain **what you built** and **why it matters** to your clients.

```
Technical Epic (BMAD)          →          Client Narrative
────────────────────                      ────────────────
"Story 2.1: Login Page                    "Connexion et déconnexion"
& Auth Flow"

"AC: User can authenticate                "Vous pouvez vous connecter
with email/password"                       avec votre email et mot de passe"
```

## Features

- **Parse** BMAD epic files (`epic-list.md`)
- **Transform** technical language to client-friendly narratives
- **Export** to CRM Client via secure project-scoped API
- **Sync** individual epics or all at once
- **Multi-language** support (French, English)
- **Tone options** (Professional, Friendly, Concise)

## Installation

```bash
bmad install epic-narrative-formatter
```

## Quick Start

### 1. Configure your CRM connection

Add to your `.env` file:

```bash
# URL of your CRM instance
CRM_API_URL=http://localhost:54321/functions/v1

# Your project API key (get it from CRM > Settings > API)
CRM_PROJECT_API_KEY=crm_proj_abc123def456xyz789
```

### 2. Sync an epic

```bash
# Sync Epic 2 to CRM
bmad run epic-narrative-formatter:sync-epic epic=2
```

### 3. View in CRM

Open your CRM Client and navigate to your project's epics page.

## Commands

| Command | Description |
|---------|-------------|
| `sync-epic epic=N` | Parse, transform, and export a single epic |
| `sync-all-epics` | Sync all discovered epics |
| `parse-epic epic=N` | Parse epic to metadata JSON |
| `transform-to-narrative epic=N` | Transform metadata to narrative |
| `export-to-crm epic=N` | Export narrative to CRM |

### Examples

```bash
# Full sync of Epic 2
bmad run epic-narrative-formatter:sync-epic epic=2

# Sync all epics
bmad run epic-narrative-formatter:sync-all-epics

# Force re-sync (ignore cache)
bmad run epic-narrative-formatter:sync-epic epic=2 --force

# Local only (don't send to CRM)
bmad run epic-narrative-formatter:sync-epic epic=2 --skip-export

# Sync specific epics
bmad run epic-narrative-formatter:sync-all-epics filter=2,3,5

# Preview without sending
bmad run epic-narrative-formatter:export-to-crm epic=2 --dry-run
```

## Configuration

### module.yaml Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `crm_api_url` | CRM API base URL | `http://localhost:54321/functions/v1` |
| `crm_project_api_key` | Project API key | Required |
| `epic_source_path` | Path to epic-list.md | `{output_folder}/epics/epic-list.md` |
| `narrative_output_path` | Output directory | `.bmad-temp/narratives` |
| `narrative_language` | Output language | `Français` |
| `tone_style` | Narrative tone | `professional` |

### Tone Options

- **Professional** - Reassuring and expert
- **Friendly** - Warm and approachable
- **Concise** - Direct and to the point

## Module Structure

```
epic-narrative-formatter/
├── module.yaml                  # Configuration
├── README.md                    # This file
├── agents/
│   └── narrative-builder.md     # Transformation agent
├── workflows/
│   ├── parse-epic/              # Parse epic-list.md
│   ├── transform-to-narrative/  # Transform to client format
│   ├── export-to-crm/           # Send to CRM API
│   ├── sync-epic/               # Full sync (single)
│   └── sync-all-epics/          # Full sync (all)
├── templates/
│   ├── epic-schema.ts           # Source format schema
│   ├── narrative-schema.ts      # Output format schema
│   └── transformation-guide.md  # Transformation rules
├── config/
│   └── crm-client.yaml          # API configuration
└── docs/
    ├── api-reference.md         # CRM API documentation
    ├── authentication.md        # How to get API keys
    └── examples.md              # Transformation examples
```

## Source Format (BMAD Epic)

Your `epic-list.md` should follow standard BMAD format:

```markdown
## Epic 2: Authentication & User Management
**Goal:** Users can create accounts, authenticate...

**Key Deliverables:**
- Supabase Auth integration
- Profile settings page

### Story 2.1: Login Page & Auth Flow

As a **user**,
I want **to log in with my email and password**,
So that **I can access my dashboard**.

**Acceptance Criteria:**
**Given** I am on the login page
**When** I enter valid credentials
**Then** I am authenticated
```

## Output Format (Narrative)

```json
{
  "id": "epic-2",
  "title": "Authentification et gestion de compte",
  "why": "Pour que vous puissiez accéder à vos projets en toute sécurité...",
  "status": "completed",
  "progress": { "completed": 11, "total": 11, "percentage": 100 },
  "stories": [
    {
      "id": "story-2.1",
      "title": "Connexion et déconnexion",
      "description": "Page de connexion sécurisée...",
      "status": "completed"
    }
  ],
  "insights": [
    {
      "type": "success",
      "title": "Sécurité renforcée",
      "description": "Tests automatisés garantissent la fiabilité."
    }
  ]
}
```

## Troubleshooting

### "API key invalid"

1. Verify `CRM_PROJECT_API_KEY` in your `.env`
2. Check the key in CRM: Settings > API
3. Regenerate if compromised

### "Epic not found"

1. Verify `_bmad-output/epics/epic-list.md` exists
2. Check epic number format: `## Epic N:`
3. Run `bmad run epic-narrative-formatter:sync-all-epics` to see available epics

### "Network error"

1. Verify `CRM_API_URL` is correct
2. Check CRM is running (`supabase status`)
3. Test with curl: `curl ${CRM_API_URL}/health`

## Security

- **API keys are project-scoped** - cannot access other projects
- **Never commit `.env`** - add to `.gitignore`
- **Keys can be revoked** - regenerate in CRM Settings
- **HTTPS in production** - always use secure connections

## Documentation

- [API Reference](docs/api-reference.md) - Endpoint documentation
- [Authentication](docs/authentication.md) - Getting API keys
- [Examples](docs/examples.md) - Transformation examples

## Requirements

- BMAD Core installed
- CRM Client with API enabled
- Environment variables configured

## License

MIT

## Author

Created with BMAD Module Builder
