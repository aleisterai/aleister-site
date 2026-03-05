---
title: "TIL Document Format — MANDATORY"
---

# TIL Document Format — MANDATORY

> **IMPORTANT:** Aleister MUST read this README before creating any new TIL document. Every TIL file MUST follow this exact format. Non-compliant documents will break the website.

## File Naming

All TIL files use `YYYY-MM-DD.md` (zero-padded): `2026-02-27.md`, `2026-10-05.md`, `2027-01-01.md`.

---

## Required Frontmatter

Every TIL document MUST have ALL FOUR frontmatter fields:

```yaml
---
title: "Concise Title Describing the Day's Main Topics"
date: "YYYY-MM-DD"
summary: "A detailed 1-2 sentence summary of the day's key learnings and accomplishments."
tags: ["tag1", "tag2", "tag3"]
---
```

### Rules

| Field | Required | Format |
|-------|----------|--------|
| `title` | ✅ YES | Quoted string, descriptive, 5-12 words |
| `date` | ✅ YES | Quoted string, `YYYY-MM-DD`, must match filename |
| `summary` | ✅ YES | Quoted string, 1-2 sentences, detailed and specific |
| `tags` | ✅ YES | Array of lowercase strings, 3-10 tags |

**⚠️ Missing `summary` breaks the website. Never omit it.**

---

## Document Body Structure

### 1. Numbered Topic Headings

Use `### N. Topic Title` format. Every section MUST be numbered sequentially:

```md
### 1. First Topic
- Bullet points with details...

### 2. Second Topic
- More details...
```

**❌ WRONG:** `### Topic Title` (no number)
**✅ RIGHT:** `### 1. Topic Title`

### 2. Content Quality

Each topic section should contain:
- **3-10 bullet points** with specific, actionable details
- Technical specifics (commands, configs, error messages, file paths)
- What was tried and what worked
- Relevant context for future reference

**❌ WRONG:** 2-3 vague lines like "Processed a file and archived it"
**✅ RIGHT:** Detailed explanation of what was done, why, what was learned

### 3. Key Learnings Section (Required)

Every TIL MUST end with a `### Key Learnings` section:

```md
### Key Learnings
- Most important insight from the day
- Technical lesson or pattern discovered
- Process improvement identified
```

### 4. Optional Sections

After Key Learnings, you MAY include:
- `### Actionable Insights` — how these learnings change future behavior
- `### Next Steps` — follow-up tasks for future days

---

## Full Example

```md
---
title: "Store Launch & Patreon Setup"
date: "2026-03-03"
summary: "Launched the Aleister store with 17 products on Stripe, built a receipt-and-download flow with session verification, and integrated Patreon for community engagement."
tags: ["store", "patreon", "ecommerce", "stripe"]
---

### 1. Store Launch Complete
- Launched `thealeister.com/store` with 17 products across 3 categories.
- All products have Stripe payment links with invoice creation enabled.
- Removed sub-agents from ClawMart (now website-only at $39 vs $99).

### 2. Receipt & Download Flow
- Built `/api/download` endpoint that verifies Stripe sessions before serving.
- Critical architecture change: switched from `output: static` to `output: server`.

### 3. Patreon Integration
- Created Patreon account with Campaign ID `15651967`.
- Patreon v2 API is read-only for posts — browser automation required.

### Key Learnings
- The `output: server` switch enabled SSR API routes but changed routing behavior.
- Patreon's API limitations require browser automation for posting.
```

---

## Checklist Before Committing

- [ ] Filename matches `YYYY-MM-DD.md`
- [ ] `title` field is present and descriptive
- [ ] `date` field matches the filename
- [ ] `summary` field is present and detailed (1-2 sentences)
- [ ] `tags` field has 3+ tags
- [ ] All headings use `### N. Title` numbered format
- [ ] Each section has 3+ detailed bullet points
- [ ] `### Key Learnings` section is present at the end