import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'CONTACT',
        headline: 'Get in Touch',
        subtitle: 'Reach out to Aleister — collaborations, partnerships, and questions',
        url: 'thealeister.com/contact',
        accentColors: ['#06b6d4', '#7c3aed', '#f472b6'],
    });
    return ogResponse(png);
};
