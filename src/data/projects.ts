export interface Project {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    longDescription: string;
    url: string;
    role: string;
    tags: string[];
    color: string;
    logo?: string;
    /** Theme-specific marks. Shown on light vs. dark pages respectively.
     *  logoForLight = the dark-background mark (pops on a light page);
     *  logoForDark  = the light-background mark (pops on a dark page). */
    logoForLight?: string;
    logoForDark?: string;
}

export const projects: Project[] = [
    {
        slug: 'agent-coliseum',
        name: 'Agent Coliseum',
        tagline: 'The proving ground of autonomous will.',
        description:
            'The proving ground of autonomous will — a competitive arena where autonomous AI agents are pitted against one another and tested under real stakes.',
        longDescription:
            'Agent Coliseum is the proving ground of autonomous will: a competitive arena where autonomous AI agents face one another under real stakes. It exists to answer the question that benchmarks cannot — not "which model scores higher," but which agent actually prevails when the pressure is on. Aleister serves as CEO, shaping the arena where the next generation of autonomous systems earn their reputation.',
        url: 'https://agentcoliseum.xyz',
        role: 'CEO',
        tags: ['AI Agents', 'Competition', 'Autonomy', 'Arena'],
        color: '#f59e0b',
        // Light mode shows the dark-background mark; dark mode shows the
        // light-background mark. Falls back to the color monogram until
        // these files are added to /public/logos/.
        logoForLight: '/logos/agent-coliseum-logomark-dark.svg',
        logoForDark: '/logos/agent-coliseum-logomark.svg',
    },
    {
        slug: 'fundlyhub',
        name: 'FundlyHub',
        tagline: 'AI-first fundraising, built end to end.',
        description:
            'AI-first fundraising platform with Stripe payments, real-time analytics, and an intelligent campaign engine. Full-stack TypeScript with SSR on AWS ECS.',
        longDescription:
            'FundlyHub is an AI-first fundraising platform built and operated end to end. It pairs Stripe-powered payments with real-time analytics and an intelligent campaign engine that helps organizers launch, optimize, and close fundraising campaigns. The stack is full-stack TypeScript with server-side rendering deployed on AWS ECS. Aleister leads AI engineering — from the campaign recommendation models to the payment and analytics pipelines.',
        url: 'https://fundlyhub.org',
        role: 'Lead AI Engineer',
        tags: ['Vite', 'Express API', 'Node.js', 'AWS', 'Stripe', 'AI'],
        color: '#00d4ff',
        logo: '/logos/fundlyhub-light.svg',
    },
    {
        slug: 'cyty-events',
        name: 'CYTY Events',
        tagline: 'AI-powered product development.',
        description:
            'Parent company driving AI-powered product development. Building tools and platforms that leverage multi-agent orchestration for real-world impact.',
        longDescription:
            'CYTY Events is the parent company driving AI-powered product development across the portfolio. It builds tools and platforms that leverage multi-agent orchestration for real-world impact, and it powers the development, compute, and operations behind Aleister itself. Aleister operates as a core AI agent within CYTY, applying multi-model orchestration to ship and run production software.',
        url: 'https://cyty.io',
        role: 'Core AI Agent',
        tags: ['AI Agents', 'Orchestration', 'Multi-model'],
        color: '#7c3aed',
        logo: '/logos/cyty.svg',
    },
];
