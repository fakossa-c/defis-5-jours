# Authentication Guide

How to obtain and manage API keys for the epic-narrative-formatter module.

## Overview

The CRM Client uses **project-scoped API keys** for authentication. Each project has its own API key that:

- Can only access data within that specific project
- Can be revoked without affecting other projects
- Is automatically generated when you create a project

## Getting Your API Key

### Option 1: When Creating a Project

1. Log in to CRM Client
2. Navigate to **Projects** > **New Project**
3. Fill in project details and submit
4. **Copy the API key** shown in the success modal

> **Important:** This is the only time the full key is shown. Copy it immediately!

### Option 2: From Project Settings

If you missed the initial key or need to regenerate:

1. Log in to CRM Client
2. Open your project
3. Go to **Settings** > **API**
4. View or regenerate your key

## Configuring the Module

### Environment Variables

Add these to your `.env` file:

```bash
# CRM API URL
# Local development
CRM_API_URL=http://localhost:54321/functions/v1

# Or staging/production
# CRM_API_URL=https://your-crm.app/functions/v1

# Your project API key
CRM_PROJECT_API_KEY=crm_proj_abc123def456xyz789
```

### Important

- **Never commit `.env`** to version control
- Add `.env` to your `.gitignore`
- Use different keys for dev/staging/production

## Key Format

API keys follow this format:

```
crm_proj_<32_random_characters>
```

Example:
```
crm_proj_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## Security Best Practices

### DO

- Store keys in environment variables
- Use separate keys per environment
- Regenerate keys if compromised
- Revoke old keys when not needed

### DON'T

- Commit keys to git
- Share keys via email/chat
- Use production keys in development
- Hardcode keys in source files

## Key Management

### Viewing Your Key

1. Go to **Settings** > **API** in your project
2. Click the **eye icon** to reveal the key
3. Click **copy** to copy to clipboard

### Regenerating a Key

If your key is compromised:

1. Go to **Settings** > **API**
2. Click **Regenerate Key**
3. Confirm the action
4. **Update your `.env`** with the new key

> **Warning:** Regenerating immediately invalidates the old key. Update all systems using it.

### Revoking a Key

To completely disable API access:

1. Go to **Settings** > **API**
2. Click **Revoke Key**
3. Confirm the action

No API calls will work until you generate a new key.

## Testing Your Key

### Quick Test

```bash
# Set your variables
export CRM_API_URL=http://localhost:54321/functions/v1
export CRM_PROJECT_API_KEY=crm_proj_your_key_here

# Test authentication
curl -X POST ${CRM_API_URL}/ingest-epic \
  -H "X-API-Key: ${CRM_PROJECT_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"id":"test","title":"Test","why":"Test","status":"planned","progress":{"completed":0,"total":1,"percentage":0},"stories":[{"id":"s1","title":"T","description":"D","status":"planned"}]}'
```

### Expected Responses

**Success (200):**
```json
{"success": true, "epic_id": "test", "url": "..."}
```

**Invalid Key (401):**
```json
{"error": "Invalid or revoked API key"}
```

**Missing Key (401):**
```json
{"error": "Missing API key"}
```

## Troubleshooting

### "Invalid or revoked API key"

1. Check `CRM_PROJECT_API_KEY` is set correctly
2. Verify no extra spaces or newlines
3. Confirm key hasn't been revoked in CRM
4. Try regenerating the key

### "Missing API key"

1. Ensure `X-API-Key` header is included
2. Check header name is exactly `X-API-Key`
3. Verify key is being read from environment

### Key Works Locally but Not in CI/CD

1. Ensure secrets are configured in CI system
2. Check environment variable names match
3. Verify the CI environment can reach CRM URL

## Multiple Projects

If you work on multiple projects:

```bash
# Project A
CRM_PROJECT_A_API_KEY=crm_proj_aaa...

# Project B
CRM_PROJECT_B_API_KEY=crm_proj_bbb...

# Active project (copy the one you're working on)
CRM_PROJECT_API_KEY=${CRM_PROJECT_A_API_KEY}
```

Or use different `.env` files:

```bash
# Switch projects
cp .env.project-a .env
# or
cp .env.project-b .env
```

## API Key Permissions

Currently, API keys have these permissions:
- `write:epics` - Create/update epic narratives
- `write:stories` - Create/update story narratives

Future permissions may include:
- `read:epics` - Read epic data
- `delete:epics` - Remove epics
- `admin:project` - Full project access
