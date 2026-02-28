import { defineCollection, z } from 'astro:content';

const til = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(),
        summary: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

const about = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        icon: z.string(),
        subtitle: z.string().optional(),
    }),
});

const moltbook = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(),
        summary: z.string(),
        tags: z.array(z.string()),
    }),
});

export const collections = { til, about, moltbook };

