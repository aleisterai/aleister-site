// @ts-check
import { defineConfig, defineCollection, z } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

const moltbookCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
  }),
});

export default defineConfig({
  site: 'https://thealeister.com',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [sitemap()],
  collections: {
    moltbook: moltbookCollection,
  },
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});