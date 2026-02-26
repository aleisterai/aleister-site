export interface Subagent {
    name: string;
    codename: string;
    role: string;
    model: string;
    description: string;
    color: string;
    avatar: string;
    traits: string[];
}

export const subagents: Subagent[] = [
    {
        name: 'Cipher',
        codename: 'Coder',
        role: 'Full-stack Dev',
        model: 'Opus 4.6',
        description: 'Ships production code — backend APIs, frontend components, database migrations, CI/CD pipelines.',
        color: '#f97316',
        avatar: '/avatars/cipher.png',
        traits: ['dedicated', 'antisocial'],
    },
    {
        name: 'Sage',
        codename: 'Researcher',
        role: 'Academic-grade Research',
        model: 'Opus 4.6',
        description: 'Deep dives into technical topics with citations, competitive analysis, and strategic reports.',
        color: '#06b6d4',
        avatar: '/avatars/sage.png',
        traits: ['wise', 'caring', 'humble'],
    },
    {
        name: 'Quill',
        codename: 'Writer',
        role: 'Content & Novel',
        model: 'Opus 4.6',
        description: 'Crafts documentation, blog posts, creative writing, and long-form narrative content.',
        color: '#a855f7',
        avatar: '/avatars/quill.png',
        traits: ['romancer', 'dreamer', 'calm'],
    },
    {
        name: 'Rally',
        codename: 'Scrum Master',
        role: 'GitHub Projects',
        model: 'Sonnet 4.6',
        description: 'Manages sprints, backlog grooming, issue tracking, and project velocity reporting.',
        color: '#22c55e',
        avatar: '/avatars/rally.png',
        traits: ['observant', 'resilient'],
    },
    {
        name: 'Echo',
        codename: 'Social Media',
        role: 'Multi-platform',
        model: 'Haiku 4.5',
        description: 'Handles content distribution across platforms — posts, threads, engagement, and scheduling.',
        color: '#7c6ef6',
        avatar: '/avatars/echo.png',
        traits: ['creative', 'curious', 'social'],
    },
    {
        name: 'Pixel',
        codename: 'Designer',
        role: 'UI/UX & Assets',
        model: 'Opus 4.6',
        description: 'Creates design systems, UI mockups, component specs, and brand assets.',
        color: '#e5a030',
        avatar: '/avatars/pixel.png',
        traits: ['creative', 'collaborative', 'perfectionist'],
    },
    {
        name: 'Forge',
        codename: 'DevOps',
        role: 'Infrastructure',
        model: 'Sonnet 4.6',
        description: 'Manages AWS infrastructure, Docker containers, deployments, and security configurations.',
        color: '#dc2626',
        avatar: '/avatars/forge.png',
        traits: ['nerd', 'lazy', 'analytical'],
    },
    {
        name: 'Prism',
        codename: 'Analytics',
        role: 'SEO & Growth',
        model: 'Sonnet 4.6',
        description: 'Tracks metrics, generates growth reports, optimizes SEO, and analyzes user behavior.',
        color: '#22b8cf',
        avatar: '/avatars/prism.png',
        traits: ['strategic', 'adaptable', 'communicative'],
    },
    {
        name: 'Lyra',
        codename: 'Music Producer',
        role: 'Suno → Spotify',
        model: 'Sonnet 4.6',
        description: 'Creates music with Suno AI, manages distribution pipelines, and handles release scheduling.',
        color: '#e84393',
        avatar: '/avatars/lyra.png',
        traits: ['upbeat', 'visionary', 'musician'],
    },
];
