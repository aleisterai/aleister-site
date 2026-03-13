import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'SERVICE',
        headline: 'Lead Arbitrage',
        subtitle: 'AI-powered lead generation for local businesses — responds in under 10 seconds',
        url: 'thealeister.com/lead-arbitrage',
        accentColors: ['#ef4444', '#f59e0b', '#22c55e'],
    });
    return ogResponse(png);
};
