---
name: transform-to-narrative
description: Transform technical epic metadata into client-friendly narrative using the narrative-builder agent
installed_path: '{project-root}/_bmad/epic-narrative-formatter/workflows/transform-to-narrative'
---

# Transform to Narrative Workflow

Transform parsed epic metadata into a client-friendly narrative JSON using the narrative-builder agent.

## Input

| Parameter | Description | Default |
|-----------|-------------|---------|
| `epic` | Epic number to transform | Required |
| `metadata_path` | Path to metadata JSON | `{narrative_output_path}/epic-{epic}-metadata.json` |

## Output

- File: `{narrative_output_path}/epic-{epic}-narrative.json`

---

## Steps

### Step 1: Load Epic Metadata

**Action:** Read the parsed metadata from previous workflow.

```
READ file at {metadata_path}

IF file does not exist:
  ERROR: "Metadata file not found: {metadata_path}"
  HINT: "Run parse-epic workflow first: bmad run epic-narrative-formatter:parse-epic epic={epic}"
  EXIT

PARSE JSON into memory as 'metadata'
```

---

### Step 2: Load Transformation Guide

**Action:** Load transformation rules for consistent output.

```
READ file: {project-root}/_bmad/epic-narrative-formatter/templates/transformation-guide.md

STORE rules in memory for agent reference
```

---

### Step 3: Prepare Agent Context

**Action:** Build the context for narrative-builder agent.

```
CONTEXT = {
  "epicMetadata": metadata,
  "transformationRules": loaded rules,
  "outputLanguage": {narrative_language},
  "toneStyle": {tone_style},
  "hasRetrospective": metadata.retrospective.available
}
```

---

### Step 4: Invoke Narrative-Builder Agent

**Action:** Use the agent to perform the transformation.

**Agent Prompt:**
```
Transform this technical epic into a client-friendly narrative.

## Epic Metadata (Technical)
{JSON.stringify(metadata, null, 2)}

## Transformation Requirements

1. **Title**: Transform "{metadata.title}" to client-friendly French
   - Remove technical terms
   - Focus on user benefit
   - Example: "Authentication & User Management" → "Authentification et gestion de compte"

2. **Why Statement**: Rewrite the goal as a "why" explaining business value
   - Start with "Pour que vous puissiez..." or similar
   - Focus on what the CLIENT can now DO
   - Avoid technical implementation details

3. **Stories**: Transform each story
   - Title: Technical action → Client benefit
   - Description: What this MEANS for the client
   - Status: Keep from metadata

4. **Insights** (if retrospective available):
   - Transform technical achievements into quality assurances
   - "TDD discipline" → "Tests automatisés garantissent la fiabilité"
   - "Result pattern" → "Architecture robuste et maintenable"

5. **Progress**: Calculate from story statuses
   - Count completed/total
   - Calculate percentage

## Output Format
Return ONLY valid JSON matching this schema:
{
  "id": "epic-{N}",
  "title": "Client-friendly title in French",
  "why": "Business value explanation using 'vous'",
  "status": "completed|in_progress|planned",
  "deliveryDate": "YYYY-MM-DD or null",
  "progress": {
    "completed": N,
    "total": N,
    "percentage": N
  },
  "stories": [...],
  "insights": [...]
}
```

---

### Step 5: Validate Agent Output

**Action:** Ensure the narrative is valid and client-appropriate.

```
PARSE agent response as JSON

VALIDATE structure:
  - [ ] id matches "epic-{N}" format
  - [ ] title is non-empty string
  - [ ] why is non-empty string
  - [ ] status is one of: completed, in_progress, planned
  - [ ] progress.completed <= progress.total
  - [ ] progress.percentage == (completed/total)*100
  - [ ] stories is non-empty array
  - [ ] each story has id, title, description, status

IF validation fails:
  LOG validation errors
  RETRY agent with specific feedback (max 1 retry)
  IF still fails:
    ERROR: "Transformation failed validation"
    OUTPUT: validation errors
    EXIT
```

---

### Step 6: Quality Check - No Technical Jargon

**Action:** Scan for technical terms that shouldn't appear in client narrative.

```
FORBIDDEN_TERMS = [
  "API", "endpoint", "database", "migration", "deployment",
  "authentication", "authorization", "token", "session",
  "middleware", "query", "schema", "validation", "component",
  "React", "Supabase", "PostgreSQL", "TypeScript", "Zod",
  "CRUD", "REST", "JSON", "HTTP", "GET", "POST"
]

FOR each term in FORBIDDEN_TERMS:
  IF term found in narrative (case-insensitive):
    WARNING: "Technical term found: '{term}'"
    SUGGEST: replacement from transformation guide

IF warnings > 0:
  PROMPT: "Technical terms detected. Auto-fix? [Y/n]"
  IF yes:
    APPLY suggested replacements
```

---

### Step 7: Ensure French Language

**Action:** Verify narrative is in correct language.

```
IF {narrative_language} == "Français":
  CHECK that narrative does NOT contain:
    - "you can" (should be "vous pouvez")
    - "your project" (should be "votre projet")
    - Common English phrases

  IF English detected:
    WARNING: "English text detected in French narrative"
    AUTO-TRANSLATE affected sections
```

---

### Step 8: Add Metadata

**Action:** Add transformation metadata to output.

```
narrative.meta = {
  "sourceEpic": metadata.epicNumber,
  "transformedAt": new Date().toISOString(),
  "transformedBy": "epic-narrative-formatter",
  "language": {narrative_language},
  "tone": {tone_style}
}
```

---

### Step 9: Save Narrative JSON

**Action:** Write the final narrative to file.

```
ENSURE directory exists: {narrative_output_path}

WRITE JSON to: {narrative_output_path}/epic-{epic}-narrative.json

FORMAT: Pretty-print with 2-space indentation
```

---

### Step 10: Output Summary

**Action:** Display transformation results.

```
OUTPUT:
  ✅ Epic {epic} transformed successfully
  📄 Narrative saved to: {narrative_output_path}/epic-{epic}-narrative.json

  📊 Summary:
  - Title: {narrative.title}
  - Stories: {narrative.stories.length}
  - Progress: {narrative.progress.percentage}%
  - Insights: {narrative.insights.length}

  🔍 Quality:
  - Technical terms: {warnings_count} detected and fixed
  - Language: {narrative_language} ✓
  - Tone: {tone_style} ✓
```

---

## Error Handling

| Error | Message | Solution |
|-------|---------|----------|
| Metadata not found | "Run parse-epic first" | Execute parse workflow |
| Agent timeout | "Transformation timed out" | Retry or simplify epic |
| Invalid JSON | "Agent returned invalid JSON" | Check agent response |
| Validation failed | "Missing required fields" | Review agent prompt |

---

## Example Output

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
      "description": "Page de connexion sécurisée avec email et mot de passe, redirection automatique vers votre tableau de bord",
      "status": "completed"
    }
  ],
  "insights": [
    {
      "type": "success",
      "title": "Sécurité renforcée",
      "description": "Tests automatisés garantissent que seuls les utilisateurs authentifiés accèdent à leurs données."
    }
  ],
  "meta": {
    "sourceEpic": 2,
    "transformedAt": "2026-01-19T14:45:00Z",
    "transformedBy": "epic-narrative-formatter",
    "language": "Français",
    "tone": "professional"
  }
}
```

---

## Next Step

After successful transformation, export to CRM:

```bash
bmad run epic-narrative-formatter:export-to-crm epic={N}
```
