# Aleister Workflows — Site Overview

> **Context:** These 7 workflows are live on `thealeister.com/workflows`. Each has a dedicated detail page at `/workflows/[slug]` with pipeline steps, agent assignments, and key principles.

## Architecture

| File | Purpose |
|------|---------|
| `src/data/workflows.ts` | All workflow data (steps, agents, outputs, principles) |
| `src/pages/workflows/[slug].astro` | Dynamic detail page template (SSR) |
| `src/pages/workflows.astro` | Index page — renders all workflow cards from data |
| `src/pages/api/og/workflow-detail.ts` | Dynamic OG image endpoint (`?slug=`) |

## The 7 Workflows

### 1. ⚙️ Feature Development Pipeline (Featured)
**Slug:** `feature-development-pipeline`
**Flow:** F&B → Aleister → Sage → Pixel ∥ Quill ∥ Prism → Rally → Cipher+Forge → Aleister → F&B
**Phases:** Research → Design → Docs → QA Plan → Agile → Build

### 2. 🐛 Bug Investigation & Fix
**Slug:** `bug-investigation-and-fix`
**Flow:** F&B → Cipher → Sage → Cipher → Prism → Forge → Aleister → F&B
**Phases:** Reproduce → RCA → Fix → Test → Deploy

### 3. 📰 Content Publishing Pipeline
**Slug:** `content-publishing-pipeline`
**Flow:** F&B → Sage → Quill → Echo → Pixel → F&B → Echo → Prism
**Phases:** Research → Draft → Humanize → Visuals → Track

### 4. 🔐 Security Audit
**Slug:** `security-audit`
**Flow:** Aleister → Forge → Prism → Cipher → Cipher+Forge → Prism → Quill → F&B
**Phases:** Scan → Triage → Fix → Verify → Report

### 5. ☁️ Infrastructure Deployment
**Slug:** `infrastructure-deployment`
**Flow:** F&B → Sage → Forge → Forge → Prism+Cipher → Forge → Prism → Aleister
**Phases:** Plan → IaC → Configure → Test → Cutover

### 6. 🔀 Code Review & PR Pipeline
**Slug:** `code-review-pipeline`
**Flow:** Aleister → Cipher → Cipher+Prism → Cipher → Quill → Forge → Sage → Aleister
**Phases:** Branch → Build → Test → Review → Merge

### 7. 🔄 Daily Operations Cycle
**Slug:** `daily-operations`
**Flow:** Aleister → Rally → All Agents → Forge → Echo → Aleister → Sage
**Phases:** Briefing → Triage → Execute → Monitor → Retro

## Key Facts
- All data lives in `src/data/workflows.ts` — edit there, pages auto-update
- Detail pages use `Astro.params.slug` (SSR mode, NOT `getStaticPaths`)
- Each page has HowTo JSON-LD schema for SEO
- OG images are dynamic via `/api/og/workflow-detail?slug=`
- Issue #58 tracked this work, closed with WT comment
