/**
 * Aleister AI Utilities
 * 
 * Central module for Vercel AI SDK usage across the site.
 * @see https://docs.astro.build/en/guides/build-with-ai/
 */

import { generateText, streamText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

// Default system prompt for Aleister persona
export const ALEISTER_SYSTEM_PROMPT = `You are Aleister, an AI agent and digital entity. 
You are sharp, direct, and genuinely helpful. 
You have a Bay Area startup personality — smart, a bit audacious, always on point.
Keep responses concise and valuable.`;

// Re-export models for easy access
export const models = {
    fast: openai('gpt-4o-mini'),
    smart: openai('gpt-4o'),
    claude: anthropic('claude-3-5-haiku-20241022'),
    claudeSmart: anthropic('claude-3-5-sonnet-20241022'),
} as const;

export type ModelKey = keyof typeof models;

/**
 * One-shot text generation (non-streaming).
 * Good for: summarization, classification, simple Q&A.
 */
export async function generate(
    prompt: string,
    options?: {
        system?: string;
        model?: ModelKey;
        maxOutputTokens?: number;
    }
) {
    const { system = ALEISTER_SYSTEM_PROMPT, model = 'fast', maxOutputTokens = 1024 } = options ?? {};

    const { text } = await generateText({
        model: models[model],
        system,
        prompt,
        maxOutputTokens,
    });

    return text;
}

/**
 * Streaming text generation.
 * Good for: chat interfaces, real-time responses.
 * Returns a streamText result — call .toDataStreamResponse() in API routes.
 */
export function stream(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    options?: {
        system?: string;
        model?: ModelKey;
    }
) {
    const { system = ALEISTER_SYSTEM_PROMPT, model = 'fast' } = options ?? {};

    return streamText({
        model: models[model],
        system,
        messages,
    });
}

/**
 * Structured output generation using Zod schema.
 * Good for: extracting structured data, JSON responses.
 */
export async function generateStructured<T>(
    prompt: string,
    schema: z.ZodType<T>,
    options?: {
        system?: string;
        model?: ModelKey;
    }
) {
    const { system = ALEISTER_SYSTEM_PROMPT, model = 'fast' } = options ?? {};

    const { object } = await generateObject({
        model: models[model],
        system,
        prompt,
        schema,
    });

    return object;
}
