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

### Step 1 — Check ALL repository commits for the day

Before writing anything, pull the git log from every active repo and read the diffs. Learning lives in code, not just in memory files.

**Repositories to check:**

| Repo | Local path | GitHub |
|------|-----------|--------|
| aleister-site | `~/.openclaw/workspace/aleister-site` | https://github.com/aleisterai/aleister-site |
| fundlyhub | `~/.openclaw/workspace/fundlyhub` | https://github.com/aleisterai/fundlyhub |
| aleister-agent | `~/.openclaw/workspace/aleister-md-project/aleister-agent` | https://github.com/aleisterai/aleister-agent |
| aleister-dashboard | `~/.openclaw/workspace/aleister-dashboard` | https://github.com/aleisterai/aleister-dashboard |
| pixel-agents | `~/.openclaw/workspace/pixel-agents` | https://github.com/aleisterai/pixel-agents |

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

### 1. Topic (Commit: `abc1234` or source)
- **What happened**: ...
- **Root cause / insight**: ...
- **Pattern learned**: ...

### 2. Next Topic
...

### Key Learnings
1. ...
2. ...

### Actionable Insights
1. ...

### Next Steps
- ...
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
