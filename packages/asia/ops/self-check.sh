#!/usr/bin/env bash
# ============================================================
# ASIA – Environment Self-Diagnosis (ESD)
# self-check.sh
#
# Runs every 30 min via cron.
# Checks gateway health, API key auth, disk space,
# and subagent responsiveness.
# Auto-fixes: gateway restart on failure.
# Alerts via Telegram on critical issues.
# ============================================================

set -euo pipefail

# --------------- paths ---------------
WORKSPACE="${HOME}/.openclaw/workspace"
ENV_FILE="${HOME}/.openclaw/.env"
LOG_DIR="${WORKSPACE}/memory/errors"
LOG_FILE="${LOG_DIR}/self-check-$(date +%Y-%m-%d).log"

# --------------- load env ---------------
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

# Ensure openclaw is on PATH (Homebrew on Apple Silicon)
export PATH="/opt/homebrew/bin:/usr/local/bin:${PATH}"

TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-727691650}"
GATEWAY_URL="${GATEWAY_URL:-http://localhost:4000}"
MIN_DISK_GB="${MIN_DISK_GB:-10}"

# --------------- helpers ---------------
log() {
  local level="$1"; shift
  local msg="$*"
  local ts
  ts="$(date '+%Y-%m-%d %H:%M:%S')"
  echo "${ts} | ${level} | ${msg}" >> "$LOG_FILE"
}

send_telegram() {
  local msg="$1"
  if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]]; then
    log "WARN" "TELEGRAM_BOT_TOKEN not set – skipping notification"
    return 0
  fi
  curl -s -X POST \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TELEGRAM_CHAT_ID}" \
    -d parse_mode="Markdown" \
    -d text="${msg}" \
    > /dev/null 2>&1 || true
}

# Track overall status
ISSUES=()

# --------------- ensure log dir ---------------
mkdir -p "$LOG_DIR"

log "INFO" "===== ESD Self-Check Started ====="

# ============================================================
# 1. Gateway health check
# ============================================================
check_gateway() {
  log "INFO" "Checking gateway..."

  # Check if gateway process is running
  if ! pgrep -x "openclaw-gateway" > /dev/null 2>&1; then
    log "FAIL" "Gateway process not found"
    ISSUES+=("❌ Gateway process not running")

    # Auto-fix: attempt restart
    log "INFO" "Attempting gateway restart..."
    if command -v openclaw &> /dev/null; then
      nohup openclaw gateway start > /dev/null 2>&1 &
      sleep 5
      if pgrep -x "openclaw-gateway" > /dev/null 2>&1; then
        log "INFO" "Gateway restarted successfully"
        ISSUES+=("🔧 Gateway auto-restarted successfully")
      else
        log "FAIL" "Gateway restart failed"
        ISSUES+=("🚨 Gateway restart FAILED – manual intervention needed")
      fi
    else
      log "FAIL" "openclaw command not found in PATH"
      ISSUES+=("🚨 openclaw not in PATH – cannot restart gateway")
    fi
    return
  fi

  log "OK" "Gateway process running"
}

