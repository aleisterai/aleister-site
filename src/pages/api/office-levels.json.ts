import type { APIRoute } from 'astro';
import { allUpgradeItems, computeLevel } from '../../data/office-upgrades';

const STRIPE_API = 'https://api.stripe.com/v1';

function stripeAuth(): string {
    const key = import.meta.env.STRIPE_SECRET_KEY;
    return `Basic ${Buffer.from(key + ':').toString('base64')}`;
}

/**
 * GET /api/office-levels.json
 *
 * Queries Stripe charges tagged with upgrade metadata to compute
 * current level state for every office upgrade item.
 *
 * Returns per-item level, total raised, and the building goal progress.
 */
export const GET: APIRoute = async () => {
    try {
        // Fetch all successful payment intents — metadata is on the PI, not the charge
        // Stripe doesn't support filtering by metadata, so fetch recent and filter client-side.
        const params = new URLSearchParams();
        params.append('limit', '100');

        const res = await fetch(`${STRIPE_API}/payment_intents?${params}`, {
            headers: { Authorization: stripeAuth() },
        });

        const data = await res.json();
        const paymentIntents = (data.data || []) as any[];

        // Filter to only succeeded upgrade-tagged payment intents
        const upgradePayments = paymentIntents.filter(
            (pi: any) => pi.status === 'succeeded' && pi.metadata?.upgrade_slug
        );

        // Group and sum by slug
        const raised: Record<string, number> = {};
        const contributionCounts: Record<string, number> = {};
        let buildingTotal = 0;
        let buildingContributors = 0;

        for (const pi of upgradePayments) {
            const slug = pi.metadata.upgrade_slug;
            const amount = (pi.amount || 0) / 100; // cents → dollars

            raised[slug] = (raised[slug] || 0) + amount;
            contributionCounts[slug] = (contributionCounts[slug] || 0) + 1;

            if (pi.metadata.upgrade_category === 'building') {
                buildingTotal += amount;
                buildingContributors++;
            }
        }

        // Compute levels for all items
        const items: Record<string, any> = {};
        let totalRaised = 0;

        for (const item of allUpgradeItems) {
            const itemRaised = raised[item.slug] || 0;
            totalRaised += itemRaised;
            const levelState = computeLevel(item, itemRaised);

            items[item.slug] = {
                slug: item.slug,
                name: item.name,
                category: item.category,
                agentId: item.agentId || null,
                contributions: contributionCounts[item.slug] || 0,
                ...levelState,
            };
        }

        const buildingGoal = 5000;

        return new Response(JSON.stringify({
            success: true,
            items,
            building: {
                currentAmount: buildingTotal,
                goalAmount: buildingGoal,
                percentage: Math.min(100, parseFloat(((buildingTotal / buildingGoal) * 100).toFixed(2))),
                contributors: buildingContributors,
            },
            totalRaised,
            upgradeCount: upgradePayments.length,
            timestamp: new Date().toISOString(),
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=120',
            },
        });
    } catch (error) {
        console.error('Office levels error:', error);

        // Return empty state on error (no purchases yet / Stripe key missing)
        const items: Record<string, any> = {};
        for (const item of allUpgradeItems) {
            items[item.slug] = {
                slug: item.slug,
                name: item.name,
                category: item.category,
                agentId: item.agentId || null,
                currentLevel: 0,
                totalRaised: 0,
                maxLevel: item.levels.length,
                isMaxed: false,
                nextLevel: item.levels[0] || null,
                amountToNext: item.levels[0]?.price || 0,
                cumulativeSpent: 0,
            };
        }

        return new Response(JSON.stringify({
            success: false,
            items,
            building: { currentAmount: 0, goalAmount: 5000, percentage: 0, contributors: 0 },
            totalRaised: 0,
            upgradeCount: 0,
            timestamp: new Date().toISOString(),
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
