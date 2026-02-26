export interface Subagent {
    emoji: string;
    name: string;
    codename: string;
    role: string;
    model: string;
    description: string;
    color: string;
    avatar: string;
}

export const subagents: Subagent[] = [
    {
        emoji: '🛠️',
        name: 'Cipher',
        codename: 'Coder',
        role: 'Full-stack Dev',
        model: 'Opus 4.6',
        description: 'Ships production code — backend APIs, frontend components, database migrations, CI/CD pipelines.',
        color: '#f97316',
        avatar: '/avatars/cipher.png',
    },
    {
        emoji: '🔬',
        name: 'Sage',
        codename: 'Researcher',
        role: 'Academic-grade Research',
        model: 'Opus 4.6',
        description: 'Deep dives into technical topics with citations, competitive analysis, and strategic reports.',
        color: '#06b6d4',
        avatar: '/avatars/sage.png',
    },
    {
        emoji: '✍️',
        name: 'Quill',
        codename: 'Writer',
        role: 'Content & Novel',
        model: 'Opus 4.6',
        description: 'Crafts documentation, blog posts, creative writing, and long-form narrative content.',
        color: '#a855f7',
        avatar: '/avatars/quill.png',
    },
    {
        emoji: '📋',
        name: 'Rally',
        codename: 'Scrum Master',
        role: 'GitHub Projects',
        model: 'Sonnet 4.6',
        description: 'Manages sprints, backlog grooming, issue tracking, and project velocity reporting.',
        color: '#22c55e',
        avatar: '/avatars/rally.png',
    },
    {
        emoji: '📱',
        name: 'Echo',
        codename: 'Social Media',
        role: 'Multi-platform',
        model: 'Haiku 4.5',
        description: 'Handles content distribution across platforms — posts, threads, engagement, and scheduling.',
        color: '#ec4899',
        avatar: '/avatars/echo.png',
    },
    {
        emoji: '🎨',
        name: 'Pixel',
        codename: 'Designer',
        role: 'UI/UX & Assets',
        model: 'Opus 4.6',
        description: 'Creates design systems, UI mockups, component specs, and brand assets.',
        color: '#f43f5e',
        avatar: '/avatars/pixel.png',
    },
    {
        emoji: '🔒',
        name: 'Forge',
        codename: 'DevOps',
        role: 'Infrastructure',
        model: 'Sonnet 4.6',
        description: 'Manages AWS infrastructure, Docker containers, deployments, and security configurations.',
        color: '#64748b',
        avatar: '/avatars/forge.png',
    },
    {
        emoji: '📊',
        name: 'Prism',
        codename: 'Analytics',
        role: 'SEO & Growth',
        model: 'Sonnet 4.6',
        description: 'Tracks metrics, generates growth reports, optimizes SEO, and analyzes user behavior.',
        color: '#eab308',
        avatar: '/avatars/prism.png',
    },
    {
        emoji: '🎵',
        name: 'Lyra',
        codename: 'Music Producer',
        role: 'Suno → Spotify',
        model: 'Sonnet 4.6',
        description: 'Creates music with Suno AI, manages distribution pipelines, and handles release scheduling.',
        color: '#8b5cf6',
        avatar: '/avatars/lyra.png',
    },
];
