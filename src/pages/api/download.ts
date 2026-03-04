export const prerender = false;

import type { APIRoute } from "astro";

const VALID_SLUGS = [
  "aleister-persona",
  "humanizer", "coding-loops", "tmux-coding-sessions",
  "onchain-treasury", "build-in-public", "daily-briefing", "stripe-revenue-tracker",
  "cipher", "sage", "quill", "rally", "echo", "pixel", "forge", "prism", "lyra",
];

/** Construct Blob URL and auth for private store */
function getBlobConfig(slug: string): { url: string; token: string } {
  const baseUrl = import.meta.env.BLOB_STORE_BASE_URL;
  const token = import.meta.env.BLOB_READ_WRITE_TOKEN;
  if (!baseUrl) throw new Error("BLOB_STORE_BASE_URL not configured");
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN not configured");
  return { url: `${baseUrl}/downloads/${slug}.zip`, token };
}

async function verifySessionAndDevice(
  sessionId: string,
  deviceToken: string
): Promise<{ ok: boolean; reason?: string }> {
  const key = import.meta.env.STRIPE_SECRET_KEY;
  const auth = `Basic ${Buffer.from(key + ":").toString("base64")}`;

  const sessionRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
    { headers: { Authorization: auth } }
  );
  if (!sessionRes.ok) return { ok: false, reason: "invalid session" };
  const session = await sessionRes.json();
  if (session.status !== "complete") return { ok: false, reason: "payment incomplete" };

  const piId = session.payment_intent;
  if (!piId) return { ok: true };

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

/**
 * Shared download handler — serves the zip from Vercel Blob with proper headers.
 * Used by both the legacy query-param route and the new path-based route.
 */
export async function handleDownload(slug: string, sessionId: string, deviceToken: string): Promise<Response> {
  if (!VALID_SLUGS.includes(slug)) {
    return new Response("Invalid product", { status: 400 });
  }

  const { ok, reason } = await verifySessionAndDevice(sessionId, deviceToken);
  if (!ok) {
    return new Response(reason ?? "Not authorized", { status: 403 });
  }

  try {
    const { url: blobUrl, token } = getBlobConfig(slug);
    const blobRes = await fetch(blobUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error(`Download error for ${slug}:`, err);
    return new Response("Download service unavailable", { status: 503 });
  }
}

/**
 * Legacy endpoint: /api/download?slug=humanizer&session_id=...&dt=...
 * Serves the file directly (no redirect — Chrome generates UUID filenames on 302).
 */
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const sessionId = url.searchParams.get("session_id");
  const deviceToken = url.searchParams.get("dt");

  if (!slug || !sessionId || !deviceToken) {
    return new Response("Missing parameters", { status: 400 });
  }

  return handleDownload(slug, sessionId, deviceToken);
};
