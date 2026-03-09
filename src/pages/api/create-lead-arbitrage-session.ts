export const prerender = false;

import type { APIRoute } from 'astro';

const STRIPE_API = 'https://api.stripe.com/v1';

function stripeAuth(): string {
    const key = import.meta.env.STRIPE_SECRET_KEY;
    return `Basic ${Buffer.from(key + ':').toString('base64')}`;
}

/** Tier definitions for Lead Arbitrage subscriptions. */
const TIERS: Record<string, {
    name: string;
    description: string;
    amountCents: number;
}> = {
    'warm-transfer': {
        name: 'Lead Arbitrage — Warm Transfer',
        description: 'AI-generated traffic & warm transfer to any business channel.',
        amountCents: 6900,
    },
    'hot-leads': {
        name: 'Lead Arbitrage — Hot Leads',
        description: 'Pre-qualified, ready-to-book clients only.',
        amountCents: 22900,
    },
    'full-booking': {
        name: 'Lead Arbitrage — Full Booking',
        description: 'End-to-end booking & payment management with booking system integration.',
        amountCents: 59900,
    },
    'full-service': {
        name: 'Lead Arbitrage — Full Service',
        description: 'Everything + social media content creation & engagement management.',
        amountCents: 99900,
    },
};

/**
 * POST /api/create-lead-arbitrage-session
 *
 * Creates a Stripe Checkout Session in subscription mode for Lead Arbitrage.
 *
 * Body: { tier: 'warm-transfer' | 'hot-leads' | 'full-booking' | 'full-service' }
 */
export const POST: APIRoute = async ({ request }) => {
    const body = await request.json().catch(() => null);
    if (!body?.tier) {
        return new Response(JSON.stringify({ error: 'Missing tier' }), { status: 400 });
    }

    const tier = TIERS[body.tier];
    if (!tier) {
        return new Response(
            JSON.stringify({ error: 'Invalid tier. Valid tiers: warm-transfer, hot-leads, full-booking, full-service' }),
            { status: 400 },
        );
    }

    // Build origin — Vercel SSR resolves to localhost internally, use headers
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'thealeister.com';
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    try {
        const params = new URLSearchParams();
        params.append('mode', 'subscription');
        params.append('success_url', `${origin}/lead-arbitrage?success=1&session_id={CHECKOUT_SESSION_ID}`);
        params.append('cancel_url', `${origin}/lead-arbitrage?cancelled=1`);
        params.append('customer_creation', 'if_required');

        // Inline price_data with monthly recurring
        params.append('line_items[0][price_data][currency]', 'usd');
        params.append('line_items[0][price_data][product_data][name]', tier.name);
        params.append('line_items[0][price_data][product_data][description]', tier.description);
        params.append('line_items[0][price_data][unit_amount]', String(tier.amountCents));
        params.append('line_items[0][price_data][recurring][interval]', 'month');
        params.append('line_items[0][quantity]', '1');

        // Pre-fill customer email if provided
        if (body.email) {
            params.append('customer_email', body.email);
        }

        // Metadata for tracking
        params.append('subscription_data[metadata][product]', 'lead-arbitrage');
        params.append('subscription_data[metadata][tier]', body.tier);
        if (body.name) params.append('subscription_data[metadata][customer_name]', body.name);
        if (body.business) params.append('subscription_data[metadata][business_name]', body.business);
        if (body.info) params.append('subscription_data[metadata][business_info]', body.info.substring(0, 500));

        const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
            method: 'POST',
            headers: {
                Authorization: stripeAuth(),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        const session = await res.json();

        if (!res.ok) {
            console.error('Stripe session error:', session);
            return new Response(JSON.stringify({ error: 'Failed to create checkout session' }), { status: 500 });
        }

        return new Response(JSON.stringify({
            url: session.url,
            sessionId: session.id,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Lead Arbitrage checkout error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
};
