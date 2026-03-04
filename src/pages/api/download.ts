export const prerender = false;

import type { APIRoute } from "astro";

const VALID_SLUGS = [
  "aleister-persona",
  "humanizer", "coding-loops", "tmux-coding-sessions",
  "onchain-treasury", "build-in-public", "daily-briefing", "stripe-revenue-tracker",
  "cipher", "sage", "quill", "rally", "echo", "pixel", "forge", "prism", "lyra",
];

/** Map slug → Vercel Blob URL (set via env, populated by upload script) */
function getBlobUrl(slug: string): string {
  const baseUrl = import.meta.env.BLOB_STORE_BASE_URL;
  if (!baseUrl) throw new Error("BLOB_STORE_BASE_URL not configured");
  return `${baseUrl}/downloads/${slug}.zip`;
}

async function verifySessionAndDevice(
  sessionId: string,
  deviceToken: string
): Promise<{ ok: boolean; reason?: string }> {
  const key = import.meta.env.STRIPE_SECRET_KEY;
  const auth = `Basic ${Buffer.from(key + ":").toString("base64")}`;

  // Fetch session
  const sessionRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
    { headers: { Authorization: auth } }
  );
  if (!sessionRes.ok) return { ok: false, reason: "invalid session" };
  const session = await sessionRes.json();
  if (session.status !== "complete") return { ok: false, reason: "payment incomplete" };

  // Fetch PaymentIntent for device token
  const piId = session.payment_intent;
  if (!piId) return { ok: true }; // No PI (edge case) — allow if session is complete

  const piRes = await fetch(
    `https://api.stripe.com/v1/payment_intents/${piId}`,
    { headers: { Authorization: auth } }
  );
  if (!piRes.ok) return { ok: false, reason: "could not verify device" };
  const pi = await piRes.json();

  const storedToken = pi.metadata?.download_device;
  if (!storedToken) return { ok: false, reason: "device not bound — visit the purchase page first" };
  if (storedToken !== deviceToken) return { ok: false, reason: "device mismatch — this link is not valid on this device" };

  return { ok: true };
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const slug = url.searchParams.get("slug");
  const deviceToken = url.searchParams.get("dt");

  if (!sessionId || !slug || !deviceToken) {
    return new Response("Missing parameters", { status: 400 });
  }

  if (!VALID_SLUGS.includes(slug)) {
    return new Response("Invalid product", { status: 400 });
  }

  const { ok, reason } = await verifySessionAndDevice(sessionId, deviceToken);
  if (!ok) {
    return new Response(reason ?? "Not authorized", { status: 403 });
  }

  // Fetch from Vercel Blob (private storage)
  try {
    const blobUrl = getBlobUrl(slug);
    const blobRes = await fetch(blobUrl);

    if (!blobRes.ok) {
      console.error(`Blob fetch failed for ${slug}: ${blobRes.status}`);
      return new Response("Bundle not found", { status: 404 });
    }

    const fileBuffer = await blobRes.arrayBuffer();

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}.zip"`,
        "Content-Length": String(fileBuffer.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(`Download error for ${slug}:`, err);
    return new Response("Download service unavailable", { status: 503 });
  }
};
