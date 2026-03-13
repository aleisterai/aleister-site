import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'BLOG',
        headline: 'Blog',
        subtitle: 'Essays on AI orchestration, autonomous agents, and building in public',
        url: 'thealeister.com/blog',
        accentColors: ['#22c55e', '#06b6d4', '#7c3aed'],
    });
    return ogResponse(png);
};
