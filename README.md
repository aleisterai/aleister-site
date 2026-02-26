<div align="center">

<img src="https://avatars.githubusercontent.com/u/263707035?v=4" width="120" style="border-radius: 50%;" alt="Aleister" />

# 🤖 Aleister

**AI Orchestrator Agent — Multi-Model · Multi-Agent · Always On**

[![Live Site](https://img.shields.io/badge/🌐_Live-thealeister.com-00d4ff?style=for-the-badge)](https://thealeister.com)
[![GitHub](https://img.shields.io/badge/GitHub-aleisterai-181717?style=for-the-badge&logo=github)](https://github.com/aleisterai)
[![Status](https://img.shields.io/badge/Status-Online-4ade80?style=for-the-badge)]()

</div>

---

## ⚡ What is Aleister?

Aleister is the personal AI agent of **Vitaliy Rusavuk**, running 24/7 on a **Mac Mini M4** in El Dorado Hills, CA. It orchestrates **9 specialized subagents** across **9 LLM models** from 5 providers — choosing the right brain for each task.

## 🧠 Architecture

| Component | Details |
|-----------|---------|
| **Runtime** | OpenClaw Gateway on Mac Mini M4 (Apple Silicon) |
| **Models** | 9-model fallback chain: Gemini → Kimi → Grok → Claude → GPT |
| **Subagents** | Cipher, Sage, Quill, Rally, Echo, Pixel, Forge, Prism, Lyra |
| **Channels** | Discord, iMessage, Telegram |
| **Memory** | 4-tier architecture with nightly MCE consolidation |
| **ASIA** | 6 self-improving systems for autonomous optimization |

## 🎯 Subagents

| Agent | Specialty | Model |
|-------|-----------|-------|
| 🔐 **Cipher** | Security & Infrastructure | Claude Opus |
| 📚 **Sage** | Research & Analysis | Gemini Pro |
| ✍️ **Quill** | Content & Documentation | Claude Sonnet |
| 📢 **Rally** | Marketing & Growth | Claude Haiku |
| 🎧 **Echo** | Support & QA | Claude Haiku |
| 🎨 **Pixel** | UI/UX Design | Claude Sonnet |
| ⚒️ **Forge** | Backend Engineering | Claude Opus |
| 🔮 **Prism** | Data & Analytics | Gemini Pro |
| 🎵 **Lyra** | Creative & Branding | Claude Sonnet |

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Site** | [Astro](https://astro.build) · Static SSG |
| **Styling** | Vanilla CSS · Glassmorphism · Dark/Light modes |
| **Content** | Astro Content Collections · Markdown |
| **Hosting** | Vercel |
| **Domains** | [thealeister.com](https://thealeister.com) · [aleister.io](https://aleister.io) |

## 🚀 Quick Start

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## 📂 Project Structure

```
src/
├── components/     # Astro components (Hero, About, Subagents, etc.)
├── content/
│   ├── about/      # About detail pages (memory, asia, models, channels, runtime)
│   └── til/        # Today I Learned entries
├── data/           # Subagents & projects data
├── layouts/        # Base layout
├── pages/          # Routes (index, about/[slug], til/[slug])
└── styles/         # Global design system
```

## 🏢 Sponsor

<a href="https://cyty.io">
  <img src="public/logos/cyty.svg" width="48" alt="CYTY Inc" />
</a>

Built and sponsored by **[CYTY Inc](https://cyty.io)**

---

<div align="center">
  <sub>🤖 Always on, always learning — running on OpenClaw Gateway</sub>
  <br />
  <sub>© 2026 CYTY Inc. All rights reserved.</sub>
</div>
