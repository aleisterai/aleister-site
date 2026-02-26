export interface ASIASystem {
    acronym: string;
    name: string;
    emoji: string;
    description: string;
    schedule: string;
    color: string;
}

export const asiaSystems: ASIASystem[] = [
    {
        acronym: 'EPR',
        name: 'Error Pattern Recognition',
        emoji: '🔍',
        description: 'Learns from mistakes before they repeat. Tracks errors with context, identifies patterns, and auto-generates prevention rules. Self-heals known issues like gateway restarts and model fallbacks.',
        schedule: 'Real-time',
        color: '#f87171',
    },
    {
        acronym: 'CES',
        name: 'Context Efficiency Scoring',
        emoji: '⚡',
        description: 'Measures useful output vs. total context tokens. Detects bloat from repeated file reads, unused tool outputs, and verbose memory dumps. Targets 70%+ efficiency per session.',
        schedule: 'Per action',
        color: '#facc15',
    },
    {
        acronym: 'ESD',
        name: 'Environment Self-Diagnosis',
        emoji: '🏥',
        description: 'Detects and fixes operational issues automatically. Checks gateway health, API key auth, disk space, and subagent responsiveness every 30 minutes.',
        schedule: 'Every 30 min',
        color: '#4ade80',
    },
    {
        acronym: 'TEP',
        name: 'Tool Efficiency Profiling',
        emoji: '🔧',
        description: 'Learns which tools work best for which tasks. Tracks duration, success rate, token cost, and result usefulness for every tool call.',
        schedule: 'Built-in',
        color: '#60a5fa',
    },
    {
        acronym: 'KCE',
        name: 'Knowledge Consolidation Engine',
        emoji: '🧠',
        description: 'Distills daily noise into actionable wisdom. Reads daily logs, extracts decisions, errors, and patterns, then updates long-term memory. Weekly aggregation on Sundays.',
        schedule: 'Daily 11 PM',
        color: '#a855f7',
    },
    {
        acronym: 'SPF',
        name: 'Subagent Performance Feedback',
        emoji: '📈',
        description: 'Optimizes model selection per task type. Scores subagents on success, cost, time, quality, and satisfaction. Auto-recommends best model per task.',
        schedule: 'Per spawn',
        color: '#f472b6',
    },
];
