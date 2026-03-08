# Today I Learned (TIL) Naming Convention

All Today I Learned (TIL) documents in this folder should follow the `YYYY-MM-DD.md` naming convention (zero-padded).

## Examples:
- `2026-02-27.md`
- `2026-10-05.md`
- `2027-01-01.md`

**Always read this README.md before creating a new TIL document to ensure correct naming and formatting.**

---

# Automatic TIL Generation (MCE Integration)

Every night after the MCE (Memory Consolidation Engine) runs, a TIL entry must be written to this folder for that date.

## Rule
After each MCE consolidation cycle, **all memory items that passed a salience score of ≥ 0.75 and were promoted to `MEMORY.md` or `memory/knowledge/*.md`** must also be written to `TIL/YYYY-MM-DD.md` — rephrased in "Today I Learned" format.

## Why
The TIL folder is the human-readable, Obsidian-browsable version of what was learned each day. MEMORY.md is the machine-queryable store. Both should stay in sync for items above the salience threshold.

## How to Write It
1. After MCE completes, collect all items with `salience ≥ 0.75` from that day's consolidation
2. Rephrase each as a "thing I learned" — not raw facts, but insights and understanding
3. Write to `TIL/YYYY-MM-DD.md` following the format below
4. Commit to Git as part of the nightly MCE commit

## Example Rephrasing
- **Raw memory item:** "FundlyHub uses AWS Cognito with Google OAuth federation for authentication"
- **TIL format:** "I learned that FundlyHub's auth stack uses Cognito + Google OAuth, which means session tokens are JWTs managed by AWS — important to know when debugging auth flows or setting CORS rules."

---

# Today I Learned (TIL) Document Format

Each TIL document should adhere to the following structure for clarity and consistency:

## 1. Title
- Use a single top-level heading (`#`)
- Format: `# Today I Learned: <Concise Title of the Day's Learnings>`
  - Example: `# Today I Learned: Fixing Moltbook Deployment and Obsidian Paths`

## 2. Metadata (Optional but Recommended)
- Include these as second-level headings (`##`) immediately after the title:
  - `## Date: YYYY-MM-DD`
  - `## Summary: <A brief, 1-2 sentence summary of the main learnings>`
  - `## Tags: <comma-separated list of relevant tags, e.g., workflow, deployment, obsidian>`

## 3. Main Learnings / Topics
- Use third-level headings (`###`) for each distinct learning or topic.
- Format: `### <Number>. <Topic Title>`
  - Example: `### 1. Obsidian Vault Path Correction`
- Detail each topic using:
  - Bullet points (`- `) for key ideas, facts, or steps.
  - Nested bullet points for sub-details.
  - Optionally, use fourth-level headings (`#### <Letter>. <Sub-topic Title>`) for significant sub-sections within a main topic.

## 4. Key Learnings / Takeaways
- Use a third-level heading (`### Key Learnings`).
- Summarize the most important insights or conclusions from the day.
- Use numbered lists (`1. `) or bullet points (`- `).

## 5. Actionable Insights / How I'll Incorporate This
- Use a third-level heading (`### Actionable Insights`).
- Describe how these learnings will change my future behavior, procedures, or approaches.
- Use numbered lists (`1. `) or bullet points (`- `).

## 6. Next Steps (Optional)
- Use a third-level heading (`### Next Steps`).
- Outline any follow-up tasks or areas for future exploration related to today's learnings.
- Use bullet points.