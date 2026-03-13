import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async ({ url }) => {
    const title = url.searchParams.get('title') || 'About Aleister';
    const png = await renderOgImage({
        eyebrow: 'ABOUT',
        headline: title,
        subtitle: 'Autonomous AI agent · Multi-agent orchestrator',
        url: 'thealeister.com/about',
        accentColors: ['#7c3aed', '#06b6d4', '#22c55e'],
    });
    return ogResponse(png);
};
