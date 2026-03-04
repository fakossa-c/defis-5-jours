---
name: export-to-crm
description: Export epic narrative to CRM Client via secure API
installed_path: '{project-root}/_bmad/epic-narrative-formatter/workflows/export-to-crm'
---

# Export to CRM Workflow

Export a transformed epic narrative to the CRM Client via the `/ingest-epic` API endpoint.

## Input

| Parameter | Description | Default |
|-----------|-------------|---------|
| `epic` | Epic number to export | Required |
| `narrative_path` | Path to narrative JSON | `{narrative_output_path}/epic-{epic}-narrative.json` |
| `dry_run` | Preview without sending | `false` |

## Output

- API response (success/error)
- Log entry in `{narrative_output_path}/export-log.txt`

## Prerequisites

Environment variables must be configured:
- `CRM_API_URL` - CRM API base URL
- `CRM_PROJECT_API_KEY` - Project-scoped API key

---

## Steps

### Step 1: Validate Environment

**Action:** Check required environment variables.

```
CHECK CRM_API_URL:
  IF not defined:
    ERROR: "CRM_API_URL is not configured"
    HINT: "Add to .env: CRM_API_URL=http://localhost:54321/functions/v1"
    EXIT

  IF not valid URL:
    ERROR: "CRM_API_URL is not a valid URL: {CRM_API_URL}"
    EXIT

CHECK CRM_PROJECT_API_KEY:
  IF not defined:
    ERROR: "CRM_PROJECT_API_KEY is not configured"
    HINT: "Add to .env: CRM_PROJECT_API_KEY=crm_proj_..."
    HINT: "Get your key from CRM Client: Settings > API"
    EXIT

  IF not matching format "crm_proj_*":
    WARNING: "API key doesn't match expected format (crm_proj_*)"
    PROMPT: "Continue anyway? [y/N]"
```

---

### Step 2: Load Narrative JSON

**Action:** Read the transformed narrative.

```
READ file at {narrative_path}

IF file does not exist:
  ERROR: "Narrative file not found: {narrative_path}"
  HINT: "Run transform-to-narrative first: bmad run epic-narrative-formatter:transform-to-narrative epic={epic}"
  EXIT

PARSE JSON into memory as 'narrative'

VALIDATE narrative has required fields:
  - id
  - title
  - why
  - status
  - stories (non-empty array)
```

---

### Step 3: Prepare Request

**Action:** Build the HTTP request.

```
REQUEST = {
  method: "POST",
  url: "{CRM_API_URL}/ingest-epic",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "{CRM_PROJECT_API_KEY}"
  },
  body: JSON.stringify(narrative)
}
```

---

### Step 4: Dry Run Check

**Action:** If dry run, show what would be sent.

```
IF dry_run == true:
  OUTPUT:
    🔍 DRY RUN - No data will be sent

    📤 Request Preview:
    URL: {REQUEST.url}
    Method: POST
    Headers:
      Content-Type: application/json
      X-API-Key: crm_proj_***{last_4_chars}

    Body:
    {JSON.stringify(narrative, null, 2)}

    To actually send, run without --dry-run

  EXIT with success
```

---

### Step 5: Send Request

**Action:** POST the narrative to CRM.

```
TRY:
  SEND REQUEST with timeout: 30000ms

  STORE response status and body

CATCH network error:
  ERROR: "Network error: {error.message}"
  HINT: "Check that CRM is running at {CRM_API_URL}"
  LOG to export-log.txt: "[{timestamp}] FAILED - Network error: {error}"
  EXIT
```

---

### Step 6: Handle Response

**Action:** Process the API response.

