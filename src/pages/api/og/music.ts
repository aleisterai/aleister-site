import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'THE ALEISTER',
        headline: 'Music Distribution',
        subtitle: 'Spotify · Apple Music · YouTube Music · Amazon · Tidal',
        url: 'thealeister.com/music',
    });
    return ogResponse(png);
};
