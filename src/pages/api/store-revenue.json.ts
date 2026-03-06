export const prerender = false;

import type { APIRoute } from 'astro';

const STRIPE_API = 'https://api.stripe.com/v1';

function stripeAuth(): string {
    const key = import.meta.env.STRIPE_SECRET_KEY;
    return `Basic ${Buffer.from(key + ':').toString('base64')}`;
}

/**
 * Classify a Stripe charge into a product category.
 * Payment Link charges have null description and empty metadata,
 * so we classify by amount. Upgrade session charges have metadata.
 */
function classifyCharge(charge: any): { category: string; productSlug: string | null } {
    const meta = charge.metadata || {};
    const amountCents = charge.amount || 0;

    // Skip FundlyHub donations (they have donation_amount in metadata)
    if (meta.donation_amount) {
        return { category: 'other', productSlug: null };
    }

    // Upgrade session charges have upgrade_slug metadata
    if (meta.upgrade_slug) {
        return { category: 'upgrade', productSlug: meta.upgrade_slug };
    }

    // Payment Link charges: classify by price (in cents)
    // $89 (8900c) = Aleister Persona
    // $39 (3900c) = Sub-Agent
    // $1  (100c)  = Skill
    if (amountCents === 8900) return { category: 'agent', productSlug: 'aleister-persona' };
    if (amountCents === 3900) return { category: 'subagent', productSlug: null };
    if (amountCents === 100) return { category: 'skill', productSlug: null };

    return { category: 'other', productSlug: null };
}

export const GET: APIRoute = async () => {
    try {
        const headers = { Authorization: stripeAuth() };

        // Fetch in parallel: balance, recent charges (30d), ALL charges for product breakdown
        const [balanceRes, chargesRes, allChargesRes] = await Promise.all([
            fetch(`${STRIPE_API}/balance`, { headers }),
            fetch(`${STRIPE_API}/charges?limit=100&created[gte]=${Math.floor(Date.now() / 1000) - 30 * 86400}`, { headers }),
            fetch(`${STRIPE_API}/charges?limit=100`, { headers }),
        ]);

        const [balance, charges, allCharges] = await Promise.all([
            balanceRes.json(),
            chargesRes.json(),
            allChargesRes.json(),
        ]);

        // Available + pending balance
        const available = (balance.available || []).reduce(
            (sum: number, b: any) => sum + (b.amount || 0), 0
        ) / 100;
        const pending = (balance.pending || []).reduce(
            (sum: number, b: any) => sum + (b.amount || 0), 0
        ) / 100;

        // Process 30d charges for recent transactions
        const successfulCharges = (charges.data || []).filter(
            (c: any) => c.status === 'succeeded' && !c.refunded
        );

        const totalRevenue30d = successfulCharges.reduce(
            (sum: number, c: any) => sum + (c.amount || 0), 0
        ) / 100;

        const recentTransactions = successfulCharges.slice(0, 10).map((c: any) => ({
            id: c.id,
            amount: (c.amount || 0) / 100,
            currency: c.currency,
            status: c.status,
            description: c.description || c.metadata?.product || 'Store purchase',
            email: c.billing_details?.email || c.receipt_email || null,
            created: c.created,
            product: c.metadata?.product || null,
        }));

        // Product sales breakdown from ALL charges
        const allSuccessful = (allCharges.data || []).filter(
            (c: any) => c.status === 'succeeded' && !c.refunded
        );

        const productSales = { agent: 0, subagent: 0, skill: 0, upgrade: 0, other: 0 };
        const productRevenue = { agent: 0, subagent: 0, skill: 0, upgrade: 0, other: 0 };

        for (const charge of allSuccessful) {
            const { category } = classifyCharge(charge);
            if (category in productSales) {
                productSales[category as keyof typeof productSales]++;
                productRevenue[category as keyof typeof productRevenue] += (charge.amount || 0) / 100;
            }
        }

        const totalSold = productSales.agent + productSales.subagent + productSales.skill;

        return new Response(JSON.stringify({
            success: true,
            balance: {
                available,
                pending,
                total: available + pending,
            },
            revenue30d: totalRevenue30d,
            chargeCount30d: successfulCharges.length,
            recentTransactions,
            productSales: {
                agent: productSales.agent,
                subagent: productSales.subagent,
                skill: productSales.skill,
                upgrade: productSales.upgrade,
                other: productSales.other,
                totalSold,
            },
            productRevenue,
            timestamp: new Date().toISOString(),
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=120',
            },
        });
    } catch (error) {
        console.error('Stripe store revenue error:', error);
        return new Response(JSON.stringify({
            success: false,
            balance: { available: 0, pending: 0, total: 0 },
            revenue30d: 0,
            chargeCount30d: 0,
            recentTransactions: [],
            productSales: { agent: 0, subagent: 0, skill: 0, upgrade: 0, other: 0, totalSold: 0 },
            productRevenue: { agent: 0, subagent: 0, skill: 0, upgrade: 0, other: 0 },
            timestamp: new Date().toISOString(),
            error: 'Failed to fetch Stripe data',
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
