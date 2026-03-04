import type { APIRoute } from 'astro';

const STRIPE_API = 'https://api.stripe.com/v1';

function stripeAuth(): string {
    const key = import.meta.env.STRIPE_SECRET_KEY;
    return `Basic ${Buffer.from(key + ':').toString('base64')}`;
}

export const GET: APIRoute = async () => {
    try {
        const headers = { Authorization: stripeAuth() };

        // Fetch in parallel: balance, recent charges (last 30 days), all charges for total
        const [balanceRes, chargesRes] = await Promise.all([
            fetch(`${STRIPE_API}/balance`, { headers }),
            fetch(`${STRIPE_API}/charges?limit=100&created[gte]=${Math.floor(Date.now() / 1000) - 30 * 86400}`, { headers }),
        ]);

        const [balance, charges] = await Promise.all([
            balanceRes.json(),
            chargesRes.json(),
        ]);

        // Available + pending balance
        const available = (balance.available || []).reduce(
            (sum: number, b: any) => sum + (b.amount || 0), 0
        ) / 100;
        const pending = (balance.pending || []).reduce(
            (sum: number, b: any) => sum + (b.amount || 0), 0
        ) / 100;

        // Process charges for recent transactions
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
            timestamp: new Date().toISOString(),
            error: 'Failed to fetch Stripe data',
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
