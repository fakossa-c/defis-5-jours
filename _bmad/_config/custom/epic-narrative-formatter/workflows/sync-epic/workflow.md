---
name: sync-epic
description: Full sync workflow - parse, transform, and export a single epic
installed_path: '{project-root}/_bmad/epic-narrative-formatter/workflows/sync-epic'
---

# Sync Epic Workflow

Complete workflow to parse, transform, and export a single epic to the CRM Client in one command.

## Input

| Parameter | Description | Default |
|-----------|-------------|---------|
| `epic` | Epic number to sync | Required |
| `skip_export` | Stop after transform (don't send to CRM) | `false` |
| `force` | Re-process even if already up-to-date | `false` |

## Output

- Metadata JSON: `{narrative_output_path}/epic-{epic}-metadata.json`
- Narrative JSON: `{narrative_output_path}/epic-{epic}-narrative.json`
- CRM update (unless `skip_export=true`)

---

## Steps

### Step 1: Initialize

**Action:** Set up the sync operation.

```
OUTPUT:
  ═══════════════════════════════════════════
  🔄 Syncing Epic {epic}
  ═══════════════════════════════════════════

SET start_time = now()
SET steps_completed = []
```

---

### Step 2: Check if Update Needed

**Action:** Compare source modification time with existing output.

```
IF force == false:
  GET source_mtime = modification time of {epic_source_path}
  GET output_mtime = modification time of {narrative_output_path}/epic-{epic}-narrative.json

  IF output_mtime > source_mtime:
    OUTPUT:
      ℹ️ Epic {epic} is already up-to-date
      Last synced: {output_mtime}
      Source unchanged since: {source_mtime}

      Use --force to re-sync anyway

    EXIT with success
```

---

### Step 3: Parse Epic

**Action:** Execute the parse-epic workflow.

```
OUTPUT: "📖 Step 1/3: Parsing epic..."

EXECUTE workflow: parse-epic
  WITH: epic={epic}

IF failed:
  ERROR: "Parse failed - stopping sync"
  OUTPUT error details
  EXIT

steps_completed.push("parse")

OUTPUT: "  ✓ Parsed successfully"
```

---

### Step 4: Transform to Narrative

**Action:** Execute the transform-to-narrative workflow.

```
OUTPUT: "✨ Step 2/3: Transforming to narrative..."

EXECUTE workflow: transform-to-narrative
  WITH: epic={epic}

IF failed:
  ERROR: "Transform failed - stopping sync"
  OUTPUT error details
  EXIT

steps_completed.push("transform")

OUTPUT: "  ✓ Transformed successfully"
```

---

### Step 5: Export to CRM (Optional)

**Action:** Execute the export-to-crm workflow unless skipped.

```
IF skip_export == true:
  OUTPUT: "⏭️ Step 3/3: Export skipped (--skip-export)"
  steps_completed.push("export_skipped")
ELSE:
  OUTPUT: "📤 Step 3/3: Exporting to CRM..."

  EXECUTE workflow: export-to-crm
    WITH: epic={epic}

  IF failed:
    WARNING: "Export failed but local files are ready"
    OUTPUT: "  ⚠️ Export failed - narrative saved locally"
    steps_completed.push("export_failed")
  ELSE:
    OUTPUT: "  ✓ Exported successfully"
    steps_completed.push("export")
```

---

### Step 6: Summary

**Action:** Display sync results.

```
SET duration = now() - start_time

OUTPUT:
  ═══════════════════════════════════════════
  ✅ Epic {epic} Sync Complete
  ═══════════════════════════════════════════

  Duration: {duration}s

  Steps:
  {steps_completed.includes("parse") ? "✓" : "✗"} Parse epic metadata
  {steps_completed.includes("transform") ? "✓" : "✗"} Transform to narrative
  {steps_completed.includes("export") ? "✓" :
   steps_completed.includes("export_skipped") ? "⏭" : "⚠"} Export to CRM

  Files:
  📄 {narrative_output_path}/epic-{epic}-metadata.json
  📄 {narrative_output_path}/epic-{epic}-narrative.json

  {IF export successful:}
  🌐 View in CRM: {crm_epic_url}
```

---

## Error Handling

| Step | Error | Recovery |
|------|-------|----------|
| Parse | Source not found | Check epic_source_path |
| Parse | Epic not in file | Verify epic number |
| Transform | Agent timeout | Retry or simplify |
| Export | Auth failed | Check API key |
| Export | Network error | CRM may be down |

---

## Usage Examples

### Basic sync
```bash
bmad run epic-narrative-formatter:sync-epic epic=2
```

### Force re-sync
```bash
bmad run epic-narrative-formatter:sync-epic epic=2 --force
```

### Local only (no CRM export)
```bash
bmad run epic-narrative-formatter:sync-epic epic=2 --skip-export
```

---

## Idempotency

Running sync multiple times is safe:
- Parse: Re-reads source, overwrites metadata
- Transform: Re-transforms, overwrites narrative
- Export: CRM uses upsert (update if exists)

No duplicate data will be created.
