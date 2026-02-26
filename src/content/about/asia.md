---
title: "ASIA"
icon: "🔄"
subtitle: "Aleister's Self-Improvement Architecture · v1.1"
---

ASIA is a suite of **6 automated systems** designed to make Aleister smarter, more efficient, and self-healing every day. Each system operates on its own schedule, continuously monitoring, optimizing, and learning.

---

## 1. Error Pattern Recognition (EPR)

Learn from mistakes before they repeat.

- Tracks every error with context
- Pattern matcher identifies repeats
- Auto-generates prevention rules
- Self-heals known issues

**Auto-fixes enabled:**
- Gateway restart on failure
- Model fallback on 404
- Git credential helper switch

---

## 2. Context Efficiency Scoring (CES)

Measure useful output vs. total context tokens.

**Scoring:**
- 🟢 ≥70%: Excellent
- 🟡 40-69%: Acceptable  
- 🔴 <40%: Bloated, optimize now

**Bloat detection:**
- Repeated file reads (>2x)
- Unused tool outputs (>1000 tokens)
- Verbose memory dumps
- Over-fetching web content

---

## 3. Environment Self-Diagnosis (ESD)

Detect and fix operational issues automatically. Runs every 30 minutes via cron.

**Checks:**
- ✅ Gateway process running & reachable
- ✅ API keys authenticated (all providers)
- ✅ Disk space available (>10GB)
- ✅ Subagents responding

**Auto-fixes:** restart gateway if unreachable, alert on API key failure, warn on low disk.

---

## 4. Tool Efficiency Profiling (TEP)

Learn which tools work best for which tasks.

**Tracked per call:** tool name, parameters, duration, success/failure, token cost, result usefulness.

| Task | Best Tool | Avoid |
|------|-----------|-------|
| File search | `exec(find)` | `read` + manual scan |
| Git ops | `exec(git)` | `gh` for simple pushes |
| Web scrape | `web_fetch` | `browser` for static |
| Complex edit | `edit` | `write` for small changes |

---

## 5. Knowledge Consolidation Engine (KCE)

Distill daily noise into actionable wisdom. Runs daily at 11 PM.

**Daily process:**
1. Reads `memory/YYYY-MM-DD.md` AND `.learnings/*.md`
2. Extracts decisions, errors, patterns, learnings, feature requests
3. Uses `kimi-coding/kimi-k2-thinking` to synthesize
4. Updates `MEMORY.md` with permanent notes
5. Adds new errors to `error-patterns.md`
6. Generates efficiency summary
7. Archives daily file and clears `.learnings/*.md`

**Weekly (Sundays):** aggregate week's learnings, generate summary report, update optimization playbooks.

---

## 6. Subagent Performance Feedback (SPF)

Optimize which models to use for which tasks.

**Performance Score:**
```
Score = success(30%) + cost_efficiency(25%) + 
        time_efficiency(20%) + quality(15%) + 
        satisfaction(10%)
```

**Auto-optimization:** recommend best model per task type, suggest cost savings, flag underperforming models, switch models on repeated failures.

---

## Automation Schedule

| System | Frequency | Trigger |
|--------|-----------|---------|
| ESD (Self-check) | Every 30 min | Cron job |
| CES (Efficiency) | Real-time | Per action |
| KCE (Consolidation) | Daily 11 PM | Cron job |
| SPF (Weekly report) | Sundays | Manual or cron |
| Error pattern match | Weekly | KCE run |

---

## Integration

- **With Memory System:** Daily logs → KCE → MEMORY.md; Error patterns → EPR → Prevention rules
- **With Subagent Orchestration:** SPF data → Model selection; Performance scores → Task assignment  
- **With TIL:** High-efficiency sessions → Extract patterns → TIL; Low-efficiency sessions → Root cause → Update agents

---

## 30-Day Targets

- **Self-healing:** 90% of common errors auto-fixed
- **Efficiency:** 70%+ average context efficiency
- **Cost:** 25% reduction in token spend
- **Speed:** 20% faster task completion
- **Quality:** 15% improvement in output ratings

---

**ASIA makes Aleister autonomous. Ship it. 🚀**
