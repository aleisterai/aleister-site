import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: '$ALEISTER TOKEN',
        headline: 'Treasury',
        subtitle: '$ALEISTER · Base Mainnet · On-Chain Transparency',
        url: 'thealeister.com/treasury',
    });
    return ogResponse(png);
};
