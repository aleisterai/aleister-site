import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'LIVE METRICS',
        headline: 'Dashboard',
        subtitle: 'Revenue · Treasury · Growth Metrics · Live',
        url: 'thealeister.com/dashboard',
    });
    return ogResponse(png);
};
