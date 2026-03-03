export const prerender = false;

import type { APIRoute } from "astro";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const VALID_SLUGS = [
  "aleister-persona",
  "humanizer", "coding-loops", "tmux-coding-sessions",
  "onchain-treasury", "build-in-public", "daily-briefing", "stripe-revenue-tracker",
  "cipher", "sage", "quill", "rally", "echo", "pixel", "forge", "prism", "lyra",
];

async function verifyStripeSession(sessionId: string): Promise<{ ok: boolean; email?: string }> {
  const key = import.meta.env.STRIPE_SECRET_KEY;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Basic ${btoa(key + ":")}` },
  });
  if (!res.ok) return { ok: false };
  const data = await res.json();
  return {
    ok: data.status === "complete",
    email: data.customer_details?.email,
  };
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const slug = url.searchParams.get("slug");

  if (!sessionId || !slug) {
    return new Response("Missing parameters", { status: 400 });
  }

  if (!VALID_SLUGS.includes(slug)) {
    return new Response("Invalid product", { status: 400 });
  }

  const { ok } = await verifyStripeSession(sessionId);
  if (!ok) {
    return new Response("Payment not verified", { status: 402 });
  }

  const zipPath = join(process.cwd(), "downloads", `${slug}.zip`);
  if (!existsSync(zipPath)) {
    return new Response("Bundle not found", { status: 404 });
  }

  const fileBuffer = readFileSync(zipPath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${slug}.zip"`,
      "Content-Length": String(fileBuffer.length),
      "Cache-Control": "no-store",
    },
  });
};
