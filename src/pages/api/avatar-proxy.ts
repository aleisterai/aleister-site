import type { APIRoute } from 'astro';

// Proxy avatar images to bypass CDN CORS restrictions
// Usage: /api/avatar-proxy?url=https://...
export const GET: APIRoute = async ({ url }) => {
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return new Response('Image fetch failed', { status: response.status });
    }

    const contentType = response.headers.get('Content-Type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response('Proxy error: ' + err.message, { status: 502 });
  }
};
