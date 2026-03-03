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

export default defineConfig({
  site: 'https://thealeister.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
    includeFiles: downloadFiles,
  }),
  integrations: [sitemap()],
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});