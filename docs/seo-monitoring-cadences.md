# SEO Monitoring Cadences — thealeister.com

**Site:** thealeister.com
**Niche:** AI agents for autonomous business operations

---

## KPI Tracking Table

| KPI | Tool | Target | Cadence |
|-----|------|--------|---------|
| Organic sessions | GA4 | +10% MoM | Weekly |
| Impressions | GSC | Trending up | Weekly |
| Average position (target keywords) | GSC | < 20 | Weekly |
| Click-through rate (CTR) | GSC | > 3% | Monthly |
| Indexed pages | GSC → Coverage | 100% valid | Monthly |
| Core Web Vitals pass rate | GSC → CWV | > 95% | Monthly |
| Referring domains | Ahrefs | +5/month | Monthly |
| Domain Rating (DR) | Ahrefs | Trending up | Monthly |
| Backlinks lost/gained | Ahrefs | Net positive | Monthly |
| Keyword rankings (tracked set) | Ahrefs | Track 30+ | Weekly |
| AI search referral sessions | GA4 AI segment | Track baseline | Weekly |
| Bing Chat clicks | Bing Webmaster | Trending up | Monthly |
| Conversion rate (organic → /get) | GA4 | > 2% | Monthly |

---

## Weekly Checklist

### Google Search Console (15 min)

- [ ] **Performance → Last 7 days vs previous 7 days** — note impression and click delta
- [ ] **Top queries** — check if any target keywords dropped >3 positions
- [ ] **Top pages** — confirm `/lead-arbitrage` and `/get` are in the top 5
- [ ] **Coverage → Error tab** — resolve any new 404s or server errors
- [ ] **Manual action / security issues** — confirm clean

### GA4 (10 min)

- [ ] **Reports → Acquisition → Traffic acquisition** — organic sessions WoW delta
- [ ] **AI Search channel group** — sessions from `perplexity.ai`, `chatgpt.com`, `bing.com` (Copilot)
- [ ] **Conversions → `/get` page events** — organic-to-conversion count
- [ ] Check for anomaly alerts in GA4 Insights (bell icon)

### Ahrefs (10 min)

- [ ] **Rank Tracker → Weekly snapshot** — positions for tracked keyword set
- [ ] Flag any keywords that dropped out of top 20
- [ ] **Alerts** (email) — review new backlink / lost backlink notifications

---

## Monthly Checklist

### Google Search Console (30 min)

- [ ] **Performance → Last 28 days vs previous 28 days** — impressions, clicks, CTR, avg. position
- [ ] **Queries → Filter CTR < 1%** with impressions > 500 — flag for title/meta refresh
- [ ] **Core Web Vitals** — confirm all URLs pass for both mobile and desktop
- [ ] **Coverage → Valid tab** — total indexed count vs. sitemap count
- [ ] **Sitemaps** — confirm last submission was accepted, no errors
- [ ] **Links → Top linked pages** — note any changes to internal link distribution
- [ ] Export top-50 queries to spreadsheet for trend archive

### GA4 (20 min)

- [ ] **Engagement → Pages and screens** — top landing pages by organic session, MoM delta
- [ ] **Funnel** — organic sessions → `/get` page → contact event (conversion rate)
- [ ] **Exploration → AI Search segment** — MoM trend for AI referral sessions
- [ ] **Retention** — confirm new user vs. returning user ratio is stable

### Ahrefs (30 min)

- [ ] **Site Overview** — DR, referring domains count, organic keywords count
- [ ] **Backlink profile → New** — qualify new links (spam check, DR ≥ 20 threshold)
- [ ] **Backlink profile → Lost** — investigate lost links; reclaim if high-value
- [ ] **Organic keywords → Positions 11–20** — identify quick-win pages to optimize
- [ ] **Content Gap** — run against top competitor to surface uncovered keywords
- [ ] **Site Audit** (if crawl scheduled) — review health score, fix critical issues

### Bing Webmaster Tools (10 min)

- [ ] **Search performance → Chat filter** — Copilot clicks and impressions MoM
- [ ] **IndexNow** — confirm recent publishes were submitted and indexed

---

## Quarterly Checklist

### Strategy Review (2 hrs)

- [ ] **GSC — 90-day export** — full query/page performance review; update target keyword list
- [ ] **Ahrefs — Competitor ranking movements** — re-run competitor analysis against tracked rivals
- [ ] **Content audit** — review all published pages: update outdated stats, refresh meta titles, add internal links to newer content
- [ ] **Backlink audit** — disavow spammy links if referring domain spam score > 60%
- [ ] **Core Web Vitals deep dive** — run PageSpeed Insights on `/`, `/lead-arbitrage`, `/get`; address any regressions
- [ ] **Schema audit** — confirm all key pages have valid structured data via Google Rich Results Test
- [ ] **AI citation check** — manually query 10 target keywords in Perplexity and ChatGPT; record whether the site is cited; log in tracking sheet
- [ ] **Link-building progress** — compare actual acquired links vs. plan targets from `link-building-plan.md`
- [ ] **Sitemap health** — confirm sitemap includes all canonical URLs and excludes noindex pages

### OKR / KPI Reset

- [ ] Review KPI table above against actuals for the quarter
- [ ] Set new targets for next quarter
- [ ] Update `docs/content-strategy.md` with new focus topics based on keyword gaps found

---

## Tool Quick-Reference

### Google Search Console

- URL: [search.google.com/search-console](https://search.google.com/search-console)
- Key reports: Performance, Coverage, Core Web Vitals, Links, Manual Actions
- Data lag: ~2 days

### GA4

- Key reports: Acquisition → Traffic acquisition, Engagement → Pages and screens, Explore (custom segments)
- AI Search segment: Session source matches regex `perplexity\.ai|chatgpt\.com|you\.com`
- Data lag: ~24 hrs (standard reports), near-real-time for DebugView

### Ahrefs

- Key reports: Site Overview, Rank Tracker, Backlink Profile, Organic Keywords, Content Gap, Site Audit
- Rank Tracker: update weekly snapshot every Monday
- Site Audit: schedule crawl monthly (first Monday of the month)

### Bing Webmaster Tools

- URL: [bing.com/webmasters](https://www.bing.com/webmasters)
- Key reports: Search Performance (filter: Chat), Sitemaps, IndexNow submission log

---

## Tracking Spreadsheet Schema

Maintain a Google Sheet with one tab per cadence. Minimum columns:

**Weekly tab**

| Week (Mon) | GSC Impressions | GSC Clicks | Organic Sessions | AI Sessions | Top-keyword avg pos | Notes |
|---|---|---|---|---|---|---|

**Monthly tab**

| Month | DR | Ref Domains | Indexed Pages | CWV Pass % | Organic → /get CVR | Notes |
|---|---|---|---|---|---|---|

**Quarterly tab**

| Quarter | Organic Sessions | Total Backlinks | Avg Position (tracked set) | AI Citations (manual) | OKR status |
|---|---|---|---|---|---|
