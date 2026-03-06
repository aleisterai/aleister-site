import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'CROWDFUNDED UPGRADES',
        headline: 'Level Up the Office',
        subtitle: 'Fund desks, chairs, furniture & building upgrades — reflected live',
        url: 'thealeister.com/office/upgrades',
    });
    return ogResponse(png);
};
