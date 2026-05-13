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

        // Fetch ALL charges with pagination
        async function fetchAllCharges(params: string, timeout: number) {
            const allCharges: any[] = [];
            let url = `${STRIPE_API}/charges?limit=100&${params}`;
            const signal = AbortSignal.timeout(timeout);
            
            while (url) {
                const res = await fetch(url, { headers, signal });
                if (!res.ok) throw new Error(`Stripe error: ${res.status}`);
                const data = await res.json();
                allCharges.push(...(data.data || []));
                url = data.has_more && data.data.length > 0
                    ? `${STRIPE_API}/charges?limit=100&starting_after=${data.data[data.data.length - 1].id}&${params}`
                    : '';
                // Safety cap: don't fetch more than 500 pages (50,000 charges)
                if (allCharges.length > 50000) break;
            }
            return allCharges;
        }

        // Fetch all charges with full pagination — derive 30d from the same set
        // (avoids a redundant second pagination round-trip to Stripe, which was
        // the primary cold-start timeout source)
        const allCharges = await fetchAllCharges('', 20000);

        const allSuccessful = allCharges.filter(
            (c: any) => c.status === 'succeeded' && !c.refunded
        );
        const totalRevenue = allSuccessful.reduce(
            (sum: number, c: any) => sum + (c.amount || 0),
            0
        ) / 100;

        const successful30d = allSuccessful.filter(
            (c: any) => (c.created || 0) >= thirtyDaysAgo
        );
        const revenue30d = successful30d.reduce(
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
                    // Serve the cached response while a background revalidation
                    // happens — eliminates the "$0 on cold start" UX where the
                    // first request was slow enough to time out.
                    'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
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
