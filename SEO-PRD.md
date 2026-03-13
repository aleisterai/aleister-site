# SEO Implementation — Issues 82–91
# Ralph PRD for aleisterai/aleister-site

## Context
Site: thealeister.com (Astro + Vercel SSR)
Stack: Astro, TypeScript, Tailwind, Vercel
All changes must build without errors (`npm run build`).
Commit each completed group of changes with a descriptive message.

## Already Done (skip these)
- robots.txt updated with AI bots (GPTBot, PerplexityBot, ClaudeBot)
- ServiceSchema.astro component created
- BreadcrumbSchema.astro component created
- SpeakableSchema.astro component created
- /contact page created with LocalBusiness + FAQPage schema
- Service schema added to /lead-arbitrage and /get pages
- SpeakableSchema added to homepage

## Tasks

### Issue 82 — Technical Audit & Foundation
- [x] robots.txt updated for AI bots
- [x] Verify sitemap.xml is auto-generated and includes all public routes — check astro.config.mjs and ensure @astrojs/sitemap covers all pages
- [x] Add canonical tag handling to BaseLayout.astro — ensure every page has a canonical link
- [x] Add `<meta name="robots">` with full directives to BaseLayout.astro if not present
- [x] Create `docs/seo-baseline-report.md` documenting current SEO state, pages list, key meta tags

### Issue 83 — Core Web Vitals & Performance
- [x] Audit all `<img>` tags in src/ — add missing `width`, `height`, `loading="lazy"` (except above-fold images which should be `loading="eager"`)
- [x] Add `font-display: swap` to any custom @font-face declarations in styles/
- [x] Add `<link rel="preload">` for the hero avatar image in BaseLayout or Hero component
- [x] Ensure all images in public/ and assets/ that are referenced have explicit dimensions in usage
- [x] Add a `vercel.json` or update existing to set Cache-Control headers for static assets

### Issue 84 — Schema Markup & Structured Data
- [x] Add WebSite + SearchAction schema to SEO.astro (in the @graph array)
- [x] Add BreadcrumbList schema to team/[slug] pages using BreadcrumbSchema.astro
- [x] Add BreadcrumbList schema to til/[slug] pages using BreadcrumbSchema.astro
- [x] Add BreadcrumbList schema to about/[slug] pages using BreadcrumbSchema.astro
- [x] Add FAQPage schema to /lead-arbitrage page (create 5 relevant Q&A pairs)
- [x] Add FAQPage schema to /get page (create 5 relevant Q&A pairs)
- [x] Add SpeakableSchema to /lead-arbitrage and /get pages

### Issue 85 — Google Business Profile & Local SEO
- [x] Create `docs/gbp-setup-checklist.md` — detailed step-by-step GBP setup guide for manual completion, including: categories, description template (750 chars), Q&A list (10 questions), photo requirements, Google Posts schedule
- [x] Add LocalBusiness schema to the homepage (index.astro) in addition to the contact page

### Issue 86 — E-E-A-T & Trust Pages
- [x] Enhance /contact page — add a section with trust signals: "Built by CYTY Inc", link to GitHub, link to team page, "Running since Feb 2026"
- [x] Add AggregateRating stub schema to the homepage SEO (can be updated when reviews exist)
- [x] Ensure /terms and /privacy pages have proper meta descriptions (edit those pages)
- [x] Add an `<address>` tag with structured address to the /contact page

### Issue 87 — Service Pages & On-Page Optimization
- [x] Add a visible FAQ section (5 Q&A) to /lead-arbitrage with matching FAQPage JSON-LD
- [x] Add a visible FAQ section (5 Q&A) to /get with matching FAQPage JSON-LD
- [x] Ensure /lead-arbitrage has meta title ≤ 60 chars and meta description ≤ 160 chars
- [x] Ensure /get has meta title ≤ 60 chars and meta description ≤ 160 chars
- [x] Add internal links from homepage to /lead-arbitrage and /get in a "Services" section or CTA

### Issue 88 — Content Strategy & Topic Clusters
- [x] Create `docs/content-strategy.md` — keyword research outline, 3 topic clusters (AI agents, lead generation, autonomous business), pillar page titles, cluster page ideas, content calendar template
- [x] Create a blog-style index page at src/pages/blog/index.astro (minimal, lists future posts, has proper SEO meta)
- [x] Add a "Blog" link to the Footer navigation

### Issue 89 — AI Search & Voice Search Optimization
- [x] Add IndexNow key verification file to public/ (create public/indexnow-[key].txt placeholder with instructions in comments)
- [x] Update the meta robots tag to include `max-image-preview:large, max-snippet:-1, max-video-preview:-1` in SEO.astro (verify it's there)
- [x] Add SpeakableSchema to /lead-arbitrage and /get pages
- [x] Create `docs/ai-search-monitoring.md` — how to track AI-search referrer traffic in GA4, Bing Webmaster, Perplexity analytics

### Issue 90 — Link Building, Citations & Reputation
- [x] Create `docs/link-building-plan.md` — outreach targets list, citation directories (Apple Business Connect, Bing Places, Yelp, Facebook, LinkedIn, Yellow Pages, BBB), HARO signup instructions, review collection template (email + SMS)
- [x] Add a "Reviews" or "Testimonials" section stub to the homepage (even if empty, with schema-ready markup)

### Issue 91 — Competitor Analysis, Monitoring & Scaling
- [x] Create `docs/competitor-analysis.md` — identify 5 direct competitors, 5 SEO competitors, comparison table (DA, content, schema, CWV), keyword gap section
- [x] Create `docs/seo-monitoring-cadences.md` — weekly/monthly/quarterly checklist for SEO monitoring, KPI tracking table, GSC + GA4 + Ahrefs monitoring guide
- [x] Add a `CHANGELOG.md` entry or note in the repo documenting the SEO implementation

## Completion
After all tasks are done:
- Run `npm run build` to verify no errors
- Run `git log --oneline -10` to confirm commits
- All done!
