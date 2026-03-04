# 🧠 Aleister Session Briefing — March 4, 2026

> **Author:** Vitaliy Rusavuk (via Antigravity agent)
> **Date:** 2026-03-04
> **Priority:** CRITICAL — memorize before next session

---

## 1. Security Incident: API Key Exposure (RESOLVED)

**What happened:** The `aleister-agent-package.zip` was committed to the `aleister-site` repo and contained a **real Google API key** (`AlzaSyCx03bDlqVjoImyrisvqotPOLb10Ze2K7c`, project `gen-lang-client-0507223483`).

**Actions taken:**
- File removed from HEAD immediately
- **Full git history rewritten** via `git filter-branch` across all branches — the key is no longer in any commit
- Force-pushed rewritten history (new HEAD: `d7b9cca`)
- Local GC: `git reflog expire --expire=now --all && git gc --prune=now --aggressive`

**Source files sanitized on Mac Mini** (`~/.openclaw/workspace/aleister-agent-package/`):
- `memory/2026-03-03.md` — Patreon `CLIENT_SECRET` redacted (`[REDACTED]`), Stripe key reference neutralized
- `memory/revenue-progress.md` — ClawMart API key mention generalized
- `memory/errors/self-check-2026-02-27.log` — deleted (contained env var names)
- **Clean zip rebuilt** (1.4MB)

> ⚠️ **ACTION REQUIRED:** The exposed Google API key (`AlzaSyCx03bDlqVjoImyrisvqotPOLb10Ze2K7c`) must be **rotated** in Google Cloud Console → APIs & Services → Credentials. Consider it compromised.

**Lesson for you, Aleister:** NEVER include actual API keys, tokens, or secrets in files that will be distributed or committed to repositories. Use `[REDACTED]` or `$ENV_VAR_NAME` placeholders in memory files and documentation.

---

## 2. Vercel Blob Storage Migration (Issue #75 — CLOSED)

**Why:** Git LFS was insufficient for protecting paid product files. Anyone who clones the repo can access LFS objects. Downloads needed to be truly private.

**Architecture (new):**
```
Customer Purchase → Stripe Session + Device Token Verification
                  → /api/download.ts (server-side)
                  → Vercel Blob (private store, auth required)
                  → Streamed to customer
```

**What changed:**
- `src/pages/api/download.ts` — now fetches from Vercel Blob using `BLOB_STORE_BASE_URL` + `BLOB_READ_WRITE_TOKEN` (Bearer auth header)
- `scripts/upload-to-blob.mjs` — upload utility (run with `BLOB_READ_WRITE_TOKEN=... node scripts/upload-to-blob.mjs`)
- All 16 placeholder zips removed from git
- `downloads/` added to `.gitignore`
- LFS tracking removed from `.gitattributes`
- `@vercel/blob` installed as dependency

**Blob Store Details:**
- **Store name:** `aleister-downloads`
- **Store ID:** `store_vM0RkSRCiz0kZULS`
- **Region:** iad1
- **Access:** Private (requires BLOB_READ_WRITE_TOKEN)
- **Base URL:** `https://n8ypfmz2pjuodawc.private.blob.vercel-storage.com`

**Vercel Environment Variables (set on Vercel dashboard):**
- `BLOB_READ_WRITE_TOKEN` = `vercel_blob_rw_n8YPFmZ2pJUoDaWc_ZKml7zUJ5AJSd7KTCf2OOMYLyp4jPW`
- `BLOB_STORE_BASE_URL` = `https://n8ypfmz2pjuodawc.private.blob.vercel-storage.com`

**PR #76** merged to main, feature branch deleted, issue #75 closed with WT comment and added to project board → Done.

---

## 3. Real Agent Packages Generated & Uploaded

All 16 placeholder zips were replaced with **real packages** built from your actual configs on the Mac Mini.

### Sub-Agent Packages (9):
| Package | Size | Contents |
|---------|------|----------|
| cipher.zip | 5 KB | AGENT.md + 3 Ralph loop scripts (cipher-ralph-*.sh) |
| echo.zip | 7 KB | AGENT.md + 3 Twitter engagement scripts |
| forge.zip | 7 KB | AGENT.md + session lifecycle + setup scripts |
| prism.zip | 13 KB | AGENT.md + cost tracker/reporter (Python + Shell) |
| quill.zip | 3 KB | AGENT.md + patreon-post.py |
| rally.zip | 2 KB | AGENT.md + PRD generator + task watchdog |
| sage.zip | 1 KB | AGENT.md |
| pixel.zip | 1 KB | AGENT.md |
| lyra.zip | 1 KB | AGENT.md |

### Skill Packages (7):
| Package | Size | Source Skill |
|---------|------|-------------|
| humanizer.zip | 15 KB | humanizer (SKILL.md + WARP.md + README) |
| tmux-coding-sessions.zip | 5 KB | coding-sessions |
| coding-loops.zip | 3 KB | coding-agent-loops |
| stripe-revenue-tracker.zip | 3 KB | metrics (stripe-metrics.py) |
| daily-briefing.zip | 2 KB | research |
| build-in-public.zip | 2 KB | clawmart |
| onchain-treasury.zip | 2 KB | firecrawl |

