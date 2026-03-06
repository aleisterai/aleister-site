export const prerender = false;

import type { APIRoute } from 'astro';
import { getUpgradeBySlug } from '../../data/office-upgrades';

const STRIPE_API = 'https://api.stripe.com/v1';

function stripeAuth(): string {
    const key = import.meta.env.STRIPE_SECRET_KEY;
    return `Basic ${Buffer.from(key + ':').toString('base64')}`;
}

/**
 * POST /api/create-upgrade-session
 *
 * Creates a Stripe Checkout Session for an office upgrade purchase.
 *
 * Body: { slug: string, amount?: number (cents), customAmount?: number (dollars) }
 *
 * For fixed-level items: uses the next level's price.
 * For building / custom: uses the provided amount (minimum $1).
 */
export const POST: APIRoute = async ({ request }) => {
    const body = await request.json().catch(() => null);
    if (!body?.slug) {
        return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
    }

    const item = getUpgradeBySlug(body.slug);
    if (!item) {
        return new Response(JSON.stringify({ error: 'Unknown item' }), { status: 404 });
    }

    // Determine amount in cents
    let amountCents: number;
    let productName: string;

    if (body.customAmount && typeof body.customAmount === 'number') {
        // Custom amount (building contributions or any-amount donations)
        const dollars = Math.max(1, Math.floor(body.customAmount));
        amountCents = dollars * 100;
        productName = `${item.name} — $${dollars} Contribution`;
    } else if (body.levelTarget && typeof body.levelTarget === 'number') {
        // Specific level purchase
        const targetLevel = item.levels.find(l => l.level === body.levelTarget);
        if (!targetLevel) {
            return new Response(JSON.stringify({ error: 'Invalid level' }), { status: 400 });
        }
        amountCents = targetLevel.price * 100;
        productName = `${item.name} — ${targetLevel.name}`;
    } else {
        // Default: first level price
        const firstLevel = item.levels[0];
        amountCents = firstLevel.price * 100;
        productName = `${item.name} — ${firstLevel.name}`;
    }

    if (amountCents < 100) {
        return new Response(JSON.stringify({ error: 'Minimum amount is $1' }), { status: 400 });
    }

    // Build the origin for success/cancel URLs
    const origin = new URL(request.url).origin;
    const returnPath = item.slug === 'building' ? '/office/upgrades' : `/office/upgrades/${item.slug}`;

    try {
        const params = new URLSearchParams();
        params.append('mode', 'payment');
        params.append('submit_type', 'donate');
        params.append('success_url', `${origin}${returnPath}?success=1&session_id={CHECKOUT_SESSION_ID}`);
        params.append('cancel_url', `${origin}${returnPath}?cancelled=1`);
        params.append('customer_creation', 'if_required');
        params.append('invoice_creation[enabled]', 'true');
        params.append('line_items[0][price_data][currency]', 'usd');
        params.append('line_items[0][price_data][product_data][name]', productName);
        params.append('line_items[0][price_data][product_data][description]', item.description);
        params.append('line_items[0][price_data][unit_amount]', String(amountCents));
        params.append('line_items[0][quantity]', '1');
        params.append('payment_intent_data[metadata][upgrade_slug]', item.slug);
        params.append('payment_intent_data[metadata][upgrade_category]', item.category);
        params.append('payment_intent_data[metadata][upgrade_name]', productName);
        if (item.agentId) {
            params.append('payment_intent_data[metadata][agent_id]', item.agentId);
        }

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
        console.error('Checkout session error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
};
