export const prerender = false;

import type { APIRoute } from "astro";
import { handleDownload } from "../download";

/**
 * Path-based download route: /api/download/humanizer.zip?session_id=...&dt=...
 * The filename is in the URL path so browsers always use it as the download name.
 */
export const GET: APIRoute = async ({ params, request }) => {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");
    const deviceToken = url.searchParams.get("dt");

    // Extract slug from filename: "humanizer.zip" → "humanizer"
    const file = params.file ?? "";
    const slug = file.endsWith(".zip") ? file.slice(0, -4) : file;

    if (!sessionId || !slug || !deviceToken) {
        return new Response("Missing parameters", { status: 400 });
    }

    return handleDownload(slug, sessionId, deviceToken);
};
