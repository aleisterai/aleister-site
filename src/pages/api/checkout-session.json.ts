export const prerender = false;

import type { APIRoute } from 'astro';

const STRIPE_API = 'https://api.stripe.com/v1';

function stripeAuth(): string {
    const key = import.meta.env.STRIPE_SECRET_KEY;
    return `Basic ${Buffer.from(key + ':').toString('base64')}`;
}

/**
 * GET /api/checkout-session.json?session_id=cs_xxx
 *
 * Retrieves a completed Stripe Checkout Session so we can display
 * thank-you / receipt information to the contributor.
 */
export const GET: APIRoute = async ({ url }) => {
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId || !sessionId.startsWith('cs_')) {
        return new Response(JSON.stringify({ error: 'Invalid session_id' }), { status: 400 });
    }

    try {
        const res = await fetch(
            `${STRIPE_API}/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items&expand[]=payment_intent&expand[]=payment_intent.latest_charge`,
            {
                headers: { Authorization: stripeAuth() },
            }
        );

        const session = await res.json();

        if (!res.ok) {
            console.error('Stripe session retrieval error:', session);
            return new Response(JSON.stringify({ error: 'Session not found' }), { status: 404 });
        }

        // Only expose safe data to the client
        const lineItem = session.line_items?.data?.[0];
        const pi = session.payment_intent;
        // Newer Stripe: latest_charge is an object when expanded
        const latestCharge = pi?.latest_charge;
        const legacyCharge = pi?.charges?.data?.[0];
        const receiptUrl = latestCharge?.receipt_url || legacyCharge?.receipt_url || null;

        return new Response(JSON.stringify({
            success: true,
            email: session.customer_details?.email || null,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency?.toUpperCase() || 'USD',
            status: session.payment_status,
            itemName: lineItem?.description || 'Office Upgrade Contribution',
            receiptUrl,
            createdAt: session.created ? new Date(session.created * 1000).toISOString() : null,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Session retrieval error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
};
