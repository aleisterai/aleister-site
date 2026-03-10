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
];