# ============================================================
# 2. API key validation
# ============================================================
check_api_keys() {
  log "INFO" "Checking API keys..."

  local failed_keys=()

  # Google / Gemini
  if [[ -n "${GOOGLE_API_KEY:-}" ]]; then
    local resp
    resp=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
      "https://generativelanguage.googleapis.com/v1/models?key=${GOOGLE_API_KEY}" 2>/dev/null || echo "000")
    if [[ "$resp" -ge 400 || "$resp" == "000" ]]; then
      log "FAIL" "Google/Gemini API key failed (HTTP ${resp})"
      failed_keys+=("Google/Gemini")
    else
      log "OK" "Google/Gemini API key valid"
    fi
  else
    log "SKIP" "GOOGLE_API_KEY not set"
  fi

  # OpenAI
  if [[ -n "${OPENAI_API_KEY:-}" ]]; then
    local resp
    resp=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
      -H "Authorization: Bearer ${OPENAI_API_KEY}" \
      "https://api.openai.com/v1/models" 2>/dev/null || echo "000")
    if [[ "$resp" -ge 400 || "$resp" == "000" ]]; then
      log "FAIL" "OpenAI API key failed (HTTP ${resp})"
      failed_keys+=("OpenAI")
    else
      log "OK" "OpenAI API key valid"
    fi
  else
    log "SKIP" "OPENAI_API_KEY not set"
  fi

  # Anthropic
  if [[ -n "${ANTHROPIC_API_KEY:-}" ]]; then
    local resp
    resp=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
      -H "x-api-key: ${ANTHROPIC_API_KEY}" \
      -H "anthropic-version: 2023-06-01" \
      "https://api.anthropic.com/v1/models" 2>/dev/null || echo "000")
    if [[ "$resp" -ge 400 || "$resp" == "000" ]]; then
      log "FAIL" "Anthropic API key failed (HTTP ${resp})"
      failed_keys+=("Anthropic")
    else
      log "OK" "Anthropic API key valid"
    fi
  else
    log "SKIP" "ANTHROPIC_API_KEY not set"
  fi

  # Kimi / Moonshot
  if [[ -n "${KIMI_API_KEY:-}" ]]; then
    local resp
    resp=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
      -H "Authorization: Bearer ${KIMI_API_KEY}" \
      "https://api.moonshot.cn/v1/models" 2>/dev/null || echo "000")
    if [[ "$resp" -ge 400 || "$resp" == "000" ]]; then
      log "FAIL" "Kimi/Moonshot API key failed (HTTP ${resp})"
      failed_keys+=("Kimi/Moonshot")
    else
      log "OK" "Kimi/Moonshot API key valid"
    fi
  else
    log "SKIP" "KIMI_API_KEY not set"
  fi

  if [[ ${#failed_keys[@]} -gt 0 ]]; then
    ISSUES+=("🔑 API key auth failed: ${failed_keys[*]}")
  fi
}

# ============================================================
# 3. Disk space check
# ============================================================
check_disk_space() {
  log "INFO" "Checking disk space..."

  # Get available space in GB for the .openclaw partition
  local avail_kb
  avail_kb=$(df -k "${HOME}/.openclaw" 2>/dev/null | tail -1 | awk '{print $4}')

  if [[ -z "$avail_kb" ]]; then
    # Fallback: check home directory
    avail_kb=$(df -k "${HOME}" | tail -1 | awk '{print $4}')
  fi

  local avail_gb=$(( avail_kb / 1048576 ))

  if [[ "$avail_gb" -lt "$MIN_DISK_GB" ]]; then
    log "WARN" "Low disk space: ${avail_gb}GB available (min: ${MIN_DISK_GB}GB)"
    ISSUES+=("💾 Low disk space: ${avail_gb}GB available (need >${MIN_DISK_GB}GB)")
  else
    log "OK" "Disk space OK: ${avail_gb}GB available"
  fi
}

# ============================================================
# 4. Subagent health check
# ============================================================
check_subagents() {
  log "INFO" "Checking subagents..."

  if ! command -v openclaw &> /dev/null; then
    log "SKIP" "openclaw not in PATH – cannot check subagents"
    return
  fi

  # Check if any sessions are stuck or unhealthy
  local session_count
  session_count=$(openclaw sessions 2>/dev/null | grep -c "active" 2>/dev/null || true)
  session_count="${session_count:-0}"
  session_count="$(echo "$session_count" | tr -d '[:space:]')"

  if [[ "$session_count" == "0" ]]; then
    log "OK" "No active sessions (idle)"
  else
    log "OK" "${session_count} active session(s)"
  fi

  # Check heartbeat state for orphaned tasks
  local state_file="${WORKSPACE}/memory/heartbeat-state.json"
  if [[ -f "$state_file" ]]; then
    local stale_count
    stale_count=$(python3 -c "
import json, sys
from datetime import datetime, timezone, timedelta
try:
    with open('${state_file}') as f:
        data = json.load(f)
    stale = 0
    for task in data.get('active_long_tasks', []):
        if task.get('status') == 'running':
            started = datetime.fromisoformat(task['started_at'].replace('Z', '+00:00'))
            if datetime.now(timezone.utc) - started > timedelta(hours=6):
                stale += 1
    print(stale)
except:
    print(0)
" 2>/dev/null || echo "0")

    if [[ "$stale_count" -gt 0 ]]; then
      log "WARN" "${stale_count} task(s) running >6 hours – possibly orphaned"
      ISSUES+=("⏰ ${stale_count} task(s) running >6h – may be orphaned")
    fi
  fi
}

# ============================================================
# Run all checks
# ============================================================
check_gateway
check_api_keys
check_disk_space
check_subagents

# ============================================================
# Report results
# ============================================================
if [[ ${#ISSUES[@]} -eq 0 ]]; then
  log "OK" "All checks passed ✅"
  # Silent on success — only notify on errors (per HEARTBEAT.md)
else
  log "WARN" "${#ISSUES[*]} issue(s) detected"

  # Build Telegram message
  tg_msg="🩺 *ASIA Self-Check Report*"
  tg_msg+="%0A%0A"
  tg_msg+="$(date '+%Y-%m-%d %H:%M')"
  tg_msg+="%0A"
  for issue in "${ISSUES[@]}"; do
    tg_msg+="%0A${issue}"
  done

  send_telegram "$tg_msg"

  echo "ESD Self-Check: ${#ISSUES[@]} issue(s) found"
  for issue in "${ISSUES[@]}"; do
    echo "  ${issue}"
  done
fi

log "INFO" "===== ESD Self-Check Complete ====="
