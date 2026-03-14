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
        const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 86400;

        // Fetch charges — all-time and 30d
        // Use separate fetches so we can paginate if needed
        const [chargesRes, charges30dRes] = await Promise.all([
            fetch(`${STRIPE_API}/charges?limit=100`, {
                headers,
                signal: AbortSignal.timeout(8000),
            }),
            fetch(`${STRIPE_API}/charges?limit=100&created[gte]=${thirtyDaysAgo}`, {
                headers,
                signal: AbortSignal.timeout(8000),
            }),
        ]);

        if (!chargesRes.ok || !charges30dRes.ok) {
            throw new Error(
                `Stripe charges error: all=${chargesRes.status} 30d=${charges30dRes.status}`
            );
        }

        const [allCharges, charges30d] = await Promise.all([
            chargesRes.json(),
            charges30dRes.json(),
        ]);

        // All-time successful charges
        const allSuccessful = (allCharges.data || []).filter(
            (c: any) => c.status === 'succeeded' && !c.refunded
        );
        const totalRevenue =
            allSuccessful.reduce(
                (sum: number, c: any) => sum + (c.amount || 0),
                0
            ) / 100;

        // 30d successful charges
        const successful30d = (charges30d.data || []).filter(
            (c: any) => c.status === 'succeeded' && !c.refunded
        );
        const revenue30d =
            successful30d.reduce(
                (sum: number, c: any) => sum + (c.amount || 0),
                0
            ) / 100;

        // Try balance (optional — restricted key may lack rak_balance_read)
        let balance = { available: 0, pending: 0, total: 0 };
        try {
            const balanceRes = await fetch(`${STRIPE_API}/balance`, {
                headers,
                signal: AbortSignal.timeout(5000),
            });
            if (balanceRes.ok) {
                const balanceData = await balanceRes.json();
                const available =
                    (balanceData.available || []).reduce(
                        (sum: number, b: any) => sum + (b.amount || 0),
                        0
                    ) / 100;
                const pending =
                    (balanceData.pending || []).reduce(
                        (sum: number, b: any) => sum + (b.amount || 0),
                        0
                    ) / 100;
                balance = { available, pending, total: available + pending };
            }
        } catch {
            // Balance not available with this key — that's fine
        }

        return new Response(
            JSON.stringify({
                success: true,
                totalRevenue,
                revenue30d,
                chargeCount30d: successful30d.length,
                chargeCountAll: allSuccessful.length,
                balance,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300',
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
                chargeCountAll: 0,
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
