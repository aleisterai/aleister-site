export const prerender = false;

import type { APIRoute } from "astro";
import { randomUUID } from "node:crypto";

const STRIPE_API = "https://api.stripe.com/v1";

function stripeAuth() {
    const key = import.meta.env.STRIPE_SECRET_KEY;
    return `Basic ${Buffer.from(key + ":").toString("base64")}`;
}

async function getSession(sessionId: string) {
    const res = await fetch(`${STRIPE_API}/checkout/sessions/${sessionId}`, {
        headers: { Authorization: stripeAuth() },
    });
    if (!res.ok) return null;
    return res.json();
}

async function getPaymentIntent(piId: string) {
    const res = await fetch(`${STRIPE_API}/payment_intents/${piId}`, {
        headers: { Authorization: stripeAuth() },
    });
    if (!res.ok) return null;
    return res.json();
}

async function setPaymentIntentToken(piId: string, token: string) {
    const body = new URLSearchParams({ "metadata[download_device]": token });
    await fetch(`${STRIPE_API}/payment_intents/${piId}`, {
        method: "POST",
        headers: {
            Authorization: stripeAuth(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });
}

export const POST: APIRoute = async ({ request }) => {
    const json = await request.json().catch(() => null);
    const sessionId: string | undefined = json?.session_id;
    const presentedToken: string | undefined = json?.device_token;

    if (!sessionId) {
        return new Response(JSON.stringify({ error: "missing session_id" }), { status: 400 });
    }

    // 1. Verify session is complete
    const session = await getSession(sessionId);
    if (!session || session.status !== "complete") {
        return new Response(JSON.stringify({ error: "invalid session" }), { status: 402 });
    }

    const piId: string | null = session.payment_intent ?? null;
    if (!piId) {
        // Free / no payment_intent — generate ephemeral token (can't store)
        const token = randomUUID();
        return new Response(JSON.stringify({ token, email: session.customer_details?.email }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    // 2. Check PaymentIntent for existing device token
    const pi = await getPaymentIntent(piId);
    const storedToken: string | undefined = pi?.metadata?.download_device;

    if (!storedToken) {
        // First use — generate and store token
        const token = randomUUID();
        await setPaymentIntentToken(piId, token);
        return new Response(
            JSON.stringify({ token, email: session.customer_details?.email }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }

    // Token already bound to a device
    if (presentedToken && presentedToken === storedToken) {
        // Same device returning — re-issue (allows re-download on same device)
        return new Response(
            JSON.stringify({ token: storedToken, email: session.customer_details?.email }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }

    // Email-based recovery: buyer presents the purchase email
    const emailProof: string | undefined = json?.email;
    const purchaseEmail: string | undefined = session.customer_details?.email;
    if (emailProof && purchaseEmail && emailProof.toLowerCase() === purchaseEmail.toLowerCase()) {
        // Re-bind: generate new token, overwrite old one
        const token = randomUUID();
        await setPaymentIntentToken(piId, token);
        return new Response(
            JSON.stringify({ token, email: purchaseEmail, recovered: true }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }

    // Different device, no valid proof
    return new Response(
        JSON.stringify({
            error: "claimed",
            message: "This download has already been claimed on another device. Enter your purchase email below to re-link.",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
    );
};
