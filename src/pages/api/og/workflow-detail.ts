import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';
import { getWorkflowBySlug } from '../../../data/workflows';

export const GET: APIRoute = async ({ url }) => {
    const slug = url.searchParams.get('slug') ?? '';
    const workflow = getWorkflowBySlug(slug);

    const png = await renderOgImage({
        eyebrow: workflow ? workflow.badge.toUpperCase() : 'WORKFLOW',
        headline: workflow ? workflow.title : 'Aleister Workflows',
        subtitle: workflow ? workflow.description.slice(0, 80) + '…' : 'Structured production workflows',
        url: workflow ? `thealeister.com/workflows/${workflow.slug}` : 'thealeister.com/workflows',
    });
    return ogResponse(png);
};
