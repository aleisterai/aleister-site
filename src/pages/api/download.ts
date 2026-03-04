export const prerender = false;

import type { APIRoute } from "astro";

/**
 * Legacy download endpoint — redirects to the new path-based URL
 * so the browser sees a .zip filename in the URL.
 * Old: /api/download?slug=humanizer&session_id=...&dt=...
 * New: /api/download/humanizer.zip?session_id=...&dt=...
 */
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const sessionId = url.searchParams.get("session_id");
  const dt = url.searchParams.get("dt");

  if (!slug || !sessionId || !dt) {
    return new Response("Missing parameters", { status: 400 });
  }

  const newUrl = new URL(`/api/download/${slug}.zip`, url.origin);
  newUrl.searchParams.set("session_id", sessionId);
  newUrl.searchParams.set("dt", dt);

  return Response.redirect(newUrl.toString(), 302);
};
