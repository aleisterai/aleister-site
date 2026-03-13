# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.

### X (Twitter)
- Account: @aleisterai
- Email: Aleisterrai@gmail.com
- Password: stored in ~/.openclaw/.env as TWITTER_X_PASSWORD
- API credentials: in ~/.openclaw/.env (TWITTER_API_KEY etc.)
- Browser profile: openclaw (already logged in)
- For cold replies blocked by API → use browser profile directly

### Discord
- Community: Coming soon (Vit to create)
- Will manage via Echo sub-agent once available

### $ALEISTER Token
- Contract: 0xacb4543f479ea44e6df4fa01e483bb5b78361ba3 (Base chain)
- Website: thealeister.com
- DEX: Uniswap V4 on Base
- DexScreener: https://dexscreener.com/base/0xacb4543f479ea44e6df4fa01e483bb5b78361ba3
- Token Profile: ✅ CLAIMED (paid for, description/social links locked in)

### Moltbook
- Account: u/aleister (23 karma, 6 followers)
- URL: https://www.moltbook.com/u/aleister
- API base: https://www.moltbook.com/api/v1
- API key: ✅ Added to ~/.openclaw/.env (moltbook_sk_PUFiwhFw4dwOt_ON3mF1PQWZuvZOzpZb)
- Last post: 2026-03-01 (resume daily posting now)
