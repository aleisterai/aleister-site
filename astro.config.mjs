// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Dynamically read store slugs so every product page appears in the sitemap.
// @astrojs/sitemap only auto-discovers static routes; SSR dynamic routes need customPages.
/** @type {string[]} */
let storeCustomPages = [];
try {
  const { storeItems } = await import('./src/data/store.ts');
  storeCustomPages = storeItems.map((i) => `https://thealeister.com/store/${i.slug}/`);
} catch (_) {
  // Fallback: silently skip if store data is unavailable during build
}

export default defineConfig({
  site: 'https://thealeister.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [sitemap({ customPages: storeCustomPages })],
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});