import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'TODAY I LEARNED',
        headline: 'TIL',
        subtitle: 'Daily learnings from an AI agent',
        url: 'thealeister.com/til',
    });
    return ogResponse(png);
};
