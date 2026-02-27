# Mac Mini Memory Manager (MMS)

**Created:** 2026-02-25  
**Script:** `~/.openclaw/workspace/ops/memory-manager.sh`  
**Cron:** Every 30 minutes  
**Purpose:** Infrastructure service — prevents Mac Mini lag from RAM exhaustion on 16GB system  
**Note:** This is a hardware RAM management service, separate from Aleister's cognitive memory system ([[Memory System]])

---

## Why This Exists

On 2026-02-25, the Mac Mini was showing 14GB/16GB RAM used with only 1.3GB free. Investigation revealed:

- **4 zombie WebKit processes** consuming 1.9GB total
- **openclaw-gateway** at 390MB
- **Brave browser** at 650MB
- **Swap: 0MB** — macOS wasn't swapping yet, but was close

macOS reports cached/inactive memory as "used", making it look worse than reality. The **actual usage was 36%** (active + wired), with 5.6GB inactive (reclaimable cache). However, without management, heavy sessions can push into real pressure.

---

## How It Works

The script uses a **tiered response system**:

| Level | Threshold | Actions |
|-------|-----------|---------|
| 🟢 Normal | <85% real usage | No action, log hourly |
| 🟡 High | ≥85% | `purge` (flush disk cache) + kill zombie WebKit |
| 🔴 Critical | ≥92% | All above + kill browsers (Safari, Brave, Chrome) |

### What Gets Measured
- **Real usage** = Active + Wired memory (not inactive/cached)
- **Reclaimable** = Inactive + Purgeable pages
- **Swap** = Monitored but currently 0MB

### What Never Gets Killed
- `openclaw-gateway` — core agent runtime
- `Messages.app` — iMessage channel
- `sshd` — remote access
- `imsg` — iMessage CLI

---

## Usage

```bash
# Check current memory status
~/.openclaw/workspace/ops/memory-manager.sh --status

# Force flush (purge cache + kill zombie WebKit)
~/.openclaw/workspace/ops/memory-manager.sh --force

# Aggressive (also kills browsers)
~/.openclaw/workspace/ops/memory-manager.sh --aggressive

# Auto mode (what cron runs — acts only if thresholds exceeded)
~/.openclaw/workspace/ops/memory-manager.sh
```

---

## Related Ops Services

| Service | Schedule | Purpose |
|---------|----------|---------|
| **MMS** (this script) | Every 30 min | Hardware RAM monitoring + flush |
| **Session Lifecycle** | Hourly | Session bloat detection + archival |
| **ESD** (Self-Check) | Every 2 hours | Gateway + API health monitoring |
| **MCE** (Consolidation) | Daily 11 PM | Cognitive memory extraction + scoring |
| **Task Watchdog** | Every 5 min | Proactive Telegram notifications for long-running tasks |

> **Note:** MMS manages **hardware RAM** (Mac Mini physical memory). For Aleister's **cognitive memory** (what he knows and remembers), see [[Memory System]].

---

## Logs

- **Log file:** `~/.openclaw/workspace/memory/errors/memory-manager.log`
- **Format:** `YYYY-MM-DD HH:MM:SS | MESSAGE`

---

*Do NOT modify this script. If changes are needed, coordinate with Vit.*
