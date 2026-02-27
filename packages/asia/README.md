# Aleister's Self-Improvement Architecture (ASIA)

**Version:** 1.1  
**Created:** 2026-02-25  
**Purpose:** Make Aleister smarter, more efficient, and self-healing every day

---

## Quick Start

```bash
# Run self-check
~/.openclaw/workspace/ops/self-check.sh

# View efficiency report
node ~/.openclaw/workspace/ops/ces-tracker.js

# View subagent performance
node ~/.openclaw/workspace/ops/spf-tracker.js report

# Force knowledge consolidation
~/.openclaw/workspace/ops/kce-consolidate.sh
```

---

## The 6 Systems

### 1. Error Pattern Recognition (EPR)
**File:** `memory/error-patterns.md`  
**Log:** `memory/errors/*.jsonl`  
**Integrated Skill:** `self-improving-agent` (for structured logging)

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

### 2. Context Efficiency Scoring (CES)
**Docs:** `memory/ASIA/CES.md`  
**Tracker:** `ops/ces-tracker.js`  
**DB:** `memory/ASIA/efficiency-db.jsonl`  

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

**Efficiency rules:**
1. Cache files after first read
2. Use `memory_search` not full `MEMORY.md`
3. Batch related tool calls
4. Proactively compact at >80% context

---

### 3. Environment Self-Diagnosis (ESD)
**Script:** `ops/self-check.sh` (runs every 30 min via cron)  
**Log:** `memory/errors/self-check-*.log`  

Detect and fix operational issues automatically.

**Checks every 30 minutes:**
- ✅ Gateway process running & reachable
- ✅ API keys authenticated (all providers)
- ✅ Disk space available (>10GB)
- ✅ Subagents responding

**Auto-fixes:**
- Restart gateway if unreachable
- Alert if API keys fail auth
- Warn if disk space low

---

### 4. Tool Efficiency Profiling (TEP)
**Built into:** All tool calls  
**Tracker:** `memory/tool-efficiency.json`  

Learn which tools work best for which tasks.

**Tracked per call:**
- Tool name & parameters
- Duration
- Success/failure
- Token cost
- Result usefulness

**Optimization matrix:**
| Task | Best Tool | Avoid |
|------|-----------|-------|
| File search | `exec(find)` | `read` + manual scan |
| Git ops | `exec(git)` | `gh` for simple pushes |
| Web scrape | `web_fetch` | `browser` for static |
| Complex edit | `edit` | `write` for small changes |

---

### 5. Knowledge Consolidation Engine (KCE)
**Script:** `ops/kce-consolidate.sh` (runs daily at 11 PM)  
**Archive:** `memory/archive/`  
**Integrated Skill:** `self-improving-agent` (for rich data input)

Distill daily noise into actionable wisdom.

**Daily process:**
1. Reads `memory/YYYY-MM-DD.md` AND `.learnings/*.md`
2. Extracts decisions, errors, patterns, learnings, feature requests
3. Uses `kimi-coding/kimi-k2-thinking` to synthesize
4. Updates `MEMORY.md` with permanent notes
5. Adds new errors to `error-patterns.md`
6. Generates efficiency summary
7. Archives daily file and clears `.learnings/*.md`

**Weekly (Sundays):**
- Aggregate week's learnings
- Generate weekly summary report
- Update optimization playbooks

---

### 6. Subagent Performance Feedback (SPF)
**Docs:** `memory/ASIA/SPF.md`  
**Tracker:** `ops/spf-tracker.js`  
**DB:** `memory/ASIA/spf-db.jsonl`  
**Integrated Skill:** `self-improving-agent` (for subagent error/learning logging)

Optimize which models to use for which tasks.

**Performance Score:**
```
Score = success(30%) + cost_efficiency(25%) + 
        time_efficiency(20%) + quality(15%) + 
        satisfaction(10%)
```

**Auto-optimization:**
- Recommend best model per task type
- Suggest cost savings opportunities
- Flag underperforming models
- Switch models on repeated failures

---

## Automation Schedule

| System | Frequency | Trigger |
|--------|-----------|---------|
| ESD (Self-check) | Every 30 min | Cron job |
| CES (Efficiency) | Real-time | Per action |
| KCE (Consolidation) | Daily 11 PM | Cron job |
| SPF (Weekly report) | Sundays | Manual or cron |
| Error pattern match | Weekly | KCE run |
| Task Watchdog | Every 5 min | Cron job |

---

## File Structure

```
~/.openclaw/workspace/
├── .learnings/              ← NEW: Self-Improvement Skill's logs
│   ├── LEARNINGS.md
│   ├── ERRORS.md
│   └── FEATURE_REQUESTS.md
├── memory/
│   ├── ASIA/
│   │   ├── CES.md              # Context Efficiency docs
│   │   ├── SPF.md              # Subagent Performance docs
│   │   ├── sessions/           # Current session tracking
│   │   ├── efficiency-db.jsonl # CES database
│   │   └── spf-db.jsonl        # SPF database
│   ├── errors/
│   │   ├── README.md           # Error logging format
│   │   ├── *.jsonl             # Daily error logs
│   │   └── self-check-*.log    # ESD logs
│   ├── error-patterns.md       # Known error patterns
│   └── archive/                # KCE archived dailies
├── ops/
│   ├── self-check.sh           # ESD script
│   ├── kce-consolidate.sh      # KCE script
│   ├── ces-tracker.js          # CES implementation
│   ├── spf-tracker.js          # SPF implementation
│   └── task-watchdog.sh        # Task status notifications (cron */5)
└── AGENTS.md                   # Updated with ASIA learnings
```

---

## Success Metrics (30-day targets)

- **Self-healing:** 90% of common errors auto-fixed
- **Efficiency:** 70%+ average context efficiency
- **Cost:** 25% reduction in token spend
- **Speed:** 20% faster task completion
- **Quality:** 15% improvement in output ratings

---

## Integration with Existing Systems

### With TIL (Today I Learned)
- High-efficiency sessions → Extract patterns → Add to TIL
- Low-efficiency sessions → Root cause → Update AGENTS.md

### With Memory System
- Daily logs → KCE → Permanent notes in MEMORY.md
- Error patterns → EPR → Prevention rules

### With Subagent Orchestration
- SPF data → Model selection optimization
- Performance scores → Task assignment

---

## Maintenance

**Weekly (Sundays):**
- Review ASIA performance metrics
- Update error-patterns.md with new findings
- Refine efficiency rules based on data
- Check cron jobs are running

**Monthly:**
- Archive old error logs (>30 days)
- Compact efficiency databases
- Update ASIA documentation
- Report progress to Vit

---

## Emergency Procedures

If ASIA systems fail:
1. Check `ops/self-check.sh` output
2. Verify cron jobs: `crontab -l`
3. Check disk space: `df -h ~/.openclaw`
4. Review logs: `tail -100 memory/errors/*.log`
5. Manual run: `~/.openclaw/workspace/ops/self-check.sh`

---

### 7. Session & Rate Limit Management
**Docs:** `ASIA/Session Management.md`
**Config:** `~/.openclaw/openclaw.json`

Prevent API rate limit exhaustion through smart distribution.
- Heartbeat routed to Kimi K2.5 (off-load Gemini TPM)
- Session maintenance: enforce mode, maxEntries 15, pruneAfter 6h
- Fallback chain: different providers first (Kimi → Haiku → GPT → then Gemini Pro)
- Context pruning: cache-ttl (auto-trim old tool results)
- See [[Session Management]] for full token budget math and monitoring.

---

**ASIA makes Aleister autonomous. Ship it. 🚀**