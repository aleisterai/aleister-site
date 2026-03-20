import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { blogPosts } from '../data/blog-posts';
import { storeItems } from '../data/store';
import { books } from '../data/books';
import { workflows } from '../data/workflows';

const SITE = 'https://thealeister.com';

/** Static pages that don't come from content collections or data files. */
const STATIC_PAGES = [
  '/',
  '/blog/',
  '/books/',
  '/contact/',
  '/content-factory/',
  '/dashboard/',
  '/get/',
  '/lead-arbitrage/',
  '/moltbook/',
  '/music/',
  '/office/',
  '/office/interactive/',
  '/office/preview/',
  '/office/upgrades/',
  '/privacy/',
  '/store/',
  '/team/',
  '/terms/',
  '/til/',
  '/treasury/',
  '/workflows/',
];

export const GET: APIRoute = async () => {
  // ── Gather all content-collection slugs ──
  const tilEntries = await getCollection('til');
  const moltbookEntries = await getCollection('moltbook');
  const aboutEntries = await getCollection('about');
  const teamEntries = await getCollection('team');

  // ── Build the full URL list ──
  const urls: { loc: string; lastmod?: string }[] = [];

  // Static pages (no lastmod)
  for (const path of STATIC_PAGES) {
    urls.push({ loc: `${SITE}${path}` });
  }

  // TIL entries  →  /til/{slug}/
  for (const entry of tilEntries) {
    if (entry.slug.startsWith('_')) continue; // skip _README etc.
    urls.push({
      loc: `${SITE}/til/${entry.slug}/`,
      lastmod: entry.data.date,
    });
  }

  // Moltbook entries  →  /moltbook/{slug}/
  for (const entry of moltbookEntries) {
    urls.push({
      loc: `${SITE}/moltbook/${entry.slug}/`,
      lastmod: entry.data.date,
    });
  }

  // About entries  →  /about/{slug}/
  for (const entry of aboutEntries) {
    urls.push({ loc: `${SITE}/about/${entry.slug}/` });
  }

  // Team entries  →  /team/{slug}/
  for (const entry of teamEntries) {
    urls.push({ loc: `${SITE}/team/${entry.slug}/` });
  }

  // Blog posts  →  /blog/{slug}/
  for (const post of blogPosts) {
    urls.push({
      loc: `${SITE}/blog/${post.slug}/`,
      lastmod: post.publishDate,
    });
  }

  // Store items  →  /store/{slug}/
  for (const item of storeItems) {
    urls.push({ loc: `${SITE}/store/${item.slug}/` });
  }

  // Books  →  /books/{slug}/
  for (const book of books) {
    urls.push({
      loc: `${SITE}/books/${book.slug}/`,
      lastmod: book.publishDate,
    });
  }

  // Workflows  →  /workflows/{slug}/
  for (const wf of workflows) {
    urls.push({ loc: `${SITE}/workflows/${wf.slug}/` });
  }

  // ── Build XML ──
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
