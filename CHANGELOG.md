# Changelog

## [Unreleased] — SEO Implementation

### Added

**Structured Data / Schema.org**
- `FAQPage` JSON-LD schema on `/lead-arbitrage` and `/get` pages
- `AggregateRating` stub schema on homepage
- `Service` schema on service pages
- `BreadcrumbList` schema component (site-wide)
- `LocalBusiness` + `FAQPage` schema on `/contact` page
- `SpeakableSpecification` schema on `/lead-arbitrage`, `/get`, and voice-search pages
- `MusicPlaylist` JSON-LD schema on `/music` page
- `Review` schema markup via Testimonials section stub on homepage

**Technical SEO**
- `robots.txt` updated to block AI crawlers (GPTBot, ClaudeBot, etc.)
- Web app `manifest.json` linked in `BaseLayout`
- IndexNow key verification file placeholder (`/indexnow-key.txt`)
- Open Graph images added for `/office`, `/store`, and `/music` pages
- OG image dimensions corrected to 1200×630 across store products and pages
- All store products added to sitemap
- Meta title shortened to ≤60 chars on `/lead-arbitrage`
- Meta description shortened to ≤160 chars on `/get`, `/terms`, and `/privacy`

**Content & Navigation**
- Blog index page at `/blog` with Footer link
- Services section on homepage linking to `/lead-arbitrage` and `/get`
- Contact page with structured mailing address (`<address>` tag)

**SEO Documentation** (in `/docs/seo/` or repo root)
- `content-strategy.md` — 3 topic clusters and 90-day content calendar
- `link-building-plan.md` — citation directories, HARO setup, review templates
- `ai-search-monitoring.md` — GA4, Bing Webmaster, and Perplexity tracking
- `competitor-analysis.md` — 5 direct + 5 SEO competitors
- `monitoring-cadences.md` — weekly, monthly, and quarterly SEO checklists
- `SEO-PRD.md` — full SEO product requirements document
