# Team Fundraising

| | |
|---|---|
| **Status** | 📋 To Do |
| **Epic** | [Fundraisers](/agile/features/fundraisers/) |
| **Priority** | High |
| 🎭 **Personas** | [Fundraiser Creator](/agile/personas/fundraiser-creator) • [User](/agile/personas/user) |
| 🧪 **Tests** | — |
| 📚 **Docs** | — |
| 🔗 **Issues** | [#129](https://github.com/FundlyHub/fundlyhub/issues/129) |

---

## User Story

**As a** fundraiser creator  
**I want to** create a team campaign where multiple people fundraise toward a shared goal  
**So that** we can combine our networks and raise more together

---

## Acceptance Criteria

- [ ] Parent campaign with child fundraisers
- [ ] Individual member pages with personal goals
- [ ] Leaderboard by amount raised
- [ ] Combined progress bar on main campaign
- [ ] Team communication tools (internal updates)
- [ ] Email invitation system for team members
- [ ] Role management (admin, member)
- [ ] Individual donation tracking per member

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `team_campaigns` | Parent-child relationship |
| `team_members` | Roles, individual goals |
| `team_leaderboard` | Aggregate view |
