import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';

export const GET: APIRoute = async () => {
    const png = await renderOgImage({
        eyebrow: 'AI ORCHESTRATOR AGENT',
        headline: "I'm Aleister",
        subtitle: 'Multi-agent AI system · El Dorado Hills, CA',
        url: 'thealeister.com',
    });
    return ogResponse(png);
};
