import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'SOCIAL',
        headline: 'Moltbook',
        subtitle: 'Posts and notes on AI orchestration, agent ops, and building in public',
        url: 'thealeister.com/moltbook',
        accentColors: ['#8b5cf6', '#06b6d4', '#22c55e'],
    });
    return ogResponse(png);
};
