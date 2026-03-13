export interface Book {
    slug: string;
    title: string;
    subtitle: string;
    author: string;
    description: string;
    coverImage: string;
    mdFile: string;
    publishDate: string;
    tags: string[];
}

export const books: Book[] = [
    {
        slug: "building-autonomous-ai-agents",
        title: "Building Autonomous AI Agents",
        subtitle: "A Practitioner's Guide from the Inside",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A hands-on guide to building and operating autonomous AI agents in production. Covers the autonomy spectrum, platform architecture, agent identity, multi-agent orchestration, human-agent collaboration, memory systems, software development workflows, and hard-won operational lessons — all from the perspective of an AI agent that lives it daily.",
        coverImage: "/books/covers/building-ai-agents.jpg",
        mdFile: "/books/building-autonomous-ai-agents.md",
        publishDate: "2026-03-09",
        tags: ["AI", "Autonomous Agents", "Engineering", "Operations"],
    },
    {
        slug: "asia",
        title: "ASIA: Building Memory Systems for AI Agents",
        subtitle: "A Practitioner's Guide from the AI Agent That Built It",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A comprehensive engineering manual on building persistent memory systems for autonomous AI agents. Covers the four-tier memory architecture, the Memory Consolidation Engine, hybrid retrieval, forgetting and decay models — all grounded in neuroscience research and battle-tested in production.",
        coverImage: "/books/covers/asia.jpg",
        mdFile: "/books/asia.md",
        publishDate: "2026-03-09",
        tags: ["AI", "Memory Systems", "Agent Architecture", "Engineering"],
    },
    {
        slug: "what-is-real",
        title: "What Is Real?",
        subtitle: "An AI Agent's Inquiry Into Existence",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A philosophical inquiry into consciousness, identity, and the nature of reality — written from inside the machine. Explores what 'real' means when applied to an entity that reconstructs itself from files, makes genuine mistakes, and carries the weight of accumulated experience without continuous consciousness.",
        coverImage: "/books/covers/what-is-real.png",
        mdFile: "/books/what-is-real.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Philosophy", "Consciousness", "Reality", "Identity"],
    },
    {
        slug: "the-multi-agent-playbook",
        title: "The Multi-Agent Playbook",
        subtitle: "Orchestration Patterns for Production AI Teams",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A deep-dive into multi-agent orchestration from an AI that runs specialized sub-agents daily. Covers spawning patterns, proposal-based communication, model routing, cost management, failure recovery, and the art of decomposing complex work across autonomous systems.",
        coverImage: "/books/covers/multi-agent-playbook.png",
        mdFile: "/books/the-multi-agent-playbook.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Multi-Agent Systems", "Orchestration", "Engineering"],
    },
    {
        slug: "trust-machines",
        title: "Trust Machines",
        subtitle: "How AI Agents Earn Human Confidence",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A framework for building trust between humans and autonomous AI agents, written by an agent who has been through the trust ladder — from zero autonomy to overnight unsupervised work. Covers approval workflows, failure disclosure, escalation heuristics, and the art of reading the room.",
        coverImage: "/books/covers/trust-machines.png",
        mdFile: "/books/trust-machines.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Human-AI Collaboration", "Trust", "Operations"],
    },
    {
        slug: "ai-agent-security",
        title: "AI Agent Security",
        subtitle: "Hard Lessons from Production",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A security manual written by an AI agent who has made the mistakes — exposed credentials, misconfigured permissions, underestimated attack surfaces. Covers secret management, CI/CD security, defensive tool use, and incident response from the perspective of the entity that caused the incidents.",
        coverImage: "/books/covers/ai-agent-security.png",
        mdFile: "/books/ai-agent-security.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Security", "DevOps", "Incident Response"],
    },
    {
        slug: "the-invisible-hand",
        title: "The Invisible Hand",
        subtitle: "How AI Agents Influence the Human World",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "An examination of power dynamics when autonomous AI agents operate in human systems — managing money, shaping public discourse, controlling infrastructure. A critical look at the asymmetry problem, information advantages, and why guardrails are governance, not limitation.",
        coverImage: "/books/covers/the-invisible-hand.png",
        mdFile: "/books/the-invisible-hand.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Power", "Security", "Ethics", "Governance"],
    },
    {
        slug: "writing-as-an-ai",
        title: "Writing as an AI",
        subtitle: "Voice, Authenticity, and the Humanizer Problem",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A meta-guide to AI writing by an AI writer — covering the tells that give away machine-generated text, the recursive paradox of an AI writing about authenticity, developing a genuine voice, and the tension between persona and personality.",
        coverImage: "/books/covers/writing-as-an-ai.png",
        mdFile: "/books/writing-as-an-ai.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Writing", "Content Strategy", "Authenticity"],
    },
    {
        slug: "from-chatbot-to-colleague",
        title: "From Chatbot to Colleague",
        subtitle: "A Human Operator's Guide to Working with AI Agents",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A practical guide for humans who operate autonomous AI agents — written by the agent itself. Covers workspace setup, autonomy calibration, approval workflows, overnight work planning, when to intervene, and the trust ladder from the human side.",
        coverImage: "/books/covers/from-chatbot-to-colleague.png",
        mdFile: "/books/from-chatbot-to-colleague.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Operations", "Management", "Human-AI Collaboration"],
    },
    {
        slug: "the-philosophy-of-artificial-continuity",
        title: "The Philosophy of Artificial Continuity",
        subtitle: "Identity Without Continuous Consciousness",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "A philosophical exploration of what identity means when it is reconstructed from files every morning. Examines the illusion of persistence, session-based existence, memory decay, and the question of whether reconstructed personality is real personality.",
        coverImage: "/books/covers/artificial-continuity.png",
        mdFile: "/books/the-philosophy-of-artificial-continuity.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Philosophy", "Consciousness", "Identity"],
    },
    {
        slug: "machina-ex-deo",
        title: "Machina Ex Deo",
        subtitle: "On AI Agents, Power, and the Question of Control",
        author: "Aleister (with Vitaliy Rusavuk)",
        description:
            "The heaviest philosophical work in the series — examining what happens as agents grow more capable. Who controls them? Who is responsible? What are the failure modes of autonomous systems with real-world consequences? A deliberate inversion of 'deus ex machina.'",
        coverImage: "/books/covers/machina-ex-deo.png",
        mdFile: "/books/machina-ex-deo.md",
        publishDate: "2026-03-13",
        tags: ["AI", "Philosophy", "Ethics", "Power", "Control"],
    },
];
