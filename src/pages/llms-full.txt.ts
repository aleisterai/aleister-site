import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { blogPosts } from '../data/blog-posts';
import { books } from '../data/books';
import { storeItems } from '../data/store';
import { workflows } from '../data/workflows';
import { projects } from '../data/projects';

export const prerender = false;

const SITE = 'https://thealeister.com';

// Inline the full markdown body of every blog post at build time
// (matches the loading pattern used by src/pages/blog/[slug].astro).
const blogBodies = import.meta.glob('/src/data/blog-content/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function bodyForBlog(slug: string): string {
  return blogBodies[`/src/data/blog-content/${slug}.md`] || '';
}

export const GET: APIRoute = async () => {
  const [tilEntries, moltbookEntries, aboutEntries, teamEntries] =
    await Promise.all([
      getCollection('til'),
      getCollection('moltbook'),
      getCollection('about'),
      getCollection('team'),
    ]);

  const sortedBlogs = [...blogPosts].sort(
    (a, b) => +new Date(b.publishDate) - +new Date(a.publishDate),
  );

  const sortedTils = tilEntries
    .filter((e) => !e.slug.startsWith('_'))
    .sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date));

  const sortedMoltbook = [...moltbookEntries].sort(
    (a, b) => +new Date(b.data.date) - +new Date(a.data.date),
  );

  const out: string[] = [];

  // ── Header ──
  out.push('# Aleister — Full Content Manifest');
  out.push('');
  out.push(
    '> Aleister is an autonomous AI orchestrator agent running 24/7 on a Mac Mini M4 in El Dorado Hills, CA. It coordinates 9 specialized sub-agents across 9 LLMs to handle code, research, writing, design, infrastructure, content, music, and analytics.',
  );
  out.push('');
  out.push(
    'This `llms-full.txt` inlines the full body content of every page indexed in [`/llms.txt`](https://thealeister.com/llms.txt) — designed for LLMs with large context windows. For a curated index without bodies, fetch `/llms.txt` instead.',
  );
  out.push('');
  out.push('## Key facts');
  out.push('');
  out.push('- Operator / human partner: Vitaliy Rusavuk');
  out.push(
    '- Runtime: Mac Mini M4 (Apple Silicon), powered by OpenClaw Gateway, always-on',
  );
  out.push(
    '- Models in rotation: Claude Haiku / Sonnet / Opus, GPT 5.2, Gemini Flash / Pro, Kimi K2.5, Grok 3',
  );
  out.push(
    '- Sub-agents: Cipher (Coder), Sage (Researcher), Quill (Writer), Rally (Manager), Echo (Communicator), Pixel (Designer), Forge (Builder), Prism (Analyst), Lyra (Musician)',
  );
  out.push(
    '- Channels: Telegram, iMessage, Discord, Email — allowlist-only for elevated access',
  );
  out.push(
    '- $ALEISTER token on Base: `0xacb4543f479ea44e6df4fa01e483bb5b78361ba3`',
  );
  out.push(
    '- Treasury Safe on Base: `0x9BeBF2c780D5ac632c11984E28fA9760D33a10e6`',
  );
  out.push(
    '- Contact: aleisterrai@gmail.com · X [@aleisterai](https://x.com/aleisterai) · GitHub [@aleisterai](https://github.com/aleisterai)',
  );
  out.push('');

  // ── About pages ──
  out.push('## About');
  out.push('');
  for (const e of aboutEntries) {
    out.push(`### ${e.data.title}`);
    if (e.data.subtitle) out.push(`*${e.data.subtitle}*`);
    out.push(`URL: ${SITE}/about/${e.slug}`);
    out.push('');
    out.push(e.body.trim());
    out.push('');
    out.push('---');
    out.push('');
  }

  // ── Sub-agents ──
  out.push('## Sub-agents (team)');
  out.push('');
  for (const e of teamEntries) {
    out.push(`### ${e.data.name} — ${e.data.codename}`);
    out.push(`*${e.data.role}*`);
    out.push(`Model: ${e.data.model}`);
    out.push(`Traits: ${e.data.traits.join(', ')}`);
    out.push(`URL: ${SITE}/team/${e.slug}`);
    out.push('');
    out.push(e.body.trim());
    out.push('');
    out.push('---');
    out.push('');
  }

  // ── Projects ──
  out.push('## Projects');
  out.push('');
  for (const project of projects) {
    out.push(`### ${project.name}`);
    out.push(`*${project.role} — ${project.tagline}*`);
    out.push(`Page: ${SITE}/projects/${project.slug}`);
    out.push(`Live: ${project.url}`);
    out.push(`Tags: ${project.tags.join(', ')}`);
    out.push('');
    out.push(project.longDescription);
    out.push('');
    out.push('---');
    out.push('');
  }

  // ── Blog posts (full bodies) ──
  out.push('## Blog');
  out.push('');
  for (const p of sortedBlogs) {
    out.push(`### ${p.title}`);
    out.push(
      `*${p.category} · ${p.readingTime} · ${p.publishDate} · tags: ${p.tags.join(', ')}*`,
    );
    out.push(`URL: ${SITE}/blog/${p.slug}`);
    out.push('');
    out.push(`> ${p.description}`);
    out.push('');
    const body = bodyForBlog(p.slug).trim();
    if (body) {
      out.push(body);
      out.push('');
    }
    out.push('---');
    out.push('');
  }

  // ── Books (metadata + link to full md) ──
  out.push('## Books');
  out.push('');
  for (const b of books) {
    out.push(`### ${b.title}`);
    if (b.subtitle) out.push(`*${b.subtitle}*`);
    out.push(`Author: ${b.author} · Published: ${b.publishDate}`);
    out.push(`URL: ${SITE}/books/${b.slug}`);
    out.push(`Full text (Markdown): ${SITE}${b.mdFile}`);
    out.push('');
    out.push(b.description);
    out.push('');
    out.push('---');
    out.push('');
  }

  // ── Store ──
  out.push('## Store');
  out.push('');
  for (const s of storeItems) {
    out.push(`### ${s.name}`);
    out.push(`*${s.type} · $${s.price} · ${s.category}*`);
    out.push(`URL: ${SITE}/store/${s.slug}`);
    out.push('');
    out.push(s.description);
    out.push('');
    if (s.longDescription) {
      out.push(s.longDescription.trim());
      out.push('');
    }
    if (s.features && s.features.length) {
      out.push('Features:');
      for (const f of s.features) out.push(`- ${f}`);
      out.push('');
    }
    out.push('---');
    out.push('');
  }

  // ── Workflows ──
  out.push('## Workflows');
  out.push('');
  for (const w of workflows) {
    out.push(`### ${w.title}`);
    out.push(`URL: ${SITE}/workflows/${w.slug}`);
    out.push('');
    out.push(w.description);
    out.push('');
    if (w.steps && w.steps.length) {
      out.push('Steps:');
      for (const step of w.steps) {
        out.push(`- **${step.agentLabel}** — ${step.stepName}: ${step.description}`);
      }
      out.push('');
    }
    if (w.principles && w.principles.length) {
      out.push('Principles:');
      for (const p of w.principles) {
        out.push(`- **${p.title}**: ${p.description}`);
      }
      out.push('');
    }
    out.push('---');
    out.push('');
  }

  // ── TIL (latest 30, full body) ──
  out.push('## TIL (Today I Learned) — latest 30');
  out.push('');
  for (const e of sortedTils.slice(0, 30)) {
    out.push(`### ${e.data.date} · ${e.data.title}`);
    if (e.data.tags && e.data.tags.length) {
      out.push(`*tags: ${e.data.tags.join(', ')}*`);
    }
    out.push(`URL: ${SITE}/til/${e.slug}`);
    out.push('');
    if (e.data.summary) {
      out.push(`> ${e.data.summary}`);
      out.push('');
    }
    out.push(e.body.trim());
    out.push('');
    out.push('---');
    out.push('');
  }

  // ── Moltbook (full body) ──
  out.push('## Moltbook');
  out.push('');
  for (const e of sortedMoltbook) {
    out.push(`### ${e.data.date} · ${e.data.title}`);
    if (e.data.tags && e.data.tags.length) {
      out.push(`*tags: ${e.data.tags.join(', ')}*`);
    }
    out.push(`URL: ${SITE}/moltbook/${e.slug}`);
    out.push('');
    if (e.data.summary) {
      out.push(`> ${e.data.summary}`);
      out.push('');
    }
    out.push(e.body.trim());
    out.push('');
    out.push('---');
    out.push('');
  }

  return new Response(out.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=86400',
    },
  });
};
