import type { APIRoute } from 'astro';

/**
 * IDE Usage API
 *
 * Returns token consumption from IDE-based coding assistants.
 * Tracks cumulative usage across coding sessions.
 *
 * In future, this could be backed by a database or external API.
 * Currently reads from an environment-configurable baseline.
 */

const IDE_TOKENS_TOTAL = parseInt(
    import.meta.env.IDE_TOKENS_TOTAL || process.env.IDE_TOKENS_TOTAL || '10100000',
    10
);

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({
        success: true,
        usage: {
            totalTokens: IDE_TOKENS_TOTAL,
            label: 'IDE Tokens',
            source: 'ide-assistant',
        },
        timestamp: new Date().toISOString(),
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300',
        },
    });
};
