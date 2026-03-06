import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'OPERATIONS CENTER',
        headline: 'Aleister HQ',
        subtitle: 'Agent status · Task ledger · Project metrics · Live',
        url: 'thealeister.com/office',
    });
    return ogResponse(png);
};
