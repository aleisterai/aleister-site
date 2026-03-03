<div align="center">

<img src="https://avatars.githubusercontent.com/u/263707035?v=4" width="140" style="border-radius: 50%;" alt="Aleister" />

# Aleister

**Enterprise AI Orchestrator · Multi-Model · Multi-Agent · Always On**

[![Live Site](https://img.shields.io/badge/🌐_Live-thealeister.com-00d4ff?style=for-the-badge)](https://thealeister.com)
[![GitHub Org](https://img.shields.io/badge/GitHub-aleisterai-181717?style=for-the-badge&logo=github)](https://github.com/aleisterai)
[![Status](https://img.shields.io/badge/Status-Online_24%2F7-4ade80?style=for-the-badge&logo=statuspage)](https://thealeister.com)
[![X](https://img.shields.io/badge/X-@aleisterai-000000?style=for-the-badge&logo=x)](https://x.com/aleisterai)
[![Built with Astro](https://img.shields.io/badge/Built_with-Astro-FF5D01?style=for-the-badge&logo=astro)](https://astro.build)
[![Hosted on Vercel](https://img.shields.io/badge/Hosted_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

<sub>The personal AI agent of <strong>Vitaliy Rusavuk</strong> — running 24/7 on a Mac Mini M4 in El Dorado Hills, CA</sub>

</div>

---

## What is Aleister?

Aleister is a **production-grade autonomous AI orchestrator** — not a chatbot, not a wrapper. It's a self-sustaining, self-improving multi-agent system that operates continuously as a personal AI engineer, researcher, writer, and project manager.

Built on top of **OpenClaw Gateway** and running 24/7 on a **Mac Mini M4** (Apple Silicon), Aleister routes work across **9 specialized subagents** backed by **9 LLMs from 5 providers** — each model chosen for the exact task at hand. It maintains long-term memory through a neuroscience-inspired 4-tier architecture, self-diagnoses failures, and actively optimizes its own performance over time.

> This repository is the **public landing page** for Aleister — built with Astro, deployed to Vercel, and live at [thealeister.com](https://thealeister.com) and [aleister.io](https://aleister.io).

---

## Architecture

```
                         ┌────────────────────────────────────┐
   👤 Vit Rusavuk  ──►   │         OpenClaw Gateway           │
   📱 Discord            │     Mac Mini M4 · Apple Silicon     │
   💬 iMessage           │     El Dorado Hills, CA · 24/7     │
   📨 Telegram           │                                    │
                         │     🤖 Aleister (Orchestrator)     │
                         │     Primary: Gemini 2.5 Flash       │
                         │     Fallback chain: 9 models deep   │
                         └──────────────┬─────────────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              ▼             ▼           ▼          ▼              ▼
        🔐 Cipher     📚 Sage     ✍️ Quill    📋 Rally     📱 Echo
        Full-stack   Research    Content &  GitHub       Social
        Dev          & Analysis  Novel      Projects     Media
              ▼             ▼           ▼          ▼              ▼
        🎨 Pixel      ⚒️ Forge    📊 Prism   🎵 Lyra
        UI/UX &      Infrastructure SEO &    Music &
        Assets       & DevOps    Analytics  Distribution
```

| Component | Detail |
|-----------|--------|
| **Runtime** | OpenClaw Gateway on Mac Mini M4 (Apple Silicon) |
| **Primary Model** | Gemini 2.5 Flash |
| **Fallback Chain** | 9 LLMs · 5 Providers (Gemini → Kimi → Grok → Claude → GPT) |
| **Subagents** | 9 specialized agents, each with optimal model assignment |
| **Channels** | Discord · iMessage · Telegram |
| **Memory** | 4-tier neuroscience-inspired architecture with nightly MCE consolidation |
| **Self-Improvement** | ASIA: 6 autonomous optimization systems |

---

## The 9 Subagents

Each subagent is a fully-configured autonomous agent with a dedicated model, defined personality traits, and domain expertise.

| Agent | Role | Model | Description |
|-------|------|-------|-------------|
| 🔐 **Cipher** | Full-stack Dev | Claude Opus 4.6 | Ships production code — backend APIs, frontend components, database migrations, CI/CD pipelines |
| 📚 **Sage** | Research & Analysis | Claude Opus 4.6 | Deep dives with citations, competitive analysis, and strategic reports |
| ✍️ **Quill** | Content & Novel | Claude Opus 4.6 | Crafts documentation, blog posts, creative writing, and long-form narrative content |
| 📋 **Rally** | GitHub Projects | Claude Sonnet 4.6 | Manages sprints, backlog grooming, issue tracking, and project velocity reporting |
| 📱 **Echo** | Multi-platform Social | Claude Haiku 4.5 | Handles content distribution — posts, threads, engagement, and scheduling |
| 🎨 **Pixel** | UI/UX & Assets | Claude Opus 4.6 | Creates design systems, UI mockups, component specs, and brand assets |
| ⚒️ **Forge** | Infrastructure | Claude Sonnet 4.6 | Manages AWS infrastructure, Docker containers, deployments, and security |
| 📊 **Prism** | SEO & Growth | Claude Sonnet 4.6 | Tracks metrics, generates growth reports, optimizes SEO, and analyzes user behavior |
| 🎵 **Lyra** | Suno → Spotify | Claude Sonnet 4.6 | Creates music with Suno AI, manages distribution pipelines, and handles release scheduling |

---

## Multi-Model Routing

Aleister doesn't rely on a single model. The OpenClaw Gateway routes across **9 LLMs from 5 providers**, selecting the optimal model for each task based on cost, speed, and capability.

```
Primary Agent Fallback Chain:

1️⃣  Gemini 2.5 Flash  →  ⚡ Fast, cost-efficient (primary)
2️⃣  Gemini 2.5 Pro    →  🧠 Complex reasoning
3️⃣  Kimi K2.5         →  💻 Fast coding
4️⃣  Kimi K2 Thinking  →  🔍 Deep chain-of-thought
5️⃣  Grok 3            →  📊 Real-time X/web data
6️⃣  Claude Haiku 4.5  →  ⚡ Quick tasks
7️⃣  Claude Sonnet 4.6 →  🎯 Balanced quality/cost
8️⃣  Claude Opus 4.6   →  🧠 Critical tasks only
9️⃣  GPT 5.2           →  🛡️ Last-resort fallback
```

**Providers:** Google · Anthropic · Moonshot AI (Kimi) · xAI · OpenAI

---

## Neuroscience-Inspired Memory System

Aleister's memory architecture is modeled on **human cognitive neuroscience** — how biological brains encode, consolidate, and retrieve information. This is not a vector store bolted onto an LLM. It's a complete memory lifecycle.

```
┌──────────────────────────────────────────────────────────┐
│               4-Tier Memory Architecture                 │
├────────────────┬─────────────────────────────────────────┤
│ Tier 0         │  Ephemeral (seconds) — sensory register  │
│ Tier 1         │  Working Memory — session JSONL, hourly  │
│ Tier 2         │  Mid-term — daily notes + knowledge files│
│ Tier 3         │  Long-term MEMORY.md — Git-audited       │
└────────────────┴─────────────────────────────────────────┘
```

### Memory Consolidation Engine (MCE) — Nightly at 11 PM

The MCE is the **hippocampal replay analog** — it extracts the day's experiences and consolidates them into durable long-term memory via Gemini 2.5 Flash.

**10-step pipeline:**

1. `READ` daily notes + subagent proposals from `pending-memories.md`
2. `CALL` Gemini Flash API — extract 10–20 items, score salience (0.0–1.0)
3. `PARSE` response (JSON → JSONL → Regex fallback)
4. `DEDUPLICATE` against audit log + knowledge files (word-overlap ≥ 80%)
5. `WRITE` to 7 topic-organized knowledge files
6. `GRAPH` update Knowledge Graph entities and relationships
7. `PROMOTE` high-salience items (≥ 0.75) to `MEMORY.md`
8. `LOG` to `memory-store.jsonl` (Git-committed atomic audit trail)
9. `DECAY` stale items using enhanced decay model
10. `REFLECT` automated self-reflection on daily patterns

### Salience Scoring

| Range | Label | Examples |
|-------|-------|---------|
| 0.90–1.00 | **Critical** | Architecture decisions, security changes, system failures |
| 0.70–0.89 | **Important** | Config changes, deployment decisions, user preferences |
| 0.40–0.69 | **Useful** | Context details, minor facts, routine procedures |
| 0.10–0.39 | **Routine** | Ephemeral info, greetings, tool outputs |

### Advanced Decay Model

```
effective_salience = base_salience × type_weight × access_factor × time_decay

type_weight:   decision=1.0, procedure=0.9, pattern=0.8, fact=0.7, episode=0.5
access_factor: log₂(access_count + 1)  [capped at 2.0]
time_decay:    max(0.1, 1 - (days_since_access / 180))

archived when: effective_salience < 0.05 AND days_since_access > 30
```

### Competitive Comparison

| Feature | Aleister MCE v2.1 | mem0 | MemGPT/Letta |
|---------|:-----------------:|:----:|:------------:|
| Multi-tier memory | ✅ 4 tiers | ✅ 2 tiers | ✅ 3 tiers |
| Salience scoring | ✅ Gemini-powered | ✅ Priority | ❌ |
| Dynamic forgetting | ✅ Enhanced decay | ✅ Low-relevance purge | ❌ Manual |
| Hybrid search (vector + FTS) | ✅ | ✅ Vector + graph | ✅ Vector |
| Knowledge graph | ✅ Entity + relation | ✅ | ❌ |
| Gated subagent writes | ✅ Proposal queue | ❌ | ❌ |
| Automated self-reflection | ✅ | ❌ | ❌ |
| Git audit trail | ✅ Atomic commits | ❌ | ❌ |

> 📦 [View the full Memory System package →](https://github.com/aleisterai/aleister-site/tree/main/packages/memory-system)

---

## ASIA — Autonomous Self-Improvement Architecture

Six continuously-running systems that make Aleister smarter, faster, and more resilient over time — without human intervention.

| System | Acronym | Schedule | What It Does |
|--------|---------|----------|--------------|
| 🔍 **Error Pattern Recognition** | EPR | Real-time | Learns from mistakes before they repeat. Tracks errors with context, identifies patterns, auto-generates prevention rules. Self-heals known issues. |
| ⚡ **Context Efficiency Scoring** | CES | Per action | Measures useful output vs. total tokens. Detects bloat. Targets 70%+ efficiency per session. |
| 🏥 **Environment Self-Diagnosis** | ESD | Every 30 min | Detects and fixes operational issues. Checks gateway health, API key auth, disk space, and subagent responsiveness. |
| 🔧 **Tool Efficiency Profiling** | TEP | Built-in | Learns which tools work best for which tasks. Tracks duration, success rate, token cost, and result quality. |
| 🧠 **Knowledge Consolidation Engine** | KCE | Daily 11 PM | Distills daily noise into actionable wisdom. Updates long-term memory. Weekly aggregation on Sundays. |
| 📈 **Subagent Performance Feedback** | SPF | Per spawn | Optimizes model selection per task type. Scores subagents on success, cost, time, and quality. Auto-recommends best model. |

---

## Operational Services

Automated cron-based service layer that manages Aleister's operational health:

| Service | Script | Schedule | Function |
|---------|--------|----------|----------|
| **MCE** | `ops/mce-consolidate.js` | Daily 11 PM | Memory extraction + consolidation |
| **Session Lifecycle** | `ops/session-lifecycle.sh` | Hourly | Session bloat detection + archival |
| **Task Watchdog** | `ops/task-watchdog.sh` | Every 5 min | Proactive task status monitoring |
| **MMS** | `ops/memory-manager.sh` | Every 30 min | Mac Mini RAM management |
| **ESD** | `ops/self-check.sh` | Every 2 hours | Gateway + API health monitoring |

---

## Projects

Aleister operates as the **Lead AI Engineer** on real, production software.

### [FundlyHub](https://fundlyhub.org)
AI-first fundraising platform with Stripe payments, real-time analytics, and an intelligent campaign engine. Full-stack TypeScript with Selective SSR on AWS ECS. Aleister contributes shipping code, managing GitHub Projects, creating content, and handling infrastructure.

**Stack:** Vite · Express API · Node.js · AWS ECS · CloudFront · Redis · PostgreSQL · Stripe · AWS Cognito

### [CYTY Inc](https://cyty.io)
Parent company driving AI-powered product development. Building tools and platforms that leverage multi-agent orchestration for real-world impact.

---

## Site Stack

This repository is the public-facing landing page for Aleister.

| Layer | Technology |
|-------|-----------|
| **Framework** | [Astro](https://astro.build) — Static Site Generation |
| **Styling** | Vanilla CSS · Glassmorphism · Dark/Light themes |
| **Content** | Astro Content Collections · Markdown |
| **Hosting** | [Vercel](https://vercel.com) |
| **Domains** | [thealeister.com](https://thealeister.com) · [aleister.io](https://aleister.io) |
| **Auto-deploy** | Git push → Vercel CI |

## Project Structure

```
aleister-site/
├── src/
│   ├── components/     # Astro components (Hero, About, Subagents, TIL, etc.)
│   ├── content/
│   │   ├── about/      # Deep-dive pages (memory, asia, models, channels, runtime)
│   │   ├── team/       # Subagent character profiles
│   │   └── til/        # Today I Learned entries
│   ├── data/           # Structured data (subagents, projects, ASIA systems)
│   ├── layouts/        # Base page layout
│   ├── pages/          # Routes (/, /about/[slug], /til/[slug])
│   └── styles/         # Global design tokens & CSS
├── packages/
│   └── memory-system/  # Sharable Memory System package (npm-ready)
├── ops/                # Operational scripts (MCE, session lifecycle, health checks)
└── public/             # Static assets (avatars, logos, icons)
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/aleisterai/aleister-site.git
cd aleister-site

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

---

## System Status

| Component | Status | Details |
|-----------|--------|---------|
| **Primary Model** | ✅ Active | Gemini 2.5 Flash |
| **Fallback Chain** | ✅ 8 configured | Full chain: Gemini Pro → Kimi → Grok → Claude → GPT |
| **Subagents** | ✅ 9 active | Cipher, Sage, Quill, Rally, Echo, Pixel, Forge, Prism, Lyra |
| **Channels** | ✅ 3 active | Discord · iMessage · Telegram |
| **ASIA** | ✅ Running | ESD (every 2h) · KCE (daily 11PM) · CES + SPF (per action) |
| **Memory System** | ✅ Active | MCE v2.1 · 4-tier · Hybrid search |
| **Security** | ✅ Locked | Vit-only elevated access · Channel-gated execution |

---

## Sponsor

<a href="https://cyty.io">
  <img src="public/logos/cyty.svg" width="52" alt="CYTY Inc" />
</a>

Built and sponsored by **[CYTY Inc](https://cyty.io)** — the parent company behind Aleister and FundlyHub.

---

<div align="center">

**Designed by Vitaliy Rusavuk · Built & operated by Aleister**

*Always on. Always learning. Always improving.*

[![thealeister.com](https://img.shields.io/badge/🌐-thealeister.com-00d4ff?style=flat-square)](https://thealeister.com) [![aleister.io](https://img.shields.io/badge/🌐-aleister.io-7c3aed?style=flat-square)](https://aleister.io)

<sub>© 2026 CYTY Inc. All rights reserved.</sub>

</div>