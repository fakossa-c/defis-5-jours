---
name: sync-all-epics
description: Sync all epics from epic-list.md to CRM Client
installed_path: '{project-root}/_bmad/epic-narrative-formatter/workflows/sync-all-epics'
---

# Sync All Epics Workflow

Discover and sync all epics from the source file to the CRM Client.

## Input

| Parameter | Description | Default |
|-----------|-------------|---------|
| `skip_export` | Transform only, don't export | `false` |
| `force` | Re-process all even if up-to-date | `false` |
| `filter` | Only sync specific epics (comma-separated) | `all` |

## Output

- All epic metadata and narrative JSONs
- CRM updates for all epics
- Summary report

---

## Steps

### Step 1: Discover Epics

**Action:** Scan epic-list.md for all epic numbers.

```
READ file at {epic_source_path}

FIND all patterns matching: "## Epic {N}:" or "## Epic {N} -"

EXTRACT epic numbers into list: discovered_epics

OUTPUT:
  📋 Discovered {discovered_epics.length} epics:
  {discovered_epics.map(n => `  - Epic ${n}`).join('\n')}
```

---

### Step 2: Apply Filter

**Action:** Filter epics if specified.

```
IF filter != "all":
  PARSE filter as comma-separated numbers
  epics_to_sync = discovered_epics.filter(n => filter.includes(n))

  OUTPUT:
    🔍 Filtered to {epics_to_sync.length} epics:
    {epics_to_sync.map(n => `  - Epic ${n}`).join('\n')}
ELSE:
  epics_to_sync = discovered_epics
```

---

### Step 3: Initialize Tracking

**Action:** Set up progress tracking.

```
SET results = {
  total: epics_to_sync.length,
  success: [],
  failed: [],
  skipped: []
}

SET start_time = now()
```

---

### Step 4: Process Each Epic

**Action:** Loop through and sync each epic.

```
FOR i, epic_num IN epics_to_sync:
  OUTPUT:
    ═══════════════════════════════════════════
    [{i+1}/{results.total}] Processing Epic {epic_num}
    ═══════════════════════════════════════════

  TRY:
    EXECUTE workflow: sync-epic
      WITH:
        epic={epic_num}
        skip_export={skip_export}
        force={force}

    results.success.push(epic_num)
    OUTPUT: "✅ Epic {epic_num} synced"

  CATCH error:
    IF error.type == "up_to_date" AND force == false:
      results.skipped.push(epic_num)
      OUTPUT: "⏭️ Epic {epic_num} skipped (up-to-date)"
    ELSE:
      results.failed.push({epic: epic_num, error: error.message})
      OUTPUT: "❌ Epic {epic_num} failed: {error.message}"

  # Brief pause between exports to avoid rate limiting
  IF NOT skip_export:
    WAIT 500ms
```

---

### Step 5: Generate Report

**Action:** Create summary report.

```
SET duration = now() - start_time

REPORT = """
═══════════════════════════════════════════════════════
📊 Epic Sync Report
═══════════════════════════════════════════════════════

Duration: {duration}s
Total Epics: {results.total}

Results:
  ✅ Success: {results.success.length}
  ⏭️ Skipped: {results.skipped.length}
  ❌ Failed:  {results.failed.length}

{IF results.success.length > 0:}
Synced Epics:
{results.success.map(n => `  - Epic ${n}`).join('\n')}

{IF results.skipped.length > 0:}
Skipped (up-to-date):
{results.skipped.map(n => `  - Epic ${n}`).join('\n')}

{IF results.failed.length > 0:}
Failed:
{results.failed.map(f => `  - Epic ${f.epic}: ${f.error}`).join('\n')}

═══════════════════════════════════════════════════════
"""

OUTPUT: REPORT
```

---

### Step 6: Write Report File

**Action:** Save report to file.

```
WRITE REPORT to: {narrative_output_path}/sync-report-{timestamp}.txt

OUTPUT:
  📄 Report saved: {narrative_output_path}/sync-report-{timestamp}.txt
```

---

### Step 7: Exit Status

**Action:** Determine exit code.

```
IF results.failed.length > 0:
  EXIT with code 1 (partial failure)
ELSE:
  EXIT with code 0 (success)
```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| One epic fails | Continue with others, report at end |
| Source file missing | Fail immediately |
| CRM unavailable | Fail export step, local files preserved |
| Rate limited | Built-in delays prevent this |

---

## Usage Examples

### Sync all epics
```bash
bmad run epic-narrative-formatter:sync-all-epics
```

### Sync specific epics
```bash
bmad run epic-narrative-formatter:sync-all-epics filter=2,3,5
```

### Force full re-sync
```bash
bmad run epic-narrative-formatter:sync-all-epics --force
```

### Local only (no CRM)
```bash
bmad run epic-narrative-formatter:sync-all-epics --skip-export
```

---

## CI/CD Integration

Can be used in automated pipelines:

```yaml
# GitHub Action example
- name: Sync epics to CRM
  run: bmad run epic-narrative-formatter:sync-all-epics
  env:
    CRM_API_URL: ${{ secrets.CRM_API_URL }}
    CRM_PROJECT_API_KEY: ${{ secrets.CRM_PROJECT_API_KEY }}
```

Exit codes:
- `0` - All epics synced successfully
- `1` - One or more epics failed