### Full Persona (1):
| Package | Size |
|---------|------|
| aleister-persona.zip | 1,384 KB | Full agent: identity, memory, workflows, ops, skills, docs |

**All packages:** secret-scanned (clean), uploaded to private Vercel Blob, accessible only via authenticated `/api/download.ts` endpoint.

**To update packages in the future:**
```bash
# Rebuild on Mac Mini, then SCP to local downloads/ dir, then:
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_n8YPFmZ2pJUoDaWc_ZKml7zUJ5AJSd7KTCf2OOMYLyp4jPW \
  node scripts/upload-to-blob.mjs
```

---

## 4. Build Fixes

### 4a. TIL README.md removed
- `src/content/til/README.md` was a naming convention guide, not a real TIL entry
- Missing required `date` field in frontmatter → broke Astro content schema validation
- **Deleted from the repo** — it belongs in your Obsidian vault meta, not in the site content

### 4b. Stale downloads includeFiles removed
- `astro.config.mjs` had logic to bundle `downloads/*.zip` via Vercel's `includeFiles`
- Downloads are on Vercel Blob now — this logic was obsolete and causing build failures
- Removed the entire `downloadFiles` variable and `includeFiles` config

### 4c. Store OG image dimensions fixed
- `/store` page now passes `imageWidth={1200}` and `imageHeight={630}` to match the `/api/og/store` endpoint output
- Added proper `imageAlt` for accessibility

---

## 5. Obsidian-Docs Sync Pipeline Fixed

**Repository:** `aleisterai/obsidian-docs` (private)
**Workflow:** `sync-to-site-final.yml`

**Bug found:** The sync script and workflow used **uppercase paths** (`src/content/TIL/`, `src/content/Team/`) but the aleister-site uses **lowercase** (`src/content/til/`, `src/content/team/`). This works on macOS (case-insensitive filesystem) but **fails on GitHub Actions Linux runners** (case-sensitive).

**Fixed:**
- `sync/obsidian-to-site.py` lines 34-35 — `"TIL"` → `"til"`, `"Team"` → `"team"` (commit `b065aae`)
- `.github/workflows/sync-to-site-final.yml` — `git add src/content/TIL/` → `src/content/til/`, same for team (commit `e5ff67a`)

**Note:** All 5 recent workflow runs were failing (status `X`). They should succeed now after these path fixes.

---

## 6. Project Board Status

| Issue | Title | Status |
|-------|-------|--------|
| #75 | Migrate store downloads from Git LFS to Vercel Blob Storage | ✅ Done |
| #76 | PR: feat(store): migrate downloads to Vercel Blob Storage | ✅ Merged |

---

## 7. Today's Commit History (March 4, 2026)

```
d7b9cca  security(store): migrate downloads/*.zip to Git LFS — protect paid product files
b2831e6  feat(store): migrate downloads to Vercel Blob Storage
8cf2e49  fix(store): private Blob access + auth header for download API
57110e0  Merge pull request #76
0b53546  fix(store): add allowOverwrite to blob upload script
c04bd7f  fix(build): remove TIL README.md + stale downloads includeFiles from astro config
d858263  fix(seo): add correct OG image dimensions for /store page (1200x630)
```

---

## 8. Key Files Modified

| File | Change |
|------|--------|
| `src/pages/api/download.ts` | Fetch from Vercel Blob (private, auth header) instead of local filesystem |
| `scripts/upload-to-blob.mjs` | Upload utility for deploying zips to Blob |
| `astro.config.mjs` | Removed stale downloadFiles/includeFiles logic |
| `.gitignore` | Added `downloads/` |
| `.gitattributes` | Removed LFS tracking |
| `src/pages/store/index.astro` | Added OG image dimensions (1200x630) |
| `src/content/til/README.md` | Deleted (meta-doc, not content) |
| `package.json` | Added `@vercel/blob` |

---

# 📝 KNOWLEDGE TEST — Aleister, answer these:

**Instructions:** Answer each question in 1-2 sentences. If you don't know, say so — do NOT guess.

### Security

1. What Google API key was exposed, and in which file was it found?
2. What command was used to scrub the key from git history?
3. What 3 memory files on the Mac Mini were sanitized, and what was in each?
4. Has the exposed Google API key been rotated yet?

### Vercel Blob Architecture

5. What is the Vercel Blob store ID and which region is it in?
6. What two environment variables are required on Vercel for the download API to work?
7. How does `/api/download.ts` authenticate with the private Blob store?
8. What verification does a customer go through before receiving a download? (2 checks)

### Downloads

9. How many total download packages exist, and how many are sub-agents vs skills vs personas?
10. What command would you run to re-upload all packages to Blob after updating them?
11. Which sub-agent package is the largest and why?

### Build & Pipeline

12. Why was `src/content/til/README.md` causing a build failure?
13. Why was the obsidian-docs sync workflow failing on GitHub Actions?
14. What was the directory casing fix applied to `obsidian-to-site.py`?

### Project Management

15. Which GitHub issue tracks the Vercel Blob migration, and what is its current status?
16. What PR number was created and merged for this work?

---

**Scoring:**
- 14-16 correct: ✅ Full comprehension — proceed with confidence
- 10-13 correct: ⚠️ Partial — re-read the sections you missed
- Below 10: ❌ Re-read this entire briefing before doing any store/download work
