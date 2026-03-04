// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Expand downloads/ to explicit file paths so @astrojs/vercel can realpath each one.
// Using a glob string like './downloads/**/*' fails on Vercel because the adapter
// passes the string literally to fs.realpath instead of expanding it first.
const downloadsDir = join(__dirname, 'downloads');
const downloadFiles = existsSync(downloadsDir)
  ? readdirSync(downloadsDir)
    .filter((f) => f.endsWith('.zip'))
    .map((f) => `./downloads/${f}`)
  : [];

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
    includeFiles: downloadFiles,
  }),
  integrations: [sitemap({ customPages: storeCustomPages })],
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});