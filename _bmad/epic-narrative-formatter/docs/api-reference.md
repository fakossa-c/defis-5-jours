# API Reference - CRM Client

Complete API documentation for the epic-narrative-formatter module.

## Base URL

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:54321/functions/v1` |
| Staging | `https://staging.your-crm.app/functions/v1` |
| Production | `https://your-crm.app/functions/v1` |

## Authentication

All requests require a project-scoped API key in the header:

```http
X-API-Key: crm_proj_abc123def456xyz789
```

See [Authentication Guide](authentication.md) for how to obtain a key.

---

## Endpoints

### POST /ingest-epic

Create or update an epic narrative in the CRM.

#### Request

```http
POST /functions/v1/ingest-epic
Content-Type: application/json
X-API-Key: crm_proj_abc123...
```

#### Body

```json
{
  "id": "epic-2",
  "title": "Authentification et gestion de compte",
  "why": "Pour que vous puissiez accéder à vos projets en toute sécurité...",
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
      "description": "Page de connexion sécurisée avec email et mot de passe",
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

#### Response (200 OK)

```json
{
  "success": true,
  "epic_id": "epic-2",
  "url": "/app/projects/abc-123/epics/epic-2"
}
```

#### Error Responses

| Code | Response | Cause |
|------|----------|-------|
| 401 | `{"error": "Missing API key"}` | No X-API-Key header |
| 401 | `{"error": "Invalid or revoked API key"}` | Wrong or revoked key |
| 422 | `{"error": "Invalid epic format"}` | Missing required fields |
| 429 | `{"error": "Rate limit exceeded"}` | Too many requests |
| 500 | `{"error": "Server error message"}` | Internal error |

---

## Request Schema

### EpicNarrative

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Epic ID (format: `epic-N`) |
| `title` | string | Yes | Client-friendly title |
| `why` | string | Yes | Business value explanation |
| `status` | enum | Yes | `completed`, `in_progress`, `planned` |
| `deliveryDate` | string/null | No | ISO date (YYYY-MM-DD) |
| `progress` | object | Yes | Progress tracking |
| `stories` | array | Yes | Story narratives |
| `insights` | array | No | Optional insights |

### Progress

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `completed` | integer | Yes | Completed stories |
| `total` | integer | Yes | Total stories |
| `percentage` | integer | Yes | 0-100 |

### StoryNarrative

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Story ID (format: `story-N.M`) |
| `title` | string | Yes | Client-friendly title |
| `description` | string | Yes | What it means for client |
| `status` | enum | Yes | `completed`, `in_progress`, `planned` |

### Insight

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | enum | Yes | `success`, `learning`, `milestone` |
| `title` | string | Yes | Short title |
| `description` | string | Yes | Client explanation |

---

## Rate Limiting

- **100 requests per minute** per API key
- 429 response when exceeded
- Retry after delay

---

## Examples

### Minimal Epic

```json
{
  "id": "epic-1",
  "title": "Fondations du projet",
  "why": "Pour démarrer sur des bases solides.",
  "status": "completed",
  "progress": { "completed": 3, "total": 3, "percentage": 100 },
  "stories": [
    {
      "id": "story-1.1",
      "title": "Structure initiale",
      "description": "Mise en place de l'architecture de base",
      "status": "completed"
    }
  ]
}
```

### Full Epic with Insights

```json
{
  "id": "epic-2",
  "title": "Authentification et gestion de compte",
  "why": "Pour que vous puissiez accéder à vos projets en toute sécurité et gérer vos informations personnelles.",
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
      "description": "Page de connexion sécurisée avec email et mot de passe",
      "status": "completed"
    },
    {
      "id": "story-2.2",
      "title": "Gestion de votre profil",
      "description": "Modifiez vos informations personnelles à tout moment",
      "status": "completed"
    }
  ],
  "insights": [
    {
      "type": "success",
      "title": "Sécurité renforcée",
      "description": "Tests automatisés garantissent que seuls les utilisateurs authentifiés accèdent à leurs données."
    },
    {
      "type": "milestone",
      "title": "Première version livrée",
      "description": "L'authentification complète est maintenant disponible."
    }
  ]
}
```

---

## Testing

### With curl

```bash
# Set environment variables
export CRM_API_URL=http://localhost:54321/functions/v1
export CRM_PROJECT_API_KEY=crm_proj_abc123...

# Test the endpoint
curl -X POST ${CRM_API_URL}/ingest-epic \
  -H "X-API-Key: ${CRM_PROJECT_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "epic-test",
    "title": "Test Epic",
    "why": "Pour valider l'\''intégration",
    "status": "planned",
    "progress": { "completed": 0, "total": 1, "percentage": 0 },
    "stories": [
      {
        "id": "story-test.1",
        "title": "Test Story",
        "description": "Description de test",
        "status": "planned"
      }
    ]
  }'
```

### Expected Response

```json
{
  "success": true,
  "epic_id": "epic-test",
  "url": "/app/projects/your-project/epics/epic-test"
}
```

---

## Error Handling

### Recommended Retry Strategy

```
On 5xx error:
  1. Wait 1 second
  2. Retry
  3. Wait 2 seconds
  4. Retry
  5. Wait 4 seconds
  6. Retry
  7. Fail with error
```

### Non-Retryable Errors

- 401 (authentication) - fix credentials
- 422 (validation) - fix request body
- 429 (rate limit) - wait and respect limits
