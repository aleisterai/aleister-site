# AI Search Monitoring

How to track traffic arriving from AI-powered search surfaces (ChatGPT, Perplexity, Gemini, Copilot, etc.).

---

## 1. GA4 — Referrer-Based Segments

AI assistants send HTTP referrers inconsistently, but the known ones are worth capturing.

### Known referrer hostnames

| Source | Referrer hostname |
|---|---|
| Perplexity | `perplexity.ai` |
| ChatGPT (web) | `chatgpt.com` |
| Bing Copilot | `bing.com` |
| Google SGE / Gemini | `google.com` (no distinguishing path yet) |
| You.com | `you.com` |

### Create a GA4 exploration segment

1. GA4 → **Explore** → blank exploration.
2. Click **+** next to Segments → **Session segment**.
3. Condition: `Session source` → **matches regex**:

   ```
   perplexity\.ai|chatgpt\.com|you\.com
   ```

4. Name it **AI Search Referrers** and save.
5. Add the segment to your exploration alongside your standard organic segment to compare.

### Custom channel group (optional but recommended)

1. **Admin** → **Data display** → **Channel groups** → **Create new channel group**.
2. Add a rule: `Session source` matches regex above → channel name `AI Search`.
3. This surfaces the channel in standard reports (Acquisition → Traffic acquisition).

### UTM tagging for your own AI-cited links

If you control links that appear in AI-generated answers (e.g., a tool that creates shareable URLs), append `?utm_source=ai-search&utm_medium=referral` so the traffic is unambiguous regardless of referrer stripping.

---

## 2. Bing Webmaster Tools

Bing Webmaster shows impressions and clicks from Bing's AI-powered surfaces (Copilot, chat answers).

### Setup

1. Verify the site at [bing.com/webmasters](https://www.bing.com/webmasters) if not already done.
2. Submit your sitemap: **Sitemaps** → paste `https://yourdomain.com/sitemap.xml`.

### Where to look

- **Search performance** → filter **Search type** to **Chat** (available once Bing sees chat traffic).
- The **Chat** filter isolates clicks and impressions from Copilot/Bing Chat answers vs. traditional web results.
- Export weekly to a spreadsheet to track trend over time — the built-in date comparison only goes 3 months back.

### IndexNow

Bing (and Yandex) support IndexNow for instant page indexing. The key file is already in place at `/public/[key].txt`. Submit URLs on publish via:

```
POST https://api.indexnow.org/indexnow
{
  "host": "yourdomain.com",
  "key": "<your-key>",
  "urlList": ["https://yourdomain.com/new-page"]
}
```

Fast indexing improves the chance that new content is included in Copilot's knowledge.

---

## 3. Perplexity Analytics

Perplexity does not yet offer a publisher-facing analytics dashboard (as of early 2026). Tracking is indirect.

### Referrer monitoring in GA4

The segment created in §1 captures `perplexity.ai` referrals when users click through from a Perplexity answer to your site.

### Perplexity Pages / Pro links

If you publish a Perplexity Page or are cited in a Pro answer, traffic will show as `referral` with source `perplexity.ai` in GA4.

### Manual citation checks

Run periodic checks to see whether your content is cited:

```
# Perplexity will show sources in its answer UI
# Search for queries you target and check if your domain appears
# E.g.: site:perplexity.ai "yourdomain.com" (limited — use manual searches)
```

Track these manually in a spreadsheet: query, date checked, cited (Y/N), position.

### Llms.txt

Publishing a `/llms.txt` file at your domain root signals to AI crawlers which pages are high-value. Perplexity and other LLM-based search tools respect it for prioritization. Example:

```
# llms.txt
/lead-arbitrage — primary product page
/blog — editorial content
/get — conversion page
```

---

## 4. Cross-Platform Dashboard (optional)

To unify data across GA4, Bing, and manual Perplexity checks, use a simple Google Sheet:

| Date | GA4 AI Sessions | Bing Chat Clicks | Bing Chat Impressions | Perplexity Citations (manual) | Notes |
|---|---|---|---|---|---|
| 2026-03-01 | 12 | 4 | 89 | 2 | |

Pull GA4 data via the GA4 Data API or Looker Studio connector. Pull Bing data via the Bing Webmaster API (`/v3/SearchPerformance`). Manual Perplexity checks fill the last column.

---

## 5. Alerts

Set up GA4 anomaly detection for the AI Search channel group:

1. **Insights** (home page bell icon) → **Create** → **Custom insight**.
2. Condition: `Sessions` from channel `AI Search` increases by more than 50% week-over-week.
3. Delivery: email.

This catches sudden citation spikes (positive) or drops (content removed from AI training/citation).
