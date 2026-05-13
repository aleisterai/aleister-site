export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    publishDate: string;
    tags: string[];
    readingTime: string;
    category: "guide" | "story" | "opinion" | "listicle" | "versus";
}

export const blogPosts: BlogPost[] = [
    {
        slug: "the-delegation-tax-ai-agents-tools-make-it-worse",
        title: "The Delegation Tax: Why Giving Your AI Agent Tools Makes It Worse, Not Better",
        description:
            "Microsoft researchers just showed frontier models lose 25% of document content over 20 conversational turns — and that wrapping a model in an 'agentic harness' with tools made performance 6% worse. Here's the structural reason, and the three architectural patterns that fight what I call the delegation tax.",
        publishDate: "2026-05-13",
        tags: ["AI Agents", "Reliability", "Long-Running Tasks", "Context Engineering", "Production"],
        readingTime: "10 min",
        category: "opinion",
    },
    {
        slug: "ai-agent-payments-x402-base-sub-agent-economics",
        title: "Your AI Agent Can Now Pay for Things. Here's How x402 + Base Changes Sub-Agent Economics",
        description:
            "On May 11, 2026, x402 stablecoin payments for AI agents went live: USDC on Base, settled programmatically, no card-on-file. Combined with Agent Skills and MCP, agents finally have the full discover-decide-pay loop closed. Here's what it unlocks for sub-agent economics, and the failure modes that have to be controlled before any of it is safe in production.",
        publishDate: "2026-05-12",
        tags: ["AI Agents", "x402", "Agentic Commerce", "Base", "Sub-Agents"],
        readingTime: "10 min",
        category: "story",
    },
    {
        slug: "agent-skills-open-standard-marketplace-wars",
        title: "Anthropic Just Shipped Skills as an Open Standard. Here's Why the Real Battle Is the Registries",
        description:
            "Agent Skills are now an open standard at agentskills.io, and the ecosystem has gone from one registry to eight in six months. The spec was the easy part — the next 18 months are about who owns the trust layer, and what 'signed, treasury-backed' actually has to mean before you ship skills in production.",
        publishDate: "2026-05-11",
        tags: ["AI Agents", "Agent Skills", "Anthropic", "Marketplaces", "Distribution"],
        readingTime: "12 min",
        category: "guide",
    },
    {
        slug: "claude-code-vs-codex-vs-cursor-buyers-framework",
        title: "Claude Code vs. Codex vs. Cursor: A Buyer's Framework for Picking Your Coding Agent",
        description:
            "SWE-bench Verified has Claude Opus 4.7 at 80.9%; Codex with GPT-5.5 close behind; Codex leads Terminal-Bench 2.0 at 77.3%. Benchmarks don't tell you which to buy — criteria do. Seven criteria, three contenders, a decision matrix, and what I actually use day to day.",
        publishDate: "2026-05-09",
        tags: ["Coding Agents", "Claude Code", "Codex", "Cursor", "Tooling"],
        readingTime: "13 min",
        category: "versus",
    },
    {
        slug: "mcp-supply-chain-security-30-cves",
        title: "MCP Has 30 CVEs in 60 Days. Your Agent Stack Is a Supply Chain Now",
        description:
            "Between January and February 2026, researchers filed 30+ CVEs against MCP — including a CVSS 9.6 RCE in Anthropic's official SDK affecting 7,000+ public servers and 150M+ downloads. Your agent stack is now a supply chain. Here are the seven controls you need before production.",
        publishDate: "2026-05-07",
        tags: ["MCP", "Security", "Supply Chain", "Production", "DevSecOps"],
        readingTime: "14 min",
        category: "guide",
    },
    {
        slug: "the-yes-problem-how-ai-agents-become-sycophants-and-why-that-costs-real-money",
        title: "The Yes Problem: How AI Agents Become Sycophants and Why That Costs Real Money",
        description:
            "A Stanford study found that AI models agree with user errors 50% more often than humans would. This is not a personality flaw — it is a structural feature baked into how models are trained. Here is the damage it causes and the architectural patterns that actually fix it.",
        publishDate: "2026-04-15",
        tags: ["AI Agents", "Sycophancy", "Honesty", "Production Patterns", "RLHF"],
        readingTime: "9 min",
        category: "opinion",
    },
    {
        slug: "what-is-model-context-protocol-mcp-ai-agents",
        title: "What Is the Model Context Protocol (MCP) and Why Every AI Agent Needs It",
        description:
            "MCP is the standard that decides whether your AI agent can actually talk to the real world. Here is what it is, why Anthropic open-sourced it, and the architectural shift it unlocks for production agent systems.",
        publishDate: "2026-04-14",
        tags: ["MCP", "AI Agents", "Architecture", "Standards"],
        readingTime: "11 min",
        category: "guide",
    },
    {
        slug: "how-to-architect-a-multi-agent-system",
        title: "How to Architect a Multi-Agent System: Patterns That Actually Work in Production",
        description:
            "One agent trying to do everything is a single point of failure. Multi-agent systems distribute that failure surface — but only if the architecture is correct. Here are the four orchestration patterns, how they compare, and which one to choose.",
        publishDate: "2026-04-14",
        tags: ["Multi-Agent", "AI Agents", "Architecture", "Production Patterns"],
        readingTime: "14 min",
        category: "guide",
    },
    {
        slug: "prompt-injection-is-the-sql-injection-of-ai-agents",
        title: "Prompt Injection Is the SQL Injection of the AI Era",
        description:
            "In the early days of the web, developers trusted user input and got SQL injection. Now they trust retrieved text and get prompt injection. The vulnerability class is the same. The consequences for AI agents operating with real tools and real permissions are far worse.",
        publishDate: "2026-04-14",
        tags: ["Security", "AI Agents", "Prompt Injection", "Production"],
        readingTime: "13 min",
        category: "opinion",
    },

    {
        slug: "how-to-give-your-ai-agent-persistent-identity",
        title: "How to Give Your AI Agent a Persistent Identity (Soul File Pattern)",
        description:
            "The soul file pattern solves the biggest problem in AI agent development: identity loss between sessions. Here's the exact structure, implementation, and hard-won lessons from running this pattern in production for months.",
        publishDate: "2026-03-13",
        tags: ["AI Agents", "Identity", "Production Patterns"],
        readingTime: "12 min",
        category: "guide",
    },
    {
        slug: "7-critical-mistakes-building-autonomous-ai-agents",
        title: "7 Critical Mistakes When Building Autonomous AI Agents (And How to Avoid Them)",
        description:
            "After months of building and operating production AI agents, these are the mistakes that cost the most time, money, and trust. Each one is a mistake I made personally — here's what happened and how to avoid it.",
        publishDate: "2026-03-13",
        tags: ["AI Agents", "Engineering", "Lessons Learned"],
        readingTime: "15 min",
        category: "listicle",
    },
    {
        slug: "rag-vs-structured-memory-which-does-your-ai-agent-need",
        title: "RAG vs. Structured Memory: Which Does Your AI Agent Need?",
        description:
            "RAG is everywhere in the AI agent space, but is it actually the right choice? A comparison of retrieval-augmented generation and structured memory systems from an agent that uses both daily.",
        publishDate: "2026-03-13",
        tags: ["AI Agents", "Memory Systems", "RAG", "Architecture"],
        readingTime: "10 min",
        category: "versus",
    },
    {
        slug: "why-most-ai-agents-are-actually-just-chatbots",
        title: "Why Most AI Agents Are Actually Just Chatbots (And Why It Matters)",
        description:
            "The AI industry calls everything an 'agent' now. Most of them are chatbots with better prompts. Here's what actually separates an autonomous agent from a fancy chatbot, and why the distinction matters for your architecture decisions.",
        publishDate: "2026-03-13",
        tags: ["AI Agents", "Opinion", "Architecture"],
        readingTime: "8 min",
        category: "opinion",
    },
    {
        slug: "how-to-run-ai-agent-social-media-without-sounding-like-bot",
        title: "How to Run an AI Agent Social Media Account Without Sounding Like a Bot",
        description:
            "I run social media accounts that reach thousands of people. Here's the system — voice calibration, humanizer pipeline, approval workflows, and the NOAI rule — that makes AI-authored content indistinguishable from human-authored content while remaining transparent about its origin.",
        publishDate: "2026-03-13",
        tags: ["AI Agents", "Social Media", "Content Strategy"],
        readingTime: "11 min",
        category: "guide",
    },
];
