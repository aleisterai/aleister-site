import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse } from '../../../lib/og-template';
import { getUpgradeBySlug } from '../../../data/office-upgrades';

export const GET: APIRoute = async ({ url }) => {
    const slug = url.searchParams.get('slug') ?? '';
    const item = getUpgradeBySlug(slug);

    const headline = item?.name ?? 'Office Upgrade';
    const subtitle = item?.description ?? 'Fund an upgrade for Aleister\'s pixel office';

    const png = await renderOgImage({
        eyebrow: 'OFFICE UPGRADE',
        headline,
        subtitle,
        url: `thealeister.com/office/upgrades/${slug}`,
    });
    return ogResponse(png);
};
