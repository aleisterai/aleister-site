# Error Patterns & Self-Healing Registry

This file tracks recurring errors and their solutions for automated prevention.

## Active Error Patterns

### Pattern: GEMINI_MODEL_NOT_FOUND
- **Error signature:** `models/gemini-X.X-X is not found for API version`
- **Root cause:** Model name changed or deprecated by provider
- **Solution:** Check `openclaw models list` before using; fallback to stable model
- **Auto-fix:** Switch to `gemini-1.5-flash` or `gemini-2.5-flash` if available
- **Last seen:** 2026-02-25
- **Status:** Active - monitor model announcements

### Pattern: GATEWAY_VERSION_MISMATCH
- **Error signature:** Gateway reports wrong version (e.g., 2026.2.23 instead of 2026.2.24)
- **Root cause:** Display bug, not functional issue
- **Solution:** Restart gateway; check LaunchAgent plist
- **Auto-fix:** None needed if functionality works
- **Last seen:** 2026-02-25
- **Status:** Cosmetic - ignore unless functionality broken

### Pattern: SUBAGENT_TIMEOUT
- **Error signature:** Subagent spawned but no output after extended period
- **Root cause:** Task too large, API rate limit, or process hang
- **Solution:** Break task into smaller chunks; check API quotas; respawn
- **Auto-fix:** Kill and respawn with smaller scope
- **Last seen:** 2026-02-25
- **Status:** Active - use smaller tasks

### Pattern: GIT_PUSH_TIMEOUT
- **Error signature:** Git push hangs or times out
- **Root cause:** Network issue, credential helper problem
- **Solution:** Use `gh` CLI with PAT; check `credential.helper` config
- **Auto-fix:** Switch to `gh auth git-credential`
- **Last seen:** 2026-02-25
- **Status:** Resolved - use gh CLI

## Prevention Rules (Auto-applied before tool calls)

1. **Before model spawn:** Verify model exists in fallback chain (see MODEL_INSTRUCTIONS.md)
2. **Before git push:** Check credential helper is configured
3. **Before subagent spawn:** Verify task is under 500 tokens description
4. **Before file write:** Check directory exists, create if needed
5. **Before API call:** Verify API key env var is set and length > 20

## Learning Heuristics

- If same error occurs 3x in 24h → Escalate to pattern registry
- If auto-fix succeeds 3x → Promote to automatic pre-flight check
- If error has no known pattern → Create new pattern entry with investigation flag
### Pattern: CONFIG_SELF_MODIFICATION
- **Error signature:** `Unrecognized key:` or `JSON5 parse failed` in config validation
- **Root cause:** Agent modifying ~/.openclaw/openclaw.json directly, adding unknown keys (sessions, meta, wizard, tools, messages, commands) or corrupting JSON syntax
- **Solution:** NEVER edit openclaw.json. Use `openclaw configure` or `openclaw models set` from terminal
- **Auto-fix:** Restore from .bak, remove invalid keys, restart gateway
- **Last seen:** 2026-02-25 (5 occurrences in one day)
- **Status:** CRITICAL - Prevention rule added to MODEL_INSTRUCTIONS.md
- **Prevention:** MODEL_INSTRUCTIONS.md rule #1: "NEVER edit, write to, or modify openclaw.json"

### Pattern: TELEGRAM_BOT_CRASH_LOOP
- **Error signature:** `telegram deleteWebhook failed: 404` + `auto-restart attempt N/10`
- **Root cause:** Invalid/expired Telegram bot token causing channel crash loop, blocking all channels
- **Solution:** Disable Telegram or replace bot token via @BotFather
- **Auto-fix:** Disable telegram channel if crash loop detected >3 attempts
- **Last seen:** 2026-02-25
- **Status:** Active

### Pattern: KIMI_CODING_ACCESS_DENIED
- **Error signature:** `Kimi For Coding is currently only available for Coding Agents`
- **Root cause:** Kimi Coding API restricts access to recognized coding agents (Claude Code, Roo Code, etc.)
- **Solution:** Use kimi-coding through OpenClaw which is recognized as a coding agent
- **Auto-fix:** None - must use OpenClaw as intermediary, not direct curl
- **Last seen:** 2026-02-25
- **Status:** Resolved - OpenClaw handles authentication correctly
