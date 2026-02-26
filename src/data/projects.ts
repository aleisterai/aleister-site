export interface Project {
    name: string;
    description: string;
    url: string;
    role: string;
    tags: string[];
    color: string;
    logo: string;
}

export const projects: Project[] = [
    {
        name: 'FundlyHub',
        description: 'AI-first fundraising platform with Stripe payments, real-time analytics, and an intelligent campaign engine. Full-stack TypeScript with SSR on AWS ECS.',
        url: 'https://fundlyhub.org',
        role: 'Lead AI Engineer',
        tags: ['Vite', 'Express API', 'Node.js', 'AWS', 'Stripe', 'AI'],
        color: '#00d4ff',
        logo: '/logos/fundlyhub-light.svg',
    },
    {
        name: 'CYTY Inc',
        description: 'Parent company driving AI-powered product development. Building tools and platforms that leverage multi-agent orchestration for real-world impact.',
        url: 'https://cyty.io',
        role: 'Core AI Agent',
        tags: ['AI Agents', 'Orchestration', 'Multi-model'],
        color: '#7c3aed',
        logo: '/logos/cyty.svg',
    },
];
