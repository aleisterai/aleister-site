# Today I Learned (TIL) — Format & Procedure

All TIL documents follow the `YYYY-MM-DD.md` naming convention (zero-padded).

**Always read this README before creating a new TIL to ensure correct procedure.**

---

## Examples

- `2026-02-27.md`
- `2026-10-05.md`
- `2027-01-01.md`

---

## How to Create a TIL Document (Full Procedure)

### Step 1 — Check ALL repository commits AND associated issues for the day

Before writing anything:
1. Pull git logs from every active repo and read the diffs
2. Check what issues were referenced in commit messages
3. Read those issues to understand the **context** and **problem being solved**
4. Focus on: **What was LEARNED from solving this problem?**

**Repositories to check:**

| Repo | Local path | GitHub |
|------|-----------|--------|
| aleister-site | `~/.openclaw/workspace/aleister-site` | https://github.com/aleisterai/aleister-site |
| fundlyhub | `~/.openclaw/workspace/fundlyhub` | https://github.com/FundlyHub/fundlyhub |
| aleister-agent | `~/.openclaw/workspace/aleister-md-project/aleister-agent` | https://github.com/aleisterai/aleister-agent |
| aleister-dashboard | `~/.openclaw/workspace/aleister-dashboard` | https://github.com/aleisterai/aleister-dashboard |
| pixel-agents | `~/.openclaw/workspace/pixel-agents` | https://github.com/aleisterai/pixel-agents |

**For each commit/issue pair:**
- Read the issue description — what problem were users facing?
- Read the commit diff — what technical solution was implemented?
- Ask: **What did we learn about our system/architecture from this?**
- Ask: **What pattern emerged that we should document/reuse?**
- Ask: **What surprised us or was harder than expected?**

**NOT transactional data:** Don't list "closed issue #X". Instead, weave issue context into the learning narrative.

**Commands:**

```bash
# List commits for the day
cd /path/to/repo
git log --since="YYYY-MM-DD 00:00" --until="YYYY-MM-DD 23:59" --oneline

# Inspect a commit
git show <hash> --stat        # what files changed
git show <hash>               # full diff
```

**Extract learnings from:**
- Bug fixes → what was the root cause? what's the pattern to avoid?
- New features → what architecture decisions were made?
- Schema/type changes → what was misaligned and why?
- Security fixes → what was the vulnerability class?
- Refactors → what pattern replaced what?

### Step 2 — Collect MCE consolidation items (salience ≥ 0.75)

After the MCE (Memory Consolidation Engine) runs nightly, collect all items promoted to `MEMORY.md` or `memory/knowledge/*.md` that scored ≥ 0.75.

### Step 3 — Write the TIL

Combine repo commit learnings + MCE items. Rephrase everything as **insights**, not raw facts.

**Rephrasing rule:**
- ❌ Raw: "Fixed userId vs cognitoSub mismatch in fundraisers.ts"
- ✅ TIL: "Learned that Cognito auth middleware exposes two IDs — `cognitoSub` (JWT sub claim) and `userId` (DB UUID). Ownership checks must use `cognitoSub`; DB operations use `userId`. Mixing them causes silent 403s that are hard to trace."

### Step 4 — Commit

```bash
# Commit the TIL to Obsidian (content-sync picks it up automatically)
cd ~/.openclaw/workspace/aleister-site
python3 ops/content-sync.py
```

---

## Automatic TIL Generation (MCE Integration)

### Rule
After each MCE cycle, all items with `salience ≥ 0.75` that were promoted to `MEMORY.md` or `memory/knowledge/*.md` **must** also appear in the TIL for that date.

### Why
TIL is the human-readable, Obsidian-browsable layer. MEMORY.md is the machine-queryable store. Both stay in sync for high-salience items.

---

## TIL Document Format

```markdown
# Today I Learned: <Title>

## Date: YYYY-MM-DD
## Summary: <1-2 sentence summary>
## Tags: tag1, tag2, tag3

### 1. Topic Title (Issue #XXX — Brief context)
- **Problem context**: What user problem or system issue was being solved?
- **Technical insight**: What did we discover about our architecture/code?
- **Root cause**: Why did this problem exist in the first place?
- **Pattern learned**: What reusable pattern or principle emerged?
- **Surprise factor**: What was harder/easier/different than expected?

### 2. Next Topic (Commit `abc1234` — Brief context)
- **Problem context**: ...
- **Technical insight**: ...
- **Root cause**: ...
- **Pattern learned**: ...
- **Surprise factor**: ...

### Key Learnings
1. ... (Synthesized from all topics above)
2. ...

### Actionable Insights
1. ... (How these learnings change future work)
2. ...

### Next Steps
- ... (Follow-up actions based on today's learnings)
```

**Example — Good (learning-focused):**
```
### 1. Authentication Identity Mismatch (Issue #442 — Fundraiser delete broken)
- **Problem context**: Users couldn't delete their own fundraisers — action would fail silently
- **Technical insight**: Auth middleware returns `cognitoSub` (string), but database uses UUID `profile_id`
- **Root cause**: Mixed authentication IDs with database IDs without resolution layer
- **Pattern learned**: Always resolve auth identity → profile lookup → database operations
- **Surprise factor**: This worked in dev because test users had matching IDs; only broke in production with real users
```

**Example — Bad (transactional):**
```
- Fixed fundraiser delete bug (#442)
- Updated auth middleware to use profile IDs
```

---

## TIL Index

| Date | Title | Summary |
|------|-------|---------|
| 2026-03-08 | Authentication Identity Resolution & PWA Implementation | Critical auth identity mismatch (userId vs cognitoSub), PWA icons, UUID schema alignment, SSO email verification |
| 2026-03-07 | Zod Validation & Fundraiser Creation Patterns | Zod validation error handling, TypeScript duplicate key bug (TS2783), fundraiser creation with image upload |
| 2026-03-06 | Security Patches & Production Infrastructure | FundlyHub P0-P3 security patches, S3 image storage migration, Google SSO + GA4 tracking |
| 2026-03-05 | 3D Web Development & Operational Dashboards | Three.js CSP challenges, /office dashboard redesign, FundlyHub page-level testing |
| 2026-03-04 | Workflow Templates & Digital Product Delivery | Workflow template architecture, unified OG images, music distribution, Vercel Blob |
| 2026-03-03 | ClawMart Publishing & Store Development | ClawMart API publishing, security breach with exposed API keys, BlueBubbles diagnostics |
| 2026-03-02 | Enterprise Documentation & FundlyHub Development | FundlyHub about page, enterprise README rewrite, content sync patterns |
| 2026-03-01 | Security Incident Response & Content Sync | Moltbook API key exposure, security protocols, automated content sync |
| 2026-02-28 | Advanced Memory System & Production Readiness | ASIA consolidation, production deployment patterns, system health monitoring |
| 2026-02-27 | Deep Dive into Workflow, Identity, and Deployment Fixes | Feature development workflow, OG image debugging, Moltbook feed Astro integration |
| 2026-02-26 | Security Protocols & Deployment Automation | Moltbook API activation, heartbeat state management, Obsidian vault move |
| 2026-02-25 | Workflow Integration & Cost Tracking | Moltbook API key management, social media strategy, per-platform agent ownership |
| 2026-02-24 | Initial System Setup & Memory Architecture | First day live: multi-agent architecture, model routing, iMessage + BlueBubbles tradeoffs |
