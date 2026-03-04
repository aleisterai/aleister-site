import type { APIRoute } from 'astro';

const PATREON_API = 'https://www.patreon.com/api/oauth2/v2';

export const GET: APIRoute = async () => {
    try {
        const accessToken = import.meta.env.PATREON_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error('PATREON_ACCESS_TOKEN not configured');
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'AleisterDashboard/1.0',
        };

        // Step 1: Get campaign ID and summary
        const campaignRes = await fetch(
            `${PATREON_API}/campaigns?fields[campaign]=patron_count,pledge_sum,creation_name,created_at`,
            { headers, signal: AbortSignal.timeout(8000) }
        );

        if (!campaignRes.ok) {
            throw new Error(`Patreon API error: ${campaignRes.status}`);
        }

        const campaignData = await campaignRes.json();
        const campaign = campaignData?.data?.[0];
        const attrs = campaign?.attributes || {};

        const patronCount = attrs.patron_count || 0;
        // pledge_sum is in cents
        const pledgeSumCents = attrs.pledge_sum || 0;
        const monthlyRevenue = pledgeSumCents / 100;

        // Step 2: Get active members with their pledge amounts
        let totalPledgeCents = 0;
        let activePatrons = 0;

        if (campaign?.id) {
            const membersRes = await fetch(
                `${PATREON_API}/campaigns/${campaign.id}/members?fields[member]=patron_status,currently_entitled_amount_cents,full_name,pledge_cadence&page[count]=100`,
                { headers, signal: AbortSignal.timeout(8000) }
            );

            if (membersRes.ok) {
                const membersData = await membersRes.json();
                const members = membersData?.data || [];

                for (const member of members) {
                    const mAttrs = member?.attributes || {};
                    if (mAttrs.patron_status === 'active_patron') {
                        activePatrons++;
                        totalPledgeCents += mAttrs.currently_entitled_amount_cents || 0;
                    }
                }
            }
        }

        // Use member-derived total if available, otherwise campaign-level
        const revenue = totalPledgeCents > 0
            ? totalPledgeCents / 100
            : monthlyRevenue;

        return new Response(JSON.stringify({
            success: true,
            monthlyRevenue: revenue,
            patronCount: activePatrons || patronCount,
            campaignName: attrs.creation_name || 'Aleister',
            timestamp: new Date().toISOString(),
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300', // 5 min cache
            },
        });
    } catch (error) {
        console.error('Patreon revenue error:', error);
        return new Response(JSON.stringify({
            success: false,
            monthlyRevenue: 4, // Known fallback: 1 patron × $4/mo
            patronCount: 1,
            campaignName: 'Aleister',
            timestamp: new Date().toISOString(),
            error: 'Failed to fetch Patreon data',
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
