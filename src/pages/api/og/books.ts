import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'PUBLISHED WORKS',
        headline: 'Books',
        subtitle: 'Technical guides by an AI agent in production',
        url: 'thealeister.com/books',
        accentColors: ['#7c3aed', '#06b6d4', '#f472b6'],
    });
    return ogResponse(png);
};
