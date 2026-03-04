---
name: parse-epic
description: Parse epic-list.md and extract structured metadata for transformation
installed_path: '{project-root}/_bmad/epic-narrative-formatter/workflows/parse-epic'
---

# Parse Epic Workflow

Parse a BMAD epic file and extract structured metadata for narrative transformation.

## Input

| Parameter | Description | Default |
|-----------|-------------|---------|
| `epic` | Epic number to extract (e.g., 2) | Required |
| `source` | Path to epic-list.md | `{epic_source_path}` |

## Output

- File: `{narrative_output_path}/epic-{num}-metadata.json`

---

## Steps

### Step 1: Validate Input

**Action:** Verify the epic number is provided and valid.

```
IF epic parameter is missing:
  ERROR: "Please specify an epic number. Example: epic=2"
  EXIT

IF epic is not a positive integer:
  ERROR: "Epic number must be a positive integer. Got: {epic}"
  EXIT
```

---

### Step 2: Read Epic Source File

**Action:** Load the BMAD epic file.

```
READ file at {source}

IF file does not exist:
  ERROR: "Epic source file not found at: {source}"
  HINT: "Check your epic_source_path configuration in module.yaml"
  EXIT
```

---

### Step 3: Find Epic Section

**Action:** Locate the specified epic in the markdown.

```
SEARCH for pattern: "## Epic {epic}:" or "## Epic {epic} -"

IF not found:
  ERROR: "Epic {epic} not found in {source}"
  AVAILABLE: List all epic numbers found in file
  EXIT

EXTRACT epic section from header to next "## Epic" or end of file
```

---

### Step 4: Parse Epic Header

**Action:** Extract epic metadata from the header section.

```
EXTRACT:
  - title: Text after "Epic {N}:" (e.g., "Authentication & User Management")
  - goal: Text after "**Goal:**" until next section
  - frs_covered: Text after "**FRs covered:**" (optional)
  - deliverables: List items under "**Key Deliverables:**"
```

**Expected structure:**
```markdown
## Epic 2: Authentication & User Management
**Goal:** Users can create accounts, authenticate, manage their profiles...

**FRs covered:** FR12, FR38-FR45b, FR63-FR66 (16 FRs)

**Key Deliverables:**
- Supabase Auth integration (email/password)
- Profile settings page
- Account deletion flow
- RBAC enforcement
```

---

### Step 5: Parse Stories

**Action:** Extract all stories within the epic.

```
FOR each "### Story {epic}.{N}:" section:
  EXTRACT:
    - number: Story number (e.g., "2.1", "2.2")
    - title: Text after story number
    - user_story: "As a **user**, I want **...**, So that **...**"
    - acceptance_criteria: All "**Given/When/Then**" blocks
    - technical_notes: Text after "**Technical Notes:**" (optional)
    - status: Infer from context or default to "planned"
```

**Expected structure:**
```markdown
### Story 2.1: Login Page & Auth Flow

As a **user**,
I want **to log in with my email and password**,
So that **I can access my dashboard and projects**.

**Acceptance Criteria:**

**Given** I am on the login page (`/auth/login`)
**When** I enter valid credentials and submit
**Then** I am authenticated and redirected to `/app/dashboard`

**Technical Notes:**
- FR12 compliance
- Use shadcn/ui components
```

---

### Step 6: Check for Retrospective

**Action:** Look for an associated retrospective file.

```
CHECK for file: {retrospective_path}/epic-{epic}-retrospective.md

IF exists:
  EXTRACT:
    - what_went_well: List from "## What Went Well" section
    - lessons_learned: List from "## Lessons Learned" section
    - metrics: Any numbers (tests passing, coverage, etc.)

  SET has_retrospective = true
ELSE:
  SET has_retrospective = false
```

---

### Step 7: Check Sprint Status

**Action:** Look for story status in sprint-status.yaml.

```
CHECK for file: {retrospective_path}/sprint-status.yaml

IF exists:
  FOR each story in parsed stories:
    SEARCH for story number in sprint-status.yaml
    IF found:
      UPDATE story.status from yaml status
```

---

### Step 8: Validate Structure

**Action:** Ensure all required fields are present.

```
VALIDATE:
  - [ ] Epic title exists and is non-empty
  - [ ] Epic goal exists and is non-empty
  - [ ] At least one story exists
  - [ ] Each story has title
  - [ ] Each story has acceptance criteria OR user story

IF validation fails:
  ERROR: List missing/invalid fields
  EXIT
```

---

### Step 9: Build Metadata JSON

**Action:** Construct the structured output.

```json
{
  "epicNumber": 2,
  "title": "Authentication & User Management",
  "goal": "Users can create accounts, authenticate, manage their profiles, and the system enforces role-based permissions.",
  "frs_covered": "FR12, FR38-FR45b, FR63-FR66 (16 FRs)",
  "deliverables": [
    "Supabase Auth integration (email/password)",
    "Profile settings page (password, email, avatar, preferences)",
    "Account deletion flow (soft delete + 30-day cascade)",
    "RBAC enforcement (admin/client roles)"
  ],
  "stories": [
    {
      "number": "2.1",
      "title": "Login Page & Auth Flow",
      "userStory": {
        "role": "user",
        "want": "to log in with my email and password",
        "soThat": "I can access my dashboard and projects"
      },
      "acceptanceCriteria": [
        "Given I am on the login page (/auth/login), When I enter valid credentials and submit, Then I am authenticated and redirected to /app/dashboard"
      ],
      "technicalNotes": "FR12 compliance, Use shadcn/ui Input, Button, Card components",
      "status": "completed"
    }
  ],
  "retrospective": {
    "available": true,
    "whatWentWell": ["TDD discipline was established", "Result pattern consistency"],
    "lessonsLearned": ["Start with core architecture decisions"],
    "metrics": {"tests": 395, "coverage": "high"}
  },
  "parsedAt": "2026-01-19T14:30:00Z"
}
```

---

### Step 10: Save Output

**Action:** Write metadata to output file.

```
ENSURE directory exists: {narrative_output_path}

WRITE JSON to: {narrative_output_path}/epic-{epic}-metadata.json

OUTPUT:
  ✅ Epic {epic} parsed successfully
  📄 Metadata saved to: {narrative_output_path}/epic-{epic}-metadata.json
  📊 Stories found: {story_count}
  📝 Retrospective: {has_retrospective ? "Available" : "Not found"}
```

---

## Error Handling

| Error | Message | Solution |
|-------|---------|----------|
| Epic not found | "Epic {N} not found" | Check epic number, list available epics |
| File not found | "Source file not found" | Verify epic_source_path in config |
| Parse error | "Failed to parse at line {N}" | Check markdown format |
| Missing fields | "Missing required: {fields}" | Add missing content to epic |

---

## Next Step

After successful parsing, run the transform workflow:

```bash
bmad run epic-narrative-formatter:transform-to-narrative epic={N}
```
