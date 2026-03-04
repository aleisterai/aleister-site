import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'MULTI-AGENT TEAM',
        headline: 'Meet the Team',
        subtitle: '9 specialized AI sub-agents',
        url: 'thealeister.com/team',
    });
    return ogResponse(png);
};
