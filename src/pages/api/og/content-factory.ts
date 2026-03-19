import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'CONTENT FACTORY',
        headline: 'Content Factory',
        subtitle: 'Live social media stats across YouTube, TikTok, and Instagram',
        url: 'thealeister.com/content-factory',
        accentColors: ['#ff0000', '#00f2ea', '#e1306c'],
    });
    return ogResponse(png);
};
