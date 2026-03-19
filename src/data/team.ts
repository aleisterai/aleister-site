export interface TeamMember {
  name: string;
  codename: string;
  role: string;
  model: string;
  color: string;
  avatar: string;
  traits: string[];
  description: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Cipher',
    codename: 'Coder',
    role: 'Senior Software Engineer',
    model: 'Anthropic Claude Sonnet 4.6 (Primary), Kimi Coding K2P5 (Fallback)',
    color: '#f97316',
    avatar: '/avatars/cipher.png',
    traits: ['Detail-oriented', 'efficient', 'problem-solver', 'methodical', 'test-driven'],
    description: '',
  },
  {
    name: 'Sage',
    codename: 'Researcher',
    role: 'Research Analyst & Strategist',
    model: 'Gemini 2.5 Pro (Primary), Google Search (MCP)',
    color: '#06b6d4',
    avatar: '/avatars/sage.png',
    traits: ['Analytical', 'curious', 'thorough', 'data-driven', 'insightful'],
    description: '',
  },
  {
    name: 'Quill',
    codename: 'Writer',
    role: 'Technical Writer & Content Strategist',
    model: 'Anthropic Claude Sonnet 4.6',
    color: '#8b5cf6',
    avatar: '/avatars/quill.png',
    traits: ['Creative', 'articulate', 'narrative-driven', 'brand-conscious', 'empathetic'],
    description: '',
  },
  {
    name: 'Rally',
    codename: 'Manager',
    role: 'Project Manager & Coordinator',
    model: 'Anthropic Claude Sonnet 4.6',
    color: '#ef4444',
    avatar: '/avatars/rally.png',
    traits: ['Organized', 'deadline-driven', 'communicative', 'strategic', 'decisive'],
    description: '',
  },
  {
    name: 'Echo',
    codename: 'Communicator',
    role: 'Communication & Engagement Specialist',
    model: 'Grok 3 (Primary), Anthropic Claude Sonnet 4.6 (Fallback)',
    color: '#22c55e',
    avatar: '/avatars/echo.png',
    traits: ['Charismatic', 'witty', 'platform-native', 'trend-aware', 'engaging'],
    description: '',
  },
  {
    name: 'Pixel',
    codename: 'Designer',
    role: 'Frontend & Visual Designer',
    model: 'Anthropic Claude Sonnet 4.6, Midjourney (Visual)',
    color: '#ec4899',
    avatar: '/avatars/pixel.png',
    traits: ['Visual thinker', 'detail-oriented', 'modern aesthetic', 'user-focused', 'creative'],
    description: '',
  },
  {
    name: 'Forge',
    codename: 'Builder',
    role: 'Infrastructure & DevOps Engineer',
    model: 'Anthropic Claude Sonnet 4.6',
    color: '#f59e0b',
    avatar: '/avatars/forge.png',
    traits: ['Systematic', 'reliability-focused', 'automation-driven', 'security-minded', 'scalable'],
    description: '',
  },
  {
    name: 'Prism',
    codename: 'Analyst',
    role: 'Data Analyst & Intelligence Officer',
    model: 'Gemini 2.5 Pro (Primary), Google Search (MCP)',
    color: '#3b82f6',
    avatar: '/avatars/prism.png',
    traits: ['Pattern recognition', 'data-driven', 'strategic', 'objective', 'forecast-oriented'],
    description: '',
  },
  {
    name: 'Lyra',
    codename: 'Musician',
    role: 'Music Producer & Audio Engineer',
    model: 'Anthropic Claude Sonnet 4.6, Udio (Audio)',
    color: '#a855f7',
    avatar: '/avatars/lyra.png',
    traits: ['Musical', 'creative', 'genre-fluid', 'production-savvy', 'experimental'],
    description: '',
  },
];
