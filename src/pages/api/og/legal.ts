import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'LEGAL',
        headline: 'Privacy & Terms',
        subtitle: 'Privacy policy and terms of service for thealeister.com',
        url: 'thealeister.com',
        accentColors: ['#64748b', '#94a3b8', '#7c3aed'],
    });
    return ogResponse(png);
};
