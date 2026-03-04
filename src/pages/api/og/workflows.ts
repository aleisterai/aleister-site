import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'STRUCTURED WORKFLOWS',
        headline: 'How Aleister Gets Things Done',
        subtitle: '6-Phase Feature Development Pipeline',
        url: 'thealeister.com/workflows',
    });
    return ogResponse(png);
};
