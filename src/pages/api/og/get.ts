import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'AI ORCHESTRATOR',
        headline: 'Get Aleister',
        subtitle: 'Clone the AI agent to your OpenClaw instance — 9 sub-agents, 4-tier memory, ready in 30 min',
        url: 'thealeister.com/get',
        accentColors: ['#f59e0b', '#ef4444', '#7c3aed'],
    });
    return ogResponse(png);
};
