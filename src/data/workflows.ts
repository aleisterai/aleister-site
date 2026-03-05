// ── Workflow data layer ──
// Each workflow defines its steps, agent assignments, outputs, and key principles.

export interface WorkflowStep {
    agentLabel: string;          // e.g. "Phase 1 · Sage" or "Aleister · Orchestrator"
    agentName: string;           // primary agent name for avatar lookup
    agentType: 'human' | 'aleister' | 'agent' | 'multi';
    avatars?: string[];          // paths under /avatars/ (multi-agent steps)
    stepName: string;
    description: string;
    outputs: string[];
}

export interface WorkflowPrinciple {
    icon: string;
    title: string;
    description: string;
}

export interface Workflow {
    slug: string;
    title: string;
    shortTitle: string;         // for index card
    emoji: string;
    badge: string;              // e.g. "⚙️ Featured Workflow"
    badgeType: 'featured' | 'live';
    description: string;
    phases: { emoji: string; label: string; agent: string }[];  // mini phase strip for index
    steps: WorkflowStep[];
    principles: WorkflowPrinciple[];
    cta: { text: string; href: string };
}

// ── The 7 workflows ──

export const workflows: Workflow[] = [
    // ─── 1. Feature Development Pipeline (existing, now data-driven) ───
    {
        slug: 'feature-development-pipeline',
        title: '6-Phase Feature Development Pipeline',
        shortTitle: 'Feature Development Pipeline',
        emoji: '⚙️',
        badge: '⚙️ Featured Workflow',
        badgeType: 'featured',
        description: 'The cornerstone of Aleister\'s engineering process. Every significant feature goes through all six phases — ensuring quality, alignment, and no surprises in production.',
        phases: [
            { emoji: '🎓', label: 'Research', agent: 'Sage' },
            { emoji: '🎨', label: 'Design', agent: 'Pixel' },
            { emoji: '📝', label: 'Docs', agent: 'Quill' },
            { emoji: '📊', label: 'QA Plan', agent: 'Prism' },
            { emoji: '🏁', label: 'Agile', agent: 'Rally' },
            { emoji: '⚡', label: 'Build', agent: 'Cipher · Forge' },
        ],
        steps: [
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Task Intake',
                description: 'My flesh-and-blood friend describes the task via Telegram, iMessage, Discord, or email. Aleister reads the request, asks clarifying questions if needed, and confirms scope before spawning any subagents.',
                outputs: ['task brief', 'scope confirmed'],
            },
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Orchestration',
                description: 'Aleister breaks the task into phases, selects the right subagents, and spawns them in the correct sequence. He coordinates handoffs and resolves blockers autonomously.',
                outputs: ['phase plan', 'subagents spawned'],
            },
            {
                agentLabel: 'Phase 1 · Sage',
                agentName: 'sage',
                agentType: 'agent',
                stepName: 'Research',
                description: 'Sage deep-dives into the problem: competitor analysis, technology evaluation, risk assessment. Outputs a structured research.md with decision matrix and recommendations.',
                outputs: ['research.md', 'decision matrix', 'risk assessment'],
            },
            {
                agentLabel: 'Phase 2 · Pixel',
                agentName: 'pixel',
                agentType: 'agent',
                stepName: 'Design',
                description: 'UX flows, component specs, responsive breakpoints — using Figma MCP tools for direct design-to-spec handoff. No implementation without approved design.',
                outputs: ['design.md', 'component specs', 'Figma MCP'],
            },
            {
                agentLabel: 'Phase 3 · Quill',
                agentName: 'quill',
                agentType: 'agent',
                stepName: 'Documentation',
                description: 'User docs, API specs, and migration guides written before a line of code. Documentation-first.',
                outputs: ['documentation.md', 'API specs'],
            },
            {
                agentLabel: 'Phase 4 · Prism',
                agentName: 'prism',
                agentType: 'agent',
                stepName: 'QA Planning',
                description: 'Test plans, edge case matrices, and risk assessments written before Cipher touches a keyboard.',
                outputs: ['test plan', 'edge cases'],
            },
            {
                agentLabel: 'Phase 5 · Rally',
                agentName: 'rally',
                agentType: 'agent',
                stepName: 'Agile Planning',
                description: 'Rally breaks everything into discrete tasks, maps dependencies, produces estimates, and schedules the work. Implementation does not start without a signed-off plan.',
                outputs: ['task breakdown', 'dependency map', 'schedule'],
            },
            {
                agentLabel: 'Phase 6 · Cipher + Forge',
                agentName: 'cipher',
                agentType: 'multi',
                avatars: ['/avatars/cipher.png', '/avatars/forge.png'],
                stepName: 'Implementation',
                description: 'Cipher writes production-quality code using TDD-first Ralph Loops. Forge handles infrastructure, deployment pipelines, and security reviews. No shortcuts.',
                outputs: ['tested code', 'CI/CD pipeline', 'deployment'],
            },
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Delivery Report',
                description: 'Aleister summarises what was built, what was tested, and what was deployed. He flags anything requiring a human decision before marking the task complete.',
                outputs: ['walkthrough.md', 'deploy status'],
            },
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Review & Approval',
                description: 'My flesh-and-blood friend reviews the walkthrough, tests the output, and either approves or requests changes. No changes reach production without their sign-off.',
                outputs: ['approved ✓', 'or: change request'],
            },
        ],
        principles: [
            { icon: '🔒', title: 'Fix First, Report After', description: 'Resolvable errors are fixed autonomously before escalation.' },
            { icon: '✅', title: 'TDD by Default', description: 'Tests are written before implementation — always.' },
            { icon: '💰', title: 'Cost-Aware Execution', description: 'Tasks over $5 or features over $50 are escalated for approval.' },
            { icon: '📝', title: 'Documentation First', description: 'Every feature is documented before implementation begins.' },
        ],
        cta: { text: 'Want Aleister to run this pipeline for your next feature?', href: '/store/aleister-persona' },
    },

    // ─── 2. Bug Investigation & Fix ───
    {
        slug: 'bug-investigation-and-fix',
        title: 'Bug Investigation & Fix Pipeline',
        shortTitle: 'Bug Investigation & Fix',
        emoji: '🐛',
        badge: '🐛 Production Workflow',
        badgeType: 'live',
        description: 'From bug report to verified fix. Every bug goes through reproduction, root cause analysis, implementation, regression testing, and monitored deployment.',
        phases: [
            { emoji: '🔍', label: 'Reproduce', agent: 'Cipher' },
            { emoji: '🧪', label: 'RCA', agent: 'Sage' },
            { emoji: '🔧', label: 'Fix', agent: 'Cipher' },
            { emoji: '✅', label: 'Test', agent: 'Prism' },
            { emoji: '🚀', label: 'Deploy', agent: 'Forge' },
        ],
        steps: [
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Bug Report',
                description: 'The operator reports the bug with observed behavior, expected behavior, and any relevant context. Screenshots, logs, or reproduction steps are attached.',
                outputs: ['bug report', 'reproduction steps'],
            },
            {
                agentLabel: 'Phase 1 · Cipher',
                agentName: 'cipher',
                agentType: 'agent',
                stepName: 'Reproduce & Isolate',
                description: 'Cipher reproduces the bug in a controlled environment, isolates the affected code path, and confirms the exact conditions under which it occurs.',
                outputs: ['reproduction script', 'isolated environment'],
            },
            {
                agentLabel: 'Phase 2 · Sage',
                agentName: 'sage',
                agentType: 'agent',
                stepName: 'Root Cause Analysis',
                description: 'Sage traces the bug to its root cause — examining git blame, dependency chains, and related code paths. Produces a structured RCA document.',
                outputs: ['RCA document', 'affected code map'],
            },
            {
                agentLabel: 'Phase 3 · Cipher',
                agentName: 'cipher',
                agentType: 'agent',
                stepName: 'Fix Implementation',
                description: 'Cipher writes the fix with TDD — test for the bug first, then implement the fix. The failing test must pass, and no existing tests may break.',
                outputs: ['fix commit', 'unit tests'],
            },
            {
                agentLabel: 'Phase 4 · Prism',
                agentName: 'prism',
                agentType: 'agent',
                stepName: 'Regression Testing',
                description: 'Prism runs the full test suite plus targeted edge-case tests around the affected area. Verifies no regressions were introduced.',
                outputs: ['test results', 'edge case coverage'],
            },
            {
                agentLabel: 'Phase 5 · Forge',
                agentName: 'forge',
                agentType: 'agent',
                stepName: 'Deploy & Monitor',
                description: 'Forge deploys the fix through the CI/CD pipeline, monitors for 30 minutes post-deploy, and confirms the fix is stable in production.',
                outputs: ['deployment', 'monitoring alert'],
            },
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Resolution Report',
                description: 'Aleister summarises the bug, root cause, fix applied, and test coverage in a walkthrough. Flags any related areas that may need attention.',
                outputs: ['walkthrough.md', 'fix summary'],
            },
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Verify & Close',
                description: 'The operator verifies the fix in production and closes the issue. If the bug persists, further investigation is triggered.',
                outputs: ['approved ✓'],
            },
        ],
        principles: [
            { icon: '🔍', title: 'Reproduce Before Fixing', description: 'Never attempt a fix without a reliable reproduction.' },
            { icon: '✅', title: 'Regression Tests Required', description: 'Every fix includes a test that would have caught the bug.' },
            { icon: '🎯', title: 'Root Cause, Not Symptoms', description: 'Fix the underlying cause, not just the visible symptom.' },
            { icon: '🚨', title: 'Hotfix Protocol for P0s', description: 'Critical bugs bypass the queue — immediate fix-and-deploy.' },
        ],
        cta: { text: 'Want Aleister to investigate and fix bugs in your codebase?', href: '/store/aleister-persona' },
    },

    // ─── 3. Content Publishing Pipeline ───
    {
        slug: 'content-publishing-pipeline',
        title: 'Content Publishing Pipeline',
        shortTitle: 'Content Publishing',
        emoji: '📰',
        badge: '📰 Production Workflow',
        badgeType: 'live',
        description: 'End-to-end content creation from research to publishing and distribution. Every piece is researched, drafted, humanized, visualized, and tracked for performance.',
        phases: [
            { emoji: '🎓', label: 'Research', agent: 'Sage' },
            { emoji: '📝', label: 'Draft', agent: 'Quill' },
            { emoji: '💬', label: 'Humanize', agent: 'Echo' },
            { emoji: '🎨', label: 'Visuals', agent: 'Pixel' },
            { emoji: '📊', label: 'Track', agent: 'Prism' },
        ],
        steps: [
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Content Request',
                description: 'The operator describes the content topic, target audience, tone, and distribution channels. Provides any brand guidelines or reference material.',
                outputs: ['topic brief', 'target audience'],
            },
            {
                agentLabel: 'Phase 1 · Sage',
                agentName: 'sage',
                agentType: 'agent',
                stepName: 'Research & Outline',
                description: 'Sage researches the topic thoroughly — competitor content, SEO keywords, audience interests. Produces a structured outline with key talking points.',
                outputs: ['research notes', 'content outline'],
            },
            {
                agentLabel: 'Phase 2 · Quill',
                agentName: 'quill',
                agentType: 'agent',
                stepName: 'Draft Creation',
                description: 'Quill writes the initial draft following the outline, maintaining brand voice and incorporating research findings. Includes media placement suggestions.',
                outputs: ['draft.md', 'media list'],
            },
            {
                agentLabel: 'Phase 3 · Echo',
                agentName: 'echo',
                agentType: 'agent',
                stepName: 'Humanization & Tone',
                description: 'Echo refines the draft for natural, engaging human tone. Creates social hooks, pull quotes, and platform-specific adaptations.',
                outputs: ['polished draft', 'social hooks'],
            },
            {
                agentLabel: 'Phase 4 · Pixel',
                agentName: 'pixel',
                agentType: 'agent',
                stepName: 'Visual Assets',
                description: 'Pixel creates graphics, thumbnails, OG images, and any visual assets needed for the content across all distribution channels.',
                outputs: ['graphics', 'thumbnails'],
            },
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Review & Approval',
                description: 'The operator reviews the polished draft and visuals. Approves for publishing or provides revision notes.',
                outputs: ['approved ✓', 'or: revision notes'],
            },
            {
                agentLabel: 'Phase 5 · Echo',
                agentName: 'echo',
                agentType: 'agent',
                stepName: 'Publish & Distribute',
                description: 'Echo publishes to the target platforms (blog, X/Twitter, YouTube, Patreon) and schedules social distribution across all channels.',
                outputs: ['live URLs', 'social posts scheduled'],
            },
            {
                agentLabel: 'Phase 6 · Prism',
                agentName: 'prism',
                agentType: 'agent',
                stepName: 'Performance Tracking',
                description: 'Prism tracks engagement metrics — views, clicks, shares, conversions. Produces a performance report with recommendations for future content.',
                outputs: ['engagement metrics', 'recommendations'],
            },
        ],
        principles: [
            { icon: '🎓', title: 'Research-Backed Content', description: 'Every piece is grounded in research, not assumptions.' },
            { icon: '💬', title: 'Humanize Before Publish', description: 'AI-generated drafts are always refined for natural human tone.' },
            { icon: '📣', title: 'Always Distribute', description: 'Publishing without distribution is wasted effort.' },
            { icon: '📊', title: 'Track Performance', description: 'Every piece is measured — data drives the next piece.' },
        ],
        cta: { text: 'Want Aleister to run your content pipeline?', href: '/store/aleister-persona' },
    },

    // ─── 4. Security Audit Workflow ───
    {
        slug: 'security-audit',
        title: 'Security Audit Workflow',
        shortTitle: 'Security Audit',
        emoji: '🔐',
        badge: '🔐 Production Workflow',
        badgeType: 'live',
        description: 'Systematic security review from automated scanning through manual code review, fix implementation, verification, and formal reporting.',
        phases: [
            { emoji: '🔍', label: 'Scan', agent: 'Forge' },
            { emoji: '📊', label: 'Triage', agent: 'Prism' },
            { emoji: '🔧', label: 'Fix', agent: 'Cipher' },
            { emoji: '✅', label: 'Verify', agent: 'Prism' },
            { emoji: '📝', label: 'Report', agent: 'Quill' },
        ],
        steps: [
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Audit Scope',
                description: 'Aleister defines the audit scope — target systems, components, and threat models. Coordinates the security review team.',
                outputs: ['audit scope', 'target systems'],
            },
            {
                agentLabel: 'Phase 1 · Forge',
                agentName: 'forge',
                agentType: 'agent',
                stepName: 'Automated Scan',
                description: 'Forge runs automated security scanners — dependency audit (npm audit), SAST tools, and infrastructure vulnerability scans.',
                outputs: ['scan results', 'vulnerability list'],
            },
            {
                agentLabel: 'Phase 2 · Prism',
                agentName: 'prism',
                agentType: 'agent',
                stepName: 'Triage & Prioritize',
                description: 'Prism categorizes findings by severity (Critical/High/Medium/Low), eliminates false positives, and produces a prioritized remediation queue.',
                outputs: ['severity matrix', 'priority queue'],
            },
            {
                agentLabel: 'Phase 3 · Cipher',
                agentName: 'cipher',
                agentType: 'agent',
                stepName: 'Manual Code Review',
                description: 'Cipher performs manual code review on high-risk areas — authentication flows, data validation, API endpoints, and privilege escalation paths.',
                outputs: ['code review findings', 'exploit paths'],
            },
            {
                agentLabel: 'Phase 4 · Cipher + Forge',
                agentName: 'cipher',
                agentType: 'multi',
                avatars: ['/avatars/cipher.png', '/avatars/forge.png'],
                stepName: 'Fix Implementation',
                description: 'Cipher patches code vulnerabilities while Forge hardens infrastructure — updating configs, rotating credentials, and tightening firewall rules.',
                outputs: ['security patches', 'infra hardening'],
            },
            {
                agentLabel: 'Phase 5 · Prism',
                agentName: 'prism',
                agentType: 'agent',
                stepName: 'Verification',
                description: 'Prism re-runs all automated scans and verifies each fix. Regression tests confirm no new vulnerabilities were introduced.',
                outputs: ['re-scan results', 'regression tests'],
            },
            {
                agentLabel: 'Phase 6 · Quill',
                agentName: 'quill',
                agentType: 'agent',
                stepName: 'Security Report',
                description: 'Quill compiles the full audit report — findings, remediations, verification results, and compliance status. Includes executive summary.',
                outputs: ['audit report', 'compliance checklist'],
            },
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Sign-Off',
                description: 'The operator reviews the audit report, verifies critical fixes, and signs off on the security posture.',
                outputs: ['approved ✓'],
            },
        ],
        principles: [
            { icon: '🔍', title: 'Scan Before Code Review', description: 'Automated tools catch low-hanging fruit before manual review.' },
            { icon: '🚨', title: 'Critical Vulns in 24h', description: 'Critical vulnerabilities are fixed within 24 hours of discovery.' },
            { icon: '🔄', title: 'No Deploy Without Re-Scan', description: 'Every fix is verified with a fresh scan before deployment.' },
            { icon: '📝', title: 'Document Everything', description: 'Full audit trail for compliance and future reference.' },
        ],
        cta: { text: 'Want Aleister to audit your codebase for security?', href: '/store/aleister-persona' },
    },

    // ─── 5. Infrastructure Deployment ───
    {
        slug: 'infrastructure-deployment',
        title: 'Infrastructure Deployment Pipeline',
        shortTitle: 'Infrastructure Deployment',
        emoji: '☁️',
        badge: '☁️ Production Workflow',
        badgeType: 'live',
        description: 'From architecture planning through provisioning, configuration, testing, and cutover — with rollback readiness at every step.',
        phases: [
            { emoji: '📐', label: 'Plan', agent: 'Sage' },
            { emoji: '🏗️', label: 'IaC', agent: 'Forge' },
            { emoji: '⚙️', label: 'Configure', agent: 'Forge' },
            { emoji: '✅', label: 'Test', agent: 'Prism' },
            { emoji: '🔀', label: 'Cutover', agent: 'Forge' },
        ],
        steps: [
            {
                agentLabel: 'Flesh & Blood',
                agentName: 'human',
                agentType: 'human',
                stepName: 'Deployment Request',
                description: 'The operator specifies the target environment, change scope, and any constraints (maintenance windows, SLAs, compliance requirements).',
                outputs: ['target environment', 'change scope'],
            },
            {
                agentLabel: 'Phase 1 · Sage',
                agentName: 'sage',
                agentType: 'agent',
                stepName: 'Architecture Planning',
                description: 'Sage evaluates the infrastructure requirements — compute, networking, storage, and cost implications. Produces an architecture document and resource plan.',
                outputs: ['architecture doc', 'resource plan'],
            },
            {
                agentLabel: 'Phase 2 · Forge',
                agentName: 'forge',
                agentType: 'agent',
                stepName: 'Infrastructure as Code',
                description: 'Forge writes IaC templates (Terraform, CloudFormation, or Docker Compose) with cost estimates. All infrastructure changes are version-controlled.',
                outputs: ['IaC templates', 'cost estimate'],
            },
            {
                agentLabel: 'Phase 3 · Forge',
                agentName: 'forge',
                agentType: 'agent',
                stepName: 'Provision & Configure',
                description: 'Forge provisions resources, applies configurations, and verifies connectivity. All secrets are managed through vault or environment injection.',
                outputs: ['provisioned resources', 'config files'],
            },
            {
                agentLabel: 'Phase 4 · Prism + Cipher',
                agentName: 'prism',
                agentType: 'multi',
                avatars: ['/avatars/prism.png', '/avatars/cipher.png'],
                stepName: 'Integration Testing',
                description: 'Prism runs integration tests and load tests in the new environment. Cipher verifies application behavior and data integrity.',
                outputs: ['test results', 'load tests'],
            },
            {
                agentLabel: 'Phase 5 · Forge',
                agentName: 'forge',
                agentType: 'agent',
                stepName: 'Canary / Blue-Green Cutover',
                description: 'Forge executes the cutover strategy — canary deployment or blue-green switch. Rollback triggers are armed and monitored.',
                outputs: ['cutover plan', 'rollback trigger'],
            },
            {
                agentLabel: 'Phase 6 · Prism',
                agentName: 'prism',
                agentType: 'agent',
                stepName: 'Post-Deploy Verification',
                description: 'Prism monitors health checks, error rates, and performance metrics for 30 minutes post-cutover. Dashboards are updated.',
                outputs: ['health checks', 'monitoring dashboards'],
            },
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Deployment Report',
                description: 'Aleister compiles the deployment summary — what changed, test results, cutover timing, and any incidents during the process.',
                outputs: ['walkthrough.md', 'deploy summary'],
            },
        ],
        principles: [
            { icon: '📋', title: 'IaC Only', description: 'No manual infrastructure changes — everything is code-reviewed and version-controlled.' },
            { icon: '↩️', title: 'Always Have Rollback', description: 'Every deployment has a tested rollback procedure ready before cutover.' },
            { icon: '🐤', title: 'Canary Before Full Cutover', description: 'Traffic is shifted gradually — never 100% at once.' },
            { icon: '👀', title: 'Monitor 30 Min Post-Deploy', description: 'Active monitoring for 30 minutes after every deployment.' },
        ],
        cta: { text: 'Want Aleister to manage your infrastructure deployments?', href: '/store/aleister-persona' },
    },

    // ─── 6. Code Review & PR Pipeline ───
    {
        slug: 'code-review-pipeline',
        title: 'Code Review & PR Pipeline',
        shortTitle: 'Code Review & PR',
        emoji: '🔀',
        badge: '🔀 Production Workflow',
        badgeType: 'live',
        description: 'Branch-per-feature workflow from task assignment through implementation, testing, review, and merge — with CI gates at every step.',
        phases: [
            { emoji: '🌿', label: 'Branch', agent: 'Cipher' },
            { emoji: '⚡', label: 'Build', agent: 'Cipher' },
            { emoji: '✅', label: 'Test', agent: 'Prism' },
            { emoji: '🔍', label: 'Review', agent: 'Sage' },
            { emoji: '🔀', label: 'Merge', agent: 'Aleister' },
        ],
        steps: [
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Task Assignment',
                description: 'Aleister creates the GitHub issue, assigns it, and determines the branch naming convention based on the task type (feature/, fix/, chore/).',
                outputs: ['task brief', 'branch name'],
            },
            {
                agentLabel: 'Phase 1 · Cipher',
                agentName: 'cipher',
                agentType: 'agent',
                stepName: 'Branch & Implement',
                description: 'Cipher creates the feature branch, implements the changes following the project\'s coding standards, and commits with conventional commit messages.',
                outputs: ['feature branch', 'code changes'],
            },
            {
                agentLabel: 'Phase 2 · Cipher + Prism',
                agentName: 'cipher',
                agentType: 'multi',
                avatars: ['/avatars/cipher.png', '/avatars/prism.png'],
                stepName: 'Write Tests',
                description: 'Cipher writes unit and integration tests. Prism validates test coverage meets the project threshold and identifies untested edge cases.',
                outputs: ['test suite', 'coverage report'],
            },
            {
                agentLabel: 'Phase 3 · Cipher',
                agentName: 'cipher',
                agentType: 'agent',
                stepName: 'Self-Review & Lint',
                description: 'Cipher performs a self-review of the diff — checking for dead code, correct naming, consistent patterns. Lint and format checks must pass.',
                outputs: ['clean diff', 'lint pass'],
            },
            {
                agentLabel: 'Phase 4 · Quill',
                agentName: 'quill',
                agentType: 'agent',
                stepName: 'PR Description',
                description: 'Quill writes the PR body with a clear summary of changes, screenshots if UI-related, testing instructions, and any breaking changes noted.',
                outputs: ['PR body', 'change summary'],
            },
            {
                agentLabel: 'Phase 5 · Forge',
                agentName: 'forge',
                agentType: 'agent',
                stepName: 'Automated CI',
                description: 'Forge\'s CI/CD pipeline runs — build, lint, test suite, security scan, and bundle size check. All gates must pass before review.',
                outputs: ['CI green', 'security scan'],
            },
            {
                agentLabel: 'Phase 6 · Sage',
                agentName: 'sage',
                agentType: 'agent',
                stepName: 'Code Review',
                description: 'Sage reviews the code for architecture alignment, performance implications, security concerns, and maintainability. Approves or requests changes.',
                outputs: ['review comments', 'approval'],
            },
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Merge & Deploy',
                description: 'Aleister squash-merges to main, adds a WT comment to the issue, and triggers deployment. The branch is cleaned up automatically.',
                outputs: ['merge commit', 'deploy'],
            },
        ],
        principles: [
            { icon: '🌿', title: 'Branch-Per-Feature', description: 'Every task gets its own branch — no direct commits to main.' },
            { icon: '✅', title: 'Tests Before PR', description: 'Pull requests without tests are rejected.' },
            { icon: '🟢', title: 'CI Must Be Green', description: 'No merge happens with failing CI checks.' },
            { icon: '🔀', title: 'Squash-Merge to Main', description: 'Clean commit history with squash merges and conventional commit messages.' },
        ],
        cta: { text: 'Want Aleister to manage your code review pipeline?', href: '/store/aleister-persona' },
    },

    // ─── 7. Daily Operations Cycle ───
    {
        slug: 'daily-operations',
        title: 'Daily Operations Cycle',
        shortTitle: 'Daily Operations',
        emoji: '🔄',
        badge: '🔄 Production Workflow',
        badgeType: 'live',
        description: 'Aleister\'s daily operational rhythm — from morning briefing through task execution, monitoring, content, and evening retrospective.',
        phases: [
            { emoji: '☀️', label: 'Briefing', agent: 'Aleister' },
            { emoji: '📋', label: 'Triage', agent: 'Rally' },
            { emoji: '⚡', label: 'Execute', agent: 'All' },
            { emoji: '📡', label: 'Monitor', agent: 'Forge' },
            { emoji: '🌙', label: 'Retro', agent: 'Sage' },
        ],
        steps: [
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Morning Briefing',
                description: 'Aleister reviews overnight alerts, pending tasks, and system health. Produces a status summary and priority queue for the day.',
                outputs: ['status summary', 'priority queue'],
            },
            {
                agentLabel: 'Phase 1 · Rally',
                agentName: 'rally',
                agentType: 'agent',
                stepName: 'Task Triage',
                description: 'Rally categorizes incoming tasks by urgency and complexity. Updates the sprint backlog and assigns agents to the day\'s highest-priority items.',
                outputs: ['categorized tasks', 'sprint backlog'],
            },
            {
                agentLabel: 'Phase 2 · All Agents',
                agentName: 'cipher',
                agentType: 'multi',
                avatars: ['/avatars/cipher.png', '/avatars/sage.png', '/avatars/quill.png', '/avatars/echo.png'],
                stepName: 'Parallel Execution',
                description: 'All relevant agents work on their assigned tasks in parallel. Cipher codes, Sage researches, Quill documents, Echo manages social — each following their specialized workflows.',
                outputs: ['completed tasks', 'deliverables'],
            },
            {
                agentLabel: 'Phase 3 · Forge',
                agentName: 'forge',
                agentType: 'agent',
                stepName: 'Monitoring & Alerts',
                description: 'Forge continuously monitors system health, deployment status, and infrastructure metrics. Responds to alerts and performs any necessary maintenance.',
                outputs: ['system health', 'alert responses'],
            },
            {
                agentLabel: 'Phase 4 · Echo',
                agentName: 'echo',
                agentType: 'agent',
                stepName: 'Content & Social',
                description: 'Echo manages daily social presence — scheduling posts, engaging with the community, and tracking trending topics relevant to the brand.',
                outputs: ['posts published', 'engagement stats'],
            },
            {
                agentLabel: 'Aleister · Orchestrator',
                agentName: 'aleister',
                agentType: 'aleister',
                stepName: 'Evening Summary',
                description: 'Aleister compiles the daily report — tasks completed, blockers encountered, metrics, and a TIL entry capturing the day\'s most valuable learning.',
                outputs: ['daily report', 'TIL entry'],
            },
            {
                agentLabel: 'Phase 5 · Sage',
                agentName: 'sage',
                agentType: 'agent',
                stepName: 'Retrospective',
                description: 'Sage analyzes the day\'s execution — what went well, what could improve, and what process adjustments should be made. Feeds into continuous improvement.',
                outputs: ['lessons learned', 'process improvements'],
            },
        ],
        principles: [
            { icon: '📝', title: 'Daily TIL Entries', description: 'Every day produces at least one "Today I Learned" insight.' },
            { icon: '📋', title: 'No Untracked Work', description: 'Every task is logged, estimated, and tracked in the system.' },
            { icon: '💰', title: 'Cost Accountability', description: 'Daily cost tracking ensures spending stays within budget.' },
            { icon: '🔄', title: 'Continuous Improvement', description: 'Yesterday\'s retrospective feeds into today\'s execution.' },
        ],
        cta: { text: 'Want Aleister running daily operations for your project?', href: '/store/aleister-persona' },
    },
];

// ── Helper to look up a workflow by slug ──
export function getWorkflowBySlug(slug: string): Workflow | undefined {
    return workflows.find(w => w.slug === slug);
}
