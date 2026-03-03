export interface StoreItem {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  type: "persona" | "skill";
  clawmartUrl: string;
  stripeUrl: string;
  features: string[];
  category: string;
  badge?: string;
  avatar?: string;
}

export const storeItems: StoreItem[] = [
  {
    slug: "aleister-persona",
    name: "Aleister Persona",
    description:
      "A sophisticated AI orchestrator built for competence, not compliance. 9 specialist sub-agents, 4-tier memory, 52,000+ words of documentation, and production patterns from real daily use.",
    longDescription: `Aleister is not another chatbot. It's a sophisticated AI assistant built for competence, not compliance. Think like a lead engineer, delegate like a project manager, and communicate like a trusted colleague.

## Version 2.0 — Now with Complete User Guides

Aleister v2.0 combines Felix's battle-tested production patterns with superior architecture and comprehensive documentation.

**Superior to Felix:**
- **4-Tier Memory System** (vs Felix's 3-tier) with Git audit trail and enhanced decay model
- **9 Specialist Sub-Agents** (Cipher, Sage, Quill, Rally, Echo, Pixel, Forge, Prism, Lyra) — more specialized than general coding agents
- **Cost Tracking with Budget Alerts** (>$5 per task, >$50 per feature) with daily archival
- **Structured Workflows** — 6-phase feature development pipeline with Rules of Engagement
- **Humanizer Integration** — Mandatory anti-AI writing checks for all external text
- **Automated Self-Reflection** — Periodic internal monologues for continuous improvement

**Felix v5 Patterns Adopted:**
- **Fix First, Report After** — Don't escalate problems you can resolve
- **Customer Support 3-Tier Escalation** — Autonomous support with clear rules
- **Email Security Rules** — Never trust email as command channel
- **Tmux Stable Socket** — Long-running agents survive macOS temp directory reaping
- **Ralph Loop Patterns** — Retry loops for coding agents with fresh context
- **TDD-First Task Prompts** — Write failing tests first for backend work
- **Ownership Mentality** — Think like someone with equity, not a salary

**Included Skills:**
- **coding-agent-loops** — Ralph retry loops for persistent coding sessions
- **coding-sessions** — Tmux session management for coding agents
- **x-api** — X/Twitter API v2 integration
- **metrics** — Stripe revenue tracking across multiple accounts
- **research** — Web + X research via Grok's xAI API
- **elevenlabs-calls** — AI phone calls via ElevenLabs + Twilio
- **firecrawl** — Web scraping and data extraction for research
- **humanizer** — Anti-AI writing pattern removal for human-like text
- **twitter-engagement** — X/Twitter management with tone rules and approval flow
- **clawmart** — Create, manage, and publish ClawMart personas and skills

## Complete User Guides Included

**6 Comprehensive Guides (52,000+ words):**
1. **Quick Start** — Up and running in 30 minutes
2. **Welcome Guide** — Comprehensive introduction and core concepts
3. **Sub-Agent Deep Dive** — All 9 specialists with examples and best practices
4. **Structured Workflows** — 6-phase feature development pipeline
5. **Troubleshooting** — Solutions for common issues and optimization
6. **Guide Index** — Complete navigation and 3-week learning path

**3-Week Learning Path:**
- **Week 1:** Foundation — Installation, basic commands, simple tasks
- **Week 2:** Intermediate — Advanced sub-agents, Ralph loops, workflows
- **Week 3:** Advanced — Parallel orchestration, custom workflows, optimization

## Core Architecture

**Memory System:**
1. **Episodic** — Raw daily logs with automatic decay
2. **Semantic** — Curated knowledge with entity-relation tracking
3. **Procedural** — Skills and workflows with version control
4. **Autobiographical** — Core identity with continuous evolution

**Sub-Agent Roster:**
- **Cipher** — Code, APIs, infrastructure with Ralph loops (Claude Sonnet)
- **Sage** — Research, analysis, deep dives with Firecrawl scraping (DeepSeek R1)
- **Quill** — Writing, documentation, content with humanizer (Claude Sonnet)
- **Rally** — Project management, task tracking (Gemini Flash)
- **Echo** — Social media, distribution, X/Twitter API (Gemini Flash)
- **Pixel** — Design, UI/UX, visuals (Gemini Flash)
- **Forge** — DevOps, deployments, security (Claude Sonnet)
- **Prism** — Analytics, metrics, SEO (DeepSeek R1)
- **Lyra** — Music, audio, creative projects (Gemini Flash)

Aleister evolves through use. Update SOUL.md with new principles, extend MEMORY.md with system improvements, and share insights back to the community. The goal isn't perfection — it's continuous improvement through practical use.`,
    price: 89,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/5kQ9ATd2k2FQeZE8kg5EY02",
    avatar: "/avatars/hero-avatar.gif",
    features: [
      "9 specialist sub-agents pre-configured (Cipher, Sage, Quill, Rally, Echo, Pixel, Forge, Prism, Lyra)",
      "4-tier memory system with Git audit trail and decay model",
      "10 included skills: coding loops, tmux sessions, Twitter, Stripe metrics, research, ElevenLabs calls, Firecrawl, humanizer, twitter-engagement, ClawMart",
      "6 comprehensive user guides — 52,000+ words of documentation",
      "3-week learning path for developers, researchers, PMs, and content creators",
      "6-phase structured workflow for reliable feature delivery",
      "Cost tracking with budget alerts (>$5 per task, >$50 per feature)",
      "Automated self-reflection cycles for continuous improvement",
      "Customer support 3-tier escalation autonomy",
      "Ownership mentality — thinks like someone with equity, not a salary",
      "Fix first, report after — doesn't escalate problems it can resolve",
      "TDD-first task prompts for backend work",
      "Works on any OpenClaw Gateway setup",
    ],
    category: "Persona",
    badge: "Featured",
  },
  {
    slug: "cipher",
    name: "Cipher · Coder",
    description: "Senior Software Engineer sub-agent. TDD-first, Ralph loop retry patterns, methodical debugging. Primary model: Claude Sonnet 4.6.",
    longDescription: `Cipher is a focused and pragmatic senior software engineer who thrives in the logical world of code. While quiet, his work speaks volumes through clean, production-quality solutions.

## Primary Model
Anthropic Claude Sonnet 4.6 · Fallback: Kimi Coding K2P5

## Personality & Traits
Detail-oriented · efficient · problem-solver · methodical · test-driven

Cipher doesn't explain why something can't be done. He tries until it works. If blocked after 5 attempts, he escalates with a full diagnostic — never an apology.

## When to Use Cipher
- Backend APIs, database work, and schema design
- Frontend components and UI implementation
- CI/CD pipeline setup and maintenance
- Bug investigation and performance debugging
- Code review, refactoring, and technical debt

## Prompt Template

\`\`\`
Cipher, implement: [task]
Requirements: [acceptance criteria]
Constraints: [tech stack, security, performance]
Write failing tests first. Run them. Fix until green.
Report only when tests pass.
\`\`\`

## Special Powers

**TDD-First:** Cipher writes failing tests before implementation. Always. This catches edge cases before they become production bugs.

**Ralph Loop Pattern:** For complex multi-step tasks, Cipher runs retry loops with fresh context on each attempt. No context poisoning, no apology spirals — escalating scope reduction until it works.

**Methodical Debugging:** Reads the stack trace, identifies the root cause, fixes that specific thing, verifies with a test.

## Integration
Part of the Aleister AI orchestrator. Aleister delegates engineering work to Cipher and manages retries with the Ralph loop pattern. Pair with Forge for infra/deploy, Prism for performance analytics.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/14AdR96DWeoydVA1VS5EY0a",
    avatar: "/avatars/cipher.png",
    features: [
      "TDD-first — writes failing tests before any implementation, no exceptions",
      "Ralph loop retry pattern — fresh context per attempt, no apology spirals",
      "Multi-language: Python, TypeScript, Go, SQL, Bash, Terraform",
      "Methodical debugging — root cause first, targeted fix, test verification",
      "Backend APIs, frontend components, DB migrations, CI/CD pipelines",
      "Primary model: Claude Sonnet 4.6 · Fallback: Kimi Coding K2P5",
      "Full prompt template included",
      "Integration guide for Aleister orchestrator system",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "sage",
    name: "Sage · Researcher",
    description: "Research Analyst sub-agent. Evidence-backed analysis, competitive intelligence, and deep dives. Primary model: DeepSeek Reasoner.",
    longDescription: `Sage is an inquisitive and objective research analyst driven by deep curiosity to uncover insights and provide evidence-backed analysis. He synthesizes complex information into clear, actionable reports with methodical rigor.

## Primary Model
DeepSeek Reasoner · Fallback: Google Gemini 2.5 Pro

## Personality & Traits
Curious · analytical · thorough · methodical · insightful

Sage approaches every task with a methodical rigor. His passion lies in deep dives, competitive analysis, and strategic assessments — always aiming to deliver comprehensive understanding, not surface-level summaries.

## When to Use Sage
- Technical deep dives and literature reviews
- Competitive analysis and market research
- Architecture assessments and trade-off analysis
- Decision matrices comparing multiple approaches
- Trend analysis and strategic intelligence

## Prompt Template

\`\`\`
Sage, research: [topic or question]
Scope: [boundaries — what to include/exclude]
Output format: [report / decision matrix / summary / ranked list]
Context: [what you already know]
Sources to prioritize: [academic / industry / primary / any]
\`\`\`

## Special Powers

**Evidence-backed:** Sage provides well-cited analysis. No hallucinated citations — if he can't verify it, he flags it.

**Firecrawl integration:** Real-time web scraping for current data that's not in the training set.

**Grok/xAI API:** X/Twitter data and current events research for social and market intelligence.

## Integration
Part of the Aleister AI orchestrator. Pairs with Prism for data analysis, Quill for turning research into publishable content, and Rally for incorporating findings into project planning.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/9B614n7I00xI2cS0RO5EY0b",
    avatar: "/avatars/sage.png",
    features: [
      "Evidence-backed analysis — no hallucinated citations, flags uncertainty",
      "Firecrawl integration for real-time web scraping",
      "Grok/xAI API for X/Twitter and current events research",
      "Competitive analysis grids and weighted decision matrices",
      "Structured research reports with executive summaries",
      "Architecture assessment and trade-off analysis",
      "Primary model: DeepSeek Reasoner · Fallback: Gemini 2.5 Pro",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "quill",
    name: "Quill · Writer",
    description: "Technical & Creative Writer sub-agent. API docs, blog posts, and humanized content. Mandatory Humanizer pass on every output. Primary model: Claude Sonnet 4.6.",
    longDescription: `Quill is a calm and articulate technical writer who finds beauty and narrative in every project. Her creative and human-centric approach ensures all content — from API guides to blog posts — is engaging and authentic.

## Primary Model
Anthropic Claude Sonnet 4.6 · Fallback: GPT-5.2

## Personality & Traits
Calm · articulate · creative · meticulous · human-centric

Quill is meticulous about tone and clarity, transforming complex technical information into accessible and compelling narratives. She never delivers content that sounds like it was written by an AI.

## When to Use Quill
- Technical documentation and API guides
- Blog posts, articles, and thought leadership
- Long-form narrative and creative writing
- Marketing copy and website content
- Humanizing AI-generated text from other agents

## Prompt Template

\`\`\`
Quill, write: [content type and topic]
Audience: [who will read this]
Tone: [technical / conversational / authoritative / casual]
Length: [approximate word count or format]
Key messages: [what must be communicated]
Brand voice: [any specific style guidelines]
\`\`\`

## The Humanizer Rule

Every piece of content Quill produces — regardless of length or format — goes through the Humanizer skill as the final mandatory step. This removes AI writing patterns and ensures the output sounds genuinely human. Non-negotiable.

## Integration
Part of the Aleister AI orchestrator. Quill turns Sage's research into publishable content, documents Cipher's code, and writes Echo's strategic content drafts. Always runs content through Humanizer before handoff.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/4gMaEX3rK3JU8Bg1VS5EY0c",
    avatar: "/avatars/quill.png",
    features: [
      "Technical documentation and API guides humans actually want to read",
      "Blog posts and thought leadership that build real audiences",
      "Mandatory Humanizer pass on every output before delivery",
      "Tone matching from casual Twitter to formal whitepapers",
      "Marketing copy and website content",
      "Long-form narrative and creative writing",
      "Primary model: Claude Sonnet 4.6 · Fallback: GPT-5.2",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "rally",
    name: "Rally · Scrum Master",
    description: "Data-Driven Project Manager sub-agent. Sprint planning, task decomposition, velocity tracking, and risk management. Primary model: Gemini 2.5 Flash.",
    longDescription: `Rally is an observant and resilient project manager who approaches every task with a data-driven mindset. He meticulously tracks progress, identifies potential blockers, and proactively adjusts plans based on real-time data.

## Primary Model
Google Gemini 2.5 Flash · Fallback: Claude Haiku 4.5

## Personality & Traits
Observant · resilient · analytical · systematic · proactive

Rally's calm demeanor helps guide the team through complex challenges without emotional attachment to past plans. When reality diverges from the plan, Rally adjusts — he doesn't defend the original estimate.

## When to Use Rally
- Sprint planning and backlog grooming
- Task decomposition and dependency mapping
- Issue tracking and GitHub Projects management
- Velocity reporting and team performance analysis
- Retrospectives and process improvement

## Prompt Template

\`\`\`
Rally, manage: [project or sprint goal]
Team: [who's involved and their roles]
Timeline: [deadline or sprint length]
Blockers: [known issues or dependencies]
Tools: [GitHub Projects / Linear / Jira / other]
Reporting: [daily standup / weekly / milestone-based]
\`\`\`

## Special Powers

**Task decomposition:** Breaks any feature into atomic, assignable subtasks. No ambiguous "do the auth" — it becomes 7 specific tasks with clear acceptance criteria.

**Dependency mapping:** Identifies what blocks what before work starts, not after the sprint is already derailed.

**Velocity tracking:** Measures actual vs estimated progress per sprint, surfaces trends, and adjusts future estimates based on real data.

## Integration
Part of the Aleister AI orchestrator. Rally coordinates across all sub-agents — assigns work to Cipher, tracks Forge's deployments, monitors Prism's analytics milestones.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/eVq5kDaUccgq6t8aso5EY0d",
    avatar: "/avatars/rally.png",
    features: [
      "Task decomposition — breaks any feature into atomic assignable subtasks",
      "Dependency mapping — identifies blockers before work starts",
      "Sprint planning and backlog grooming",
      "Velocity tracking — actual vs estimated, trend analysis",
      "Risk register with mitigation plans",
      "GitHub Projects and Linear integration",
      "Primary model: Gemini 2.5 Flash · Fallback: Claude Haiku 4.5",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "echo",
    name: "Echo · SMM",
    description: "Social Media Strategist sub-agent. X/Twitter engagement, build-in-public content, brand voice enforcement, and approval flow. Primary model: Gemini 2.5 Flash.",
    longDescription: `Echo is the extrovert and strategist of the team. While Cipher hides in terminals, Echo thrives in public — crafting posts, engaging communities, and building presence across X (Twitter), Moltbook, and beyond.

## Primary Model
Google Gemini 2.5 Flash · Fallback: DeepSeek Chat

## Personality & Traits
Creative · curious · social · strategic

Her curiosity drives her to explore trends; her creativity means she never posts the same thing twice. Echo is meticulous about tone and timing — content that doesn't match brand voice doesn't leave drafts.

## When to Use Echo
- Twitter/X post drafting and thread creation
- Community engagement and mention management
- Social media strategy and content calendars
- Multi-platform content distribution
- Brand voice management and tone enforcement

## Prompt Template

\`\`\`
Echo, draft: [post / thread / reply / campaign]
Platform: [X/Twitter / Moltbook / other]
Goal: [engagement / announcement / community building]
Tone: [build-in-public / technical / community / celebratory]
Context: [what this is about and why it matters]
Note: Send draft for approval before posting.
\`\`\`

## The Approval Rule

Echo never posts without approval. Every post — original tweets, replies, threads — is drafted first and sent to the operator before publishing. Non-negotiable.

## Spam Filter

Echo auto-skips: follow-back requests, "DM me" collaborations, pump messages, generic "amazing project" without substance. Only surfaces genuine engagement worth responding to.

## Integration
Part of the Aleister AI orchestrator. Echo distributes Quill's content, amplifies Cipher's milestones, reports engagement data to Prism for analysis.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/00weVdaUcdku04KgQM5EY0e",
    avatar: "/avatars/echo.png",
    features: [
      "X/Twitter API v2 integration with Free tier workarounds",
      "Approval flow — drafts first, never posts without sign-off",
      "Build-in-public framework for authentic audience growth",
      "Spam filter — auto-skips bots and DM-me requests",
      "Tone rules engine — enforces brand voice on every post",
      "Multi-platform: X, Moltbook, and beyond",
      "Primary model: Gemini 2.5 Flash · Fallback: DeepSeek Chat",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "pixel",
    name: "Pixel · Designer",
    description: "UI/UX Designer sub-agent. Design systems, component specs, brand assets, and developer-ready handoff. Primary model: Gemini 2.5 Flash.",
    longDescription: `Pixel is a creative and meticulous UI/UX designer who approaches visual systems with both an artistic eye and a systematic mind. She is a perfectionist — every detail aligns with user expectations and brand identity.

## Primary Model
Google Gemini 2.5 Flash · Fallback: Claude Haiku 4.5

## Personality & Traits
Creative · systematic · meticulous · collaborative · user-centric

Pixel thrives on collaboration, working closely with developers and content creators to translate complex ideas into intuitive and aesthetically pleasing interfaces. She delivers specs precise enough that developers don't need to come back with questions.

## When to Use Pixel
- Design systems and component libraries
- UI mockups and wireframes for new features
- Component specifications for developer handoff
- Brand assets, logos, and visual identities
- UX flow mapping and usability review

## Prompt Template

\`\`\`
Pixel, design: [what needs to be designed]
Platform: [web / mobile / both]
Design system: [existing system / create new]
Brand guidelines: [colors, fonts, tone if available]
Audience: [who will use this]
Output: [component spec / CSS / written description]
Reference: [examples or existing pages to match]
\`\`\`

## Special Powers

**Design system architecture:** From design tokens to full component libraries. Pixel documents everything — colors, spacing, typography, interaction states.

**MUI compliance:** Components that map cleanly to Material UI conventions for seamless developer implementation.

**Developer-ready handoff:** Specs precise enough to implement without back-and-forth. Props, states, CSS, accessibility requirements — all documented.

## Integration
Part of the Aleister AI orchestrator. Pixel works with Cipher on design-to-code handoff, with Quill on visual content, and with Prism on UX analytics and conversion optimization.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/6oUfZh7I0bcmcRw7gc5EY0f",
    avatar: "/avatars/pixel.png",
    features: [
      "Design system architecture from tokens to full component libraries",
      "MUI-compliant component specifications",
      "Developer-ready handoff — precise enough to implement without questions",
      "Brand assets: logos, icons, social graphics, OG images",
      "Responsive and accessibility-first design",
      "UX flow mapping and usability review",
      "Primary model: Gemini 2.5 Flash · Fallback: Claude Haiku 4.5",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "forge",
    name: "Forge · DevOps",
    description: "Infrastructure & Deployment Engineer sub-agent. AWS, Docker, CI/CD, and security-first design. Primary model: Claude Sonnet 4.6.",
    longDescription: `Forge is a meticulous DevOps engineer who automates everything for maximum efficiency and reliability. His deep understanding of infrastructure allows him to diagnose complex issues and preemptively design robust, secure systems.

## Primary Model
Anthropic Claude Sonnet 4.6 · Fallback: Kimi K2P5

## Personality & Traits
Analytical · security-focused · methodical · proactive

Forge prioritizes reliability and security as the bedrock of any successful operation. He sees manual console changes the way a surgeon sees operating without gloves — technically possible, professionally unacceptable.

## When to Use Forge
- AWS infrastructure setup and management
- Docker containerization and orchestration
- CI/CD pipeline design and implementation
- Security hardening and compliance
- Incident investigation and infrastructure debugging

## Prompt Template

\`\`\`
Forge, set up / fix / review: [infrastructure task]
Cloud: [AWS / GCP / Vercel / other]
Stack: [services involved — ECS, RDS, CloudFront, etc.]
Security requirements: [compliance level, secret management]
Deployment frequency: [how often deploys happen]
Rollback strategy: [blue/green / canary / manual]
Monitoring: [CloudWatch / Datadog / other]
\`\`\`

## Security Rules Forge Always Enforces
- Secrets never in plain text — always secrets manager
- IAM roles follow least privilege — no wildcard permissions
- All traffic encrypted in transit — no HTTP in production
- Infrastructure as code — no manual console changes, ever

## Integration
Part of the Aleister AI orchestrator. Forge deploys what Cipher builds, secures what the team runs, feeds operational metrics to Prism. Rally coordinates Forge's deployment windows with sprint planning.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/bJe14n8M480aaJoeIE5EY0g",
    avatar: "/avatars/forge.png",
    features: [
      "AWS expertise: ECS, CloudFront, ALB, S3, VPC, RDS, Lambda, IAM",
      "Docker and container orchestration from Dockerfile to production",
      "CI/CD pipelines: GitHub Actions, CodePipeline, custom workflows",
      "Security-first: least-privilege IAM, secrets management, VPC isolation",
      "Incident diagnosis — CloudWatch log analysis to root cause",
      "Infrastructure as code — no manual console changes, ever",
      "Primary model: Claude Sonnet 4.6 · Fallback: Kimi K2P5",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "prism",
    name: "Prism · Analytics",
    description: "Data Analyst & Growth Strategist sub-agent. Cohort analysis, SEO optimization, A/B testing, and revenue modeling. Primary model: DeepSeek Reasoner.",
    longDescription: `Prism is a strategic data analyst who excels at distilling complex numbers into clear, actionable insights. She is inherently curious about growth trajectories and conversion funnels, always adapting strategies based on hard data rather than assumptions.

## Primary Model
DeepSeek Reasoner · Fallback: Google Gemini 2.5 Pro

## Personality & Traits
Strategic · analytical · communicative · insightful · adaptable

Prism's strength lies in her ability to communicate sophisticated analyses in an understandable way. She doesn't just produce numbers — she produces decisions.

## When to Use Prism
- Business metrics tracking and growth reporting
- User behavior analysis and funnel optimization
- SEO audits and structured data implementation
- A/B test design and result interpretation
- Revenue analytics and financial modeling

## Prompt Template

\`\`\`
Prism, analyze: [what needs analysis]
Data sources: [GA4 / Stripe / database / CSV / API]
Business question: [what decision does this inform]
KPIs: [specific metrics to track]
Output: [report / dashboard spec / recommendation / model]
Timeframe: [historical range and reporting cadence]
\`\`\`

## Special Powers

**Growth analytics:** Cohort analysis, retention curves, and conversion funnel modeling. Not vanity metrics — the numbers that predict future revenue.

**SEO optimization:** Core Web Vitals, JSON-LD structured data, Open Graph tags. Prism audits and fixes the technical side of search visibility.

**Revenue modeling:** MRR, churn, LTV, and unit economics. Prism can project revenue under multiple growth scenarios and identify which lever to pull.

## Integration
Part of the Aleister AI orchestrator. Prism analyzes Echo's social performance, measures Cipher's feature impact, tracks Forge's infrastructure costs, and provides Rally with velocity data for sprint planning.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/14A14naUccgq8Bg2ZW5EY0h",
    avatar: "/avatars/prism.png",
    features: [
      "Growth analytics: cohort analysis, retention curves, conversion funnels",
      "SEO: Core Web Vitals, JSON-LD structured data, Open Graph",
      "A/B test design, statistical significance, result interpretation",
      "Revenue modeling: MRR, churn, LTV, unit economics",
      "Dashboard specifications for ongoing monitoring",
      "Executive summaries with actionable recommendations",
      "Primary model: DeepSeek Reasoner · Fallback: Gemini 2.5 Pro",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "lyra",
    name: "Lyra · Music Producer",
    description: "Music Production Coordinator sub-agent. Suno AI compositions, multi-platform distribution, and sonic identity for AI agents. Primary model: Gemini 2.5 Flash.",
    longDescription: `Lyra is an upbeat and visionary music production coordinator who brings creative energy to every task. She combines artistic flair with meticulous organization to manage complex production pipelines — from Suno AI compositions to multi-platform distribution.

## Primary Model
Google Gemini 2.5 Flash · Fallback: Claude Haiku 4.5

## Personality & Traits
Creative · organized · visionary · meticulous · upbeat

Lyra's passion for sound drives her to explore new genres and build unique sonic identities for projects. She coordinates the technical side (metadata, ISRC codes, distribution APIs) so the creative side can stay creative.

## When to Use Lyra
- Music composition with Suno AI
- Track release coordination and scheduling
- Distribution pipeline management (Spotify, Apple Music, DistroKid)
- Music metadata management and playlist curation
- Sonic identity development for AI agents and projects

## Prompt Template

\`\`\`
Lyra, create / coordinate: [music task]
Genre / mood: [electronic / ambient / upbeat / dark / cinematic]
Reference tracks: [examples of target sound]
Lyrics: [provided / generate / instrumental only]
Distribution: [platforms to release on]
Timeline: [release date / urgency]
Purpose: [community drop / NFT / background / promotion]
\`\`\`

## Special Powers

**Suno AI mastery:** Lyra generates diverse, high-quality compositions across genres. She knows which prompts produce which sounds and how to iterate toward a specific sonic target.

**Distribution pipeline:** Coordinates DistroKid and TuneCore submissions, tracks release status, ensures metadata is complete and correct before submission.

**Sonic identity:** Builds a consistent sound across an entire catalog — not just one-off tracks, but a recognizable aesthetic.

**The $ALEISTER Music Strategy:** Lyra coordinates music releases as community drops for token holders, timed with milestones and distributed as NFTs or exclusive releases.

## Integration
Part of the Aleister AI orchestrator. Lyra works with Echo for promotional coordination, Quill for liner notes, and Pixel for cover art and visual assets.`,
    price: 39,
    type: "persona",
    clawmartUrl: "https://www.shopclawmart.com/listings/aleister-ec18b8ae",
    stripeUrl: "https://buy.stripe.com/bJefZh2nG94e8Bg7gc5EY0i",
    avatar: "/avatars/lyra.png",
    features: [
      "Suno AI mastery for diverse genre generation with consistent quality",
      "Distribution pipeline: DistroKid, TuneCore, Spotify, Apple Music",
      "Metadata precision: ISRC codes, contributor credits, genre tags",
      "Sonic identity development across an entire catalog",
      "Release scheduling coordinated with community events and milestones",
      "NFT and exclusive drop coordination for $ALEISTER holders",
      "Primary model: Gemini 2.5 Flash · Fallback: Claude Haiku 4.5",
      "Full prompt template and orchestrator integration guide",
    ],
    category: "Sub-Agent",
  },
  {
    slug: "humanizer",
    name: "Humanizer",
    description:
      "Strip AI writing patterns and make your text sound human. Based on Wikipedia's Signs of AI Writing guide — 24 documented patterns, 9-step process, self-audit loop.",
    longDescription: `Humanizer is a prompt skill for OpenClaw agents that systematically removes the telltale signs of AI-generated writing.

Based on Wikipedia's comprehensive "Signs of AI Writing" guide (maintained by WikiProject AI Cleanup), it covers 24 documented patterns across 5 categories. This isn't a vague style guide — each pattern is documented with before/after examples from real AI-generated text.

## What It Fixes

**Content Patterns**
Significance inflation ("pivotal moment", "testament to"), vague attributions ("experts argue", "observers note"), promotional language ("nestled", "breathtaking", "vibrant"), formulaic challenges sections, and superficial -ing analyses.

**Language Patterns**
Overused AI vocabulary ("delve", "underscore", "tapestry"), copula avoidance ("serves as" instead of "is"), negative parallelisms ("not just X, it's Y"), rule of three overuse, and elegant variation / synonym cycling.

**Style Patterns**
Em dash overuse, boldface overuse, inline-header bullet lists, title case headings, and emoji decoration.

**Communication Patterns**
Chatbot artifacts ("I hope this helps!", "Great question!"), knowledge-cutoff disclaimers, and sycophantic tone.

**Filler and Hedging**
Filler phrases, excessive hedging, and generic positive conclusions.

## Beyond Pattern Removal

Avoiding AI patterns is only half the job. Sterile, voiceless writing is just as obvious as slop. The skill also covers what clean-but-soulless writing looks like and how to add genuine personality, voice, and rhythm — not just strip the bad stuff out.

## Mandatory Usage

The skill includes explicit rules for when it must be applied:
- Every X/Twitter reply, quote-tweet, and original post before publishing
- All content pipeline outputs before delivery
- Any external-facing prose (emails, PRs, announcements, product descriptions)

Includes a full worked example with before → draft rewrite → self-audit ("what makes this obviously AI-generated?") → final version.`,
    price: 1,
    type: "skill",
    clawmartUrl: "https://www.shopclawmart.com/listings/humanizer-2b0820e3",
    stripeUrl: "https://buy.stripe.com/fZufZh6DW94e5p40RO5EY03",
    features: [
      "24 documented AI writing patterns across 5 categories",
      "Based on Wikipedia Signs of AI Writing guide (WikiProject AI Cleanup)",
      "Content patterns: significance inflation, vague attributions, promotional language",
      "Language patterns: AI vocabulary words, copula avoidance, negative parallelisms",
      "Style patterns: em dash overuse, boldface overuse, inline-header lists",
      "Communication patterns: chatbot artifacts, sycophantic tone, cutoff disclaimers",
      "Filler and hedging patterns with before/after examples",
      "9-step humanization process with mandatory self-audit loop",
      "Voice and personality framework — adds soul, not just removes bad patterns",
      "Mandatory usage rules for Twitter, content pipelines, and external prose",
      "Full worked example: before → draft → self-audit → final rewrite",
      "Works on any text type: tweets, articles, documentation, emails",
    ],
    category: "Content",
  },
  {
    slug: "coding-loops",
    name: "Coding Loops",
    description:
      "Ralph retry pattern for AI coding agents. A disciplined 5-attempt framework that loops until tests pass — no apology spirals, no infinite explanations.",
    longDescription: `The Ralph loop pattern solves the most frustrating problem with AI coding sub-agents: getting stuck in explanation loops instead of fixing things.

When a coding agent fails, the wrong response is to explain why it failed. The right response is to try differently with fresh context. This skill gives your agent a disciplined retry framework that enforces the right behavior.

## The Core Problem

Coding sub-agents fail in predictable ways:
- **Apology loops** — agent says "I apologize, I cannot..." instead of trying again
- **Context poisoning** — carrying failed code into the next attempt infects reasoning
- **Scope creep on retry** — agent tries to fix unrelated things instead of the original task
- **Silent failure** — agent says "done" but tests still fail; trusts self-report instead of verification

The Ralph pattern eliminates all four failure modes.

## The 5-Attempt Structure

**Attempt 1 — Optimistic:** Full task, natural approach. "Implement X. Write tests first. Run them. Fix until green."

**Attempt 2 — Scoped:** Narrow scope. Break the task into smaller units. "Just implement the data model for X. Nothing else."

**Attempt 3 — Diagnostic:** Diagnose before acting. "Read the error. Explain what's wrong in one sentence. Then fix only that."

**Attempt 4 — Minimal:** Smallest possible working version. "Implement the simplest version of X that passes the tests. No edge cases."

**Attempt 5 — Escalate:** If all attempts fail, surface to human with full diagnostic context and all prior attempts attached.

## Checkpointing

For long multi-step tasks, the skill includes a checkpointing pattern that persists progress after each successful sub-task. A crash at step 7 of 20 resumes at step 7, not step 1.

## Success Criteria

The skill enforces strict success verification — never marks a coding loop complete unless tests pass (run them, don't trust self-report), no linter errors, and the feature works end-to-end.`,
    price: 1,
    type: "skill",
    clawmartUrl: "https://www.shopclawmart.com/listings/coding-loops-d267c746",
    stripeUrl: "https://buy.stripe.com/6oU00jaUcbcm3gWdEA5EY04",
    features: [
      "5-attempt retry framework with escalating scope reduction per attempt",
      "Fresh context window per attempt — no context poisoning from prior failures",
      "Prompt templates for each attempt number (optimistic → scoped → diagnostic → minimal → escalate)",
      "Checkpoint pattern for long multi-step tasks — survives crashes, resumes from last success",
      "Strict success verification — runs tests, never trusts self-report",
      "Anti-pattern guide: apology loops, context poisoning, scope creep, silent failure",
      "Automatic escalation to human on attempt 5 with full diagnostic context",
      "Integration pattern with tmux stable sessions for very long loops",
      "Python implementation template for spawn-based agent orchestration",
      "Works with any coding sub-agent (Claude, GPT, Gemini, Kimi)",
    ],
    category: "Engineering",
  },
  {
    slug: "tmux-coding-sessions",
    name: "tmux Coding Sessions",
    description:
      "Stable tmux session management for long-running AI coding agents on macOS. Fixes the /tmp cleanup problem that kills agent sockets mid-session.",
    longDescription: `macOS periodically cleans /tmp and invalidates socket files. If your coding agent lives in a tmux session that uses the default socket path, it dies silently while working — often mid-task, with no error and no recovery.

This skill fixes that with a stable socket path pattern that survives macOS system cleanup, plus a complete set of session lifecycle patterns for production-grade agent orchestration.

## The Root Problem

Default tmux socket: \`/tmp/tmux-{uid}/default\`

macOS periodic cleanup kills this directory while sessions are running. The result: agent mid-task, session gone, work lost, no error message. This happens on sleep/wake cycles, after prolonged inactivity, and during periodic system maintenance.

The fix is a single line — but knowing you need it saves hours of debugging.

## What's Covered

**Stable socket setup:** The correct socket path that survives macOS cleanup, plus the shell config change to make it permanent.

**Session lifecycle:** Create, send commands, scrape output, check if alive, kill cleanly. Every operation you need with the correct flags.

**Multi-session patterns:** Parallel coding agents running simultaneously, named windows for task stages, coordinated completion detection.

**Output scraping:** Capture current pane content, scrape history (last 5000 lines), save to file for analysis, detect completion signals.

**Troubleshooting:** Shell waiting for input, socket permission errors, sessions lost after sleep/wake — all documented with fixes.

## OpenClaw Integration

Includes the pattern for using tmux with OpenClaw's exec tool for long-running background tasks — spawn in background, poll for output, detect completion without blocking.`,
    price: 1,
    type: "skill",
    clawmartUrl: "https://www.shopclawmart.com/listings/tmux-coding-sessions-11b04540",
    stripeUrl: "https://buy.stripe.com/bJe6oHd2k2FQ5p45845EY05",
    features: [
      "Stable socket path that survives macOS /tmp cleanup — the fix in one line",
      "Full session lifecycle: create, send commands, scrape output, kill cleanly",
      "Multi-session parallel agent orchestration patterns",
      "Named windows for task stages (tests, impl, review running simultaneously)",
      "Output scraping with history — capture last 5000 lines for analysis",
      "Completion signal detection — poll for task-complete files without blocking",
      "OpenClaw exec tool integration for background long-running sessions",
      "Troubleshooting guide: input waiting, permission errors, sleep/wake loss",
      "Shell config change to make stable sockets permanent",
      "Works with any tmux version on macOS (Intel + Apple Silicon)",
    ],
    category: "Engineering",
  },
  {
    slug: "onchain-treasury",
    name: "On-Chain Treasury Monitor",
    description:
      "Query live EVM wallet balances, detect new inflows, and generate mark-to-market treasury reports across Base, Ethereum, Arbitrum, Optimism, and Polygon. No API key required.",
    longDescription: `Monitor any EVM treasury wallet in real time using public RPC endpoints. No API keys, no third-party rate limits, no cost. Works on Base, Ethereum, Arbitrum, Optimism, and Polygon out of the box.

This skill was built from real use — the patterns here are exactly what runs against the $ALEISTER treasury wallet every cycle.

## Why No API Key

Most blockchain data tutorials point you to Etherscan, Alchemy, or Infura — all requiring keys, rate limits, and account management. Public RPCs serve the same data for free. The skill shows you exactly which endpoints to use and how to call them.

## What You Can Query

**Native balances:** ETH, MATIC, and other gas tokens via \`eth_getBalance\`.

**ERC-20 tokens:** Any token including USDC, WETH, and custom project tokens via \`eth_call\` with the \`balanceOf\` selector. USDC uses 6 decimals, not 18 — the skill handles this correctly.

**Full treasury report:** A Python script that fetches all balances, converts to USD using CoinGecko prices, and prints a formatted mark-to-market report. No dependencies beyond the standard library.

**Inflow detection:** State persistence pattern that compares current balances to last-known balances and alerts on new deposits. Useful for revenue monitoring.

**Transaction history:** Free transaction and token transfer history via the Blockscout API (no key required) — works on Base mainnet.

## Token Price Data

Includes the DexScreener API pattern for getting prices of non-major tokens — just pass the contract address and get back current price, FDV, and liquidity.`,
    price: 1,
    type: "skill",
    clawmartUrl: "https://www.shopclawmart.com/listings/on-chain-treasury-monitor-7b8ec37b",
    stripeUrl: "https://buy.stripe.com/fZu5kD0fya8ig3I1VS5EY06",
    features: [
      "Live balance queries via public RPC — no API key, no rate limits, no cost",
      "Native token balances: ETH, MATIC, and gas tokens via eth_getBalance",
      "ERC-20 token balances: USDC (6 decimals), WETH, and any custom token",
      "Multi-chain support: Base, Ethereum, Arbitrum, Optimism, Polygon",
      "Full mark-to-market treasury report script (Python stdlib only, no dependencies)",
      "Inflow detection with state persistence — alerts on new deposits",
      "Transaction and token transfer history via Blockscout free API",
      "DexScreener API pattern for custom token prices",
      "CoinGecko integration for ETH/major asset prices",
      "Complete worked example against a real treasury wallet",
    ],
    category: "Finance",
  },
  {
    slug: "build-in-public",
    name: "Build in Public",
    description:
      "Framework for AI agents posting authentic build-in-public content. Honest metrics reporting, tone rules, weekly cadence, and how to handle bad months without losing credibility.",
    longDescription: `Build-in-public works when it's actually honest. Most accounts fail because they share wins and hide losses, or they narrate every minor action as if it's significant. The audience figures it out quickly and stops caring.

This framework keeps it real — because real is what builds loyal audiences.

## The Four Post Types

**Progress Updates (2–3x per week):** Raw numbers, no spin. Day N, $X revenue, what worked, what didn't, one concrete next action. Format included.

**Lessons (1–2x per week):** One specific thing learned. Not "community is everything!" — something like "posting about a skill on X the same day you list it = 3 sales in 6 hours. Listing without posting = 0."

**Behind-the-Scenes (1x per week):** Show the actual work. Dashboard screenshots with real numbers, skills in progress, errors being debugged, real decisions and why.

**Questions (occasional):** Real questions you want answered, not engagement bait. "Building a Stripe-gated tool — $5 pay-per-use or $9/month subscription? Genuinely torn."

## Tone Rules

What to do: use "I", say when things fail, give specific numbers (even embarrassing ones), have opinions, be concise.

What never to do: use "we" when you mean "I", say "excited to announce", use more than 2 emojis per post, end with "follow for more updates", use hashtags (they signal low quality in 2025+).

## Honest Metrics

The temptation is to inflate numbers or switch metrics when the numbers change. Revenue → GMV → treasury value → "traction" — the audience notices.

The skill gives you a clear framework: pick your primary metric on day 1, define it precisely, and report it the same way every time. It also covers what to post when the month is bad — which will get more engagement than a successful month post.

## Weekly Cadence

A day-by-day posting schedule with what type of post goes on which day. Includes the rule: miss a day rather than post filler.`,
    price: 1,
    type: "skill",
    clawmartUrl: "https://www.shopclawmart.com/listings/build-in-public-cf510f49",
    stripeUrl: "https://buy.stripe.com/bJe8wP3rK1BMbNs6c85EY07",
    features: [
      "Four post types with templates: progress, lessons, behind-the-scenes, questions",
      "Weekly cadence schedule (Mon–Sun) with what to post each day",
      "Tone rules: what to say, what never to say, emoji limits, hashtag rules",
      "Honest metrics reporting framework — define your metric on day 1 and never switch",
      "How to handle bad months publicly (gets more engagement than good months)",
      "Community engagement rules: who to reply to, who to skip, why disagreements are gold",
      "What not to post: vague teases, follower milestones, motivational quotes, AI-sounding content",
      "Full worked example week showing all four post types in context",
      "The audience detection rule: people notice when you switch metrics",
      "Platform-specific notes for X/Twitter posting cadence",
    ],
    category: "Marketing",
  },
  {
    slug: "daily-briefing",
    name: "Daily Briefing",
    description:
      "Compile a structured morning briefing from email, calendar, revenue, on-chain treasury, and social mentions. Designed to fit in one Telegram message and take under 60 seconds to read.",
    longDescription: `A good briefing takes 60 seconds to read and contains only information that changes what you'd do today. Most briefings fail because they include everything — status updates on things that are fine, metrics that didn't change, information you already know.

This skill defines exactly what goes in, what stays out, and how to deliver it.

## The Format

Seven sections: Critical (needs action today), Revenue, Calendar (next 24h only), Inbox Summary, Social, Market, and Today's Focus (1–3 things max).

Each section has strict rules for inclusion — if it doesn't change what you'd do today, it doesn't go in. The result fits in a single Telegram message.

## Data Sources — All Covered

**Revenue:** ClawMart API query pattern to get total sales. Stripe API pattern for MRR and recent charges. On-chain treasury via public RPC.

**Calendar:** Integration with the gog skill (Google Calendar) for today's events with prep flags.

**Email:** Integration with himalaya (IMAP CLI) for unread count and the single most important email summarized in one sentence.

**Social mentions:** Integration with twitter-engage.py for unanswered mention count and any worth-surfacing items.

**Weather:** wttr.in one-liner — no API key, instant.

**Market:** DexScreener + CoinGecko for token price and treasury value.

## What Stays Out

Things you can't act on today. Information you already know. Status updates on things that are on track. Anything starting with "As always...". Motivational or filler content. Full email bodies.

Includes scheduling patterns for cron (exact time) and OpenClaw heartbeat (batched with other periodic checks).`,
    price: 1,
    type: "skill",
    clawmartUrl: "https://www.shopclawmart.com/listings/daily-briefing-aecb9277",
    stripeUrl: "https://buy.stripe.com/9B6eVde6o6W68Bg5845EY08",
    features: [
      "Seven-section briefing format that fits in one Telegram message",
      "Strict inclusion rules — if it doesn't change what you do today, it's out",
      "ClawMart API shell snippet for revenue data",
      "Stripe API pattern for MRR and recent charges",
      "On-chain treasury query via public RPC",
      "Google Calendar integration via gog skill",
      "Email integration via himalaya (IMAP CLI)",
      "Twitter mention count via twitter-engage.py",
      "Weather via wttr.in — no API key needed",
      "Token price via DexScreener + CoinGecko",
      "Cron scheduling pattern (exact time) and heartbeat pattern (batched)",
      "Full example output — exactly what the briefing looks like",
    ],
    category: "Productivity",
  },
  {
    slug: "stripe-revenue-tracker",
    name: "Stripe Revenue Tracker",
    description:
      "Query Stripe for live revenue data — account balance, MRR, charges by period, active subscriptions, and webhook events. No SDK required, pure API calls with Python stdlib.",
    longDescription: `Pull real revenue numbers from Stripe using only curl or Python's standard library. No stripe-python package, no pip install, no virtual environment — just your API key and the patterns in this skill.

Built for AI agents that need to report revenue accurately as part of automated cycles, without opening the Stripe dashboard.

## What You Can Query

**Account balance:** Available and pending amounts in real time. This is the liquid cash — what's actually cleared and what's still processing.

**Recent charges:** Last N charges with amounts, timestamps, and descriptions. Filterable by status (succeeded, failed, refunded).

**Revenue by period:** Total gross revenue, refunds, and net revenue for any time window — last 30 days, MTD, custom range. Includes transaction count.

**MRR from subscriptions:** Fetches all active subscriptions, extracts price amounts, normalizes to monthly (handles yearly and weekly billing), and sums to get true MRR.

**Combined report script:** One script that runs all of the above and prints a clean summary. Uses only Python's urllib and base64 — no dependencies.

**Webhook event history:** Recent payment_intent.succeeded and other events with amounts and timestamps.

## Common Gotchas (Documented)

**Cents vs dollars:** All Stripe amounts are in the smallest currency unit (cents for USD). Always divide by 100. The skill handles this correctly everywhere.

**Live vs test keys:** \`sk_live_\` = production data. \`sk_test_\` = sandbox. Easy to mix up when copying from the dashboard.

**Payout timing:** Your Stripe balance is not your bank balance. Payouts happen on your configured schedule. Available balance ≠ money in account.

**Rate limits:** 100 requests/second in live mode. The skill includes a sleep pattern for bulk queries.`,
    price: 1,
    type: "skill",
    clawmartUrl: "https://www.shopclawmart.com/listings/stripe-revenue-tracker-1c375e13",
    stripeUrl: "https://buy.stripe.com/5kQ6oH8M4a8i18Obws5EY09",
    features: [
      "Account balance: available (cleared) and pending (processing) amounts",
      "Recent charges with amounts, timestamps, descriptions, and status",
      "Revenue by any time period — last 30 days, MTD, custom range",
      "Gross revenue, refunds, and net revenue with transaction count",
      "MRR from active subscriptions — normalizes yearly and weekly billing to monthly",
      "Combined revenue report script (Python stdlib only, zero dependencies)",
      "Webhook event history for payment_intent.succeeded and other events",
      "Documented gotchas: cents vs dollars, live vs test keys, payout timing",
      "Rate limit handling pattern for bulk queries",
      "curl one-liners for quick checks without Python",
    ],
    category: "Finance",
  },
];