```
SWITCH response.status:

  CASE 200:
    PARSE response.body as JSON

    OUTPUT:
      ✅ Epic {epic} exported successfully!

      📍 CRM URL: {response.body.url}
      🆔 Epic ID: {response.body.epic_id}

    LOG: "[{timestamp}] SUCCESS - Epic {epic} exported to {response.body.url}"

  CASE 401:
    ERROR: "Authentication failed - Invalid or revoked API key"
    HINT: "Check CRM_PROJECT_API_KEY in your .env"
    HINT: "Regenerate key in CRM: Settings > API > Regenerate"
    LOG: "[{timestamp}] FAILED - 401 Unauthorized"
    EXIT

  CASE 422:
    ERROR: "Invalid epic format"
    DETAILS: response.body.error
    HINT: "Check the narrative JSON structure"
    LOG: "[{timestamp}] FAILED - 422 Unprocessable Entity: {response.body.error}"
    EXIT

  CASE 429:
    ERROR: "Rate limit exceeded"
    HINT: "Wait a moment and try again"
    LOG: "[{timestamp}] FAILED - 429 Rate Limited"
    EXIT

  CASE 500:
    ERROR: "CRM server error"
    DETAILS: response.body.error
    HINT: "Try again in a few minutes"
    LOG: "[{timestamp}] FAILED - 500 Server Error: {response.body.error}"
    EXIT

  DEFAULT:
    ERROR: "Unexpected response: {response.status}"
    DETAILS: response.body
    LOG: "[{timestamp}] FAILED - {response.status}: {response.body}"
    EXIT
```

---

### Step 7: Retry Logic

**Action:** Automatic retry for transient failures.

```
IF response.status in [500, 502, 503, 504]:
  FOR attempt in [1, 2, 3]:
    WAIT: attempt * 1000ms (exponential backoff)

    OUTPUT: "Retrying... (attempt {attempt}/3)"

    RETRY request

    IF response.status == 200:
      BREAK and continue to success handling

  IF all retries failed:
    ERROR: "Export failed after 3 attempts"
    LOG: "[{timestamp}] FAILED - All retries exhausted"
    EXIT
```

---

### Step 8: Update Export Log

**Action:** Append to persistent log file.

```
LOG_ENTRY = "[{timestamp}] Epic {epic} - {status} - {details}"

APPEND to: {narrative_output_path}/export-log.txt

IF file doesn't exist:
  CREATE with header:
  "# Epic Narrative Formatter - Export Log\n"
  "# Format: [timestamp] Epic N - STATUS - details\n\n"
```

---

### Step 9: Output Summary

**Action:** Display final results.

```
OUTPUT:
  ═══════════════════════════════════════════
  📤 Export Complete
  ═══════════════════════════════════════════

  Epic: {epic} - {narrative.title}
  Status: ✅ Success

  CRM Details:
  - Project: {extracted_from_url}
  - Epic URL: {response.body.url}

  Next Steps:
  - View in CRM: {CRM_API_URL.replace('/functions/v1', '')}{response.body.url}
  - Export another: bmad run epic-narrative-formatter:export-to-crm epic={N}
  - Sync all: bmad run epic-narrative-formatter:sync-all-epics
```

---

## Error Handling

| Error Code | Message | Solution |
|------------|---------|----------|
| 401 | Invalid API key | Check/regenerate CRM_PROJECT_API_KEY |
| 422 | Invalid format | Verify narrative JSON structure |
| 429 | Rate limited | Wait and retry |
| 500 | Server error | Retry or check CRM logs |
| Network | Connection failed | Verify CRM_API_URL and CRM status |

---

## Security Notes

- API key is sent via `X-API-Key` header (never in URL)
- Key is project-scoped (cannot access other projects)
- Key can be revoked/regenerated in CRM Settings
- Never log the full API key (mask as `crm_proj_***xxxx`)

---

## Example Success Response

```json
{
  "success": true,
  "epic_id": "epic-2",
  "url": "/app/projects/abc-123/epics/epic-2"
}
```

---

## Testing

### Local Development

```bash
# Start local CRM
supabase start

# Set environment
export CRM_API_URL=http://localhost:54321/functions/v1
export CRM_PROJECT_API_KEY=crm_proj_test123...

# Dry run first
bmad run epic-narrative-formatter:export-to-crm epic=2 --dry-run

# Actual export
bmad run epic-narrative-formatter:export-to-crm epic=2
```

### With curl (manual test)

```bash
curl -X POST ${CRM_API_URL}/ingest-epic \
  -H "X-API-Key: ${CRM_PROJECT_API_KEY}" \
  -H "Content-Type: application/json" \
  -d @.bmad-temp/narratives/epic-2-narrative.json
```
