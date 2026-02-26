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

export const collections = { til };
