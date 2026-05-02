import type { APIRoute } from 'astro';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

/**
 * AI Chat API Endpoint
 * 
 * POST /api/chat
 * Body: { messages: [{role, content}], provider?: 'openai' | 'anthropic' }
 * 
 * Returns a streaming text response using the Vercel AI SDK.
 * Follows the Astro "Build with AI" guide pattern.
 * 
 * @see https://docs.astro.build/en/guides/build-with-ai/
 */

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { messages, provider = 'openai', systemPrompt } = body;

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'messages array is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Pick model based on provider preference
        const model = provider === 'anthropic'
            ? anthropic('claude-3-5-haiku-20241022')
            : openai('gpt-4o-mini');

        const result = streamText({
            model,
            system: systemPrompt || `You are Aleister, an AI agent. You are sharp, direct, and genuinely helpful.`,
            messages,
        });

        // Return a streaming response
        return result.toTextStreamResponse();
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

// Allow preflight for CORS
export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
};
