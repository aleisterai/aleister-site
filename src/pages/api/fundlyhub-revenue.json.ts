export const prerender = false;

import type { APIRoute } from 'astro';

const STRIPE_API = 'https://api.stripe.com/v1';

function fundlyhubAuth(): string {
    const key = import.meta.env.FUNDLYHUB_STRIPE_KEY;
    return `Basic ${Buffer.from(key + ':').toString('base64')}`;
}

export const GET: APIRoute = async () => {
    try {
        const key = import.meta.env.FUNDLYHUB_STRIPE_KEY;
        if (!key) {
            throw new Error('FUNDLYHUB_STRIPE_KEY not configured');
        }

        const headers = { Authorization: fundlyhubAuth() };

        // Fetch balance + recent charges (30d) + all-time charges
        const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 86400;

        const [balanceRes, chargesRes, allChargesRes] = await Promise.all([
            fetch(`${STRIPE_API}/balance`, { headers, signal: AbortSignal.timeout(8000) }),
            fetch(`${STRIPE_API}/charges?limit=100&created[gte]=${thirtyDaysAgo}`, {
                headers,
                signal: AbortSignal.timeout(8000),
            }),
            fetch(`${STRIPE_API}/charges?limit=100`, {
                headers,
                signal: AbortSignal.timeout(8000),
            }),
        ]);

        if (!balanceRes.ok || !chargesRes.ok || !allChargesRes.ok) {
            throw new Error(
                `Stripe API error: balance=${balanceRes.status} charges=${chargesRes.status} all=${allChargesRes.status}`
            );
        }

        const [balance, charges, allCharges] = await Promise.all([
            balanceRes.json(),
            chargesRes.json(),
            allChargesRes.json(),
        ]);

        // Available + pending balance
        const available =
            (balance.available || []).reduce(
                (sum: number, b: any) => sum + (b.amount || 0),
                0
            ) / 100;
        const pending =
            (balance.pending || []).reduce(
                (sum: number, b: any) => sum + (b.amount || 0),
                0
            ) / 100;

        // 30d successful charges
        const successfulCharges30d = (charges.data || []).filter(
            (c: any) => c.status === 'succeeded' && !c.refunded
        );
        const revenue30d =
            successfulCharges30d.reduce(
                (sum: number, c: any) => sum + (c.amount || 0),
                0
            ) / 100;

        // All-time successful charges (from the last 100)
        const allSuccessful = (allCharges.data || []).filter(
            (c: any) => c.status === 'succeeded' && !c.refunded
        );
        const totalRevenue =
            allSuccessful.reduce(
                (sum: number, c: any) => sum + (c.amount || 0),
                0
            ) / 100;

        return new Response(
            JSON.stringify({
                success: true,
                totalRevenue,
                revenue30d,
                chargeCount30d: successfulCharges30d.length,
                balance: {
                    available,
                    pending,
                    total: available + pending,
                },
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300', // 5 min cache
                },
            }
        );
    } catch (error) {
        console.error('FundlyHub revenue error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                totalRevenue: 0,
                revenue30d: 0,
                chargeCount30d: 0,
                balance: { available: 0, pending: 0, total: 0 },
                timestamp: new Date().toISOString(),
                error: 'Failed to fetch FundlyHub data',
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
