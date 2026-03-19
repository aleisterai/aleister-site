import type { APIRoute } from 'astro';

// ── Social Media Stats Scraper ────────────────────────────────────────
// YouTube:   HTML scraping, refreshes every 5 min (free)
// TikTok:    Apify clockworks~free-tiktok-scraper, refreshes every 1 hr
// Instagram: Apify apify~instagram-reel-scraper, refreshes every 1 hr

interface PlatformStats {
  platform: string;
  handle: string;
  url: string;
  avatar: string;
  stats: Record<string, string | number | boolean>;
  error?: string;
}

const APIFY_TOKEN = import.meta.env.APIFY_TOKEN || process.env.APIFY_TOKEN || '';

// ── Per-platform cache with different TTLs ────────────────────────────
const CACHE_TTL = {
  youtube: 5 * 60 * 1000,      // 5 minutes (free HTML scraping)
  tiktok: 2 * 60 * 60 * 1000,  // 2 hours (Apify costs $)
  instagram: 2 * 60 * 60 * 1000, // 2 hours (Apify costs $)
};

const cache: Record<string, { data: PlatformStats; timestamp: number }> = {};

// ── Helpers ───────────────────────────────────────────────────────────
const YT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

/** Parse "1.3K views", "562 views", "1.4M views" → numeric value */
function parseViewString(str: string): number {
  const clean = str.replace(/,/g, '').replace(/\s*views?\s*/i, '').trim();
  const multiplierMatch = clean.match(/^([\d.]+)\s*([KMBkmb])?$/);
  if (!multiplierMatch) return 0;
  const num = parseFloat(multiplierMatch[1]);
  const suffix = (multiplierMatch[2] || '').toUpperCase();
  if (suffix === 'K') return Math.round(num * 1_000);
  if (suffix === 'M') return Math.round(num * 1_000_000);
  if (suffix === 'B') return Math.round(num * 1_000_000_000);
  return Math.round(num);
}

/** Extract per-video view counts from YouTube page HTML using overlayMetadata */
function extractVideoViews(html: string): { count: number; totalViews: number } {
  let count = 0;
  let totalViews = 0;

  // overlayMetadata (works for shorts)
  const overlayPattern = /"overlayMetadata":\{[^]*?"secondaryText":\{"content":"([^"]+)"\}/g;
  let match;
  while ((match = overlayPattern.exec(html)) !== null) {
    const viewText = match[1];
    if (/\d/.test(viewText) && /view/i.test(viewText)) {
      totalViews += parseViewString(viewText);
      count++;
    }
  }

  // viewCountText (works for regular videos)
  if (count === 0) {
    const viewCountPattern = /"viewCountText":\{"simpleText":"([^"]+)"\}/g;
    while ((match = viewCountPattern.exec(html)) !== null) {
      totalViews += parseViewString(match[1]);
      count++;
    }
  }

  if (count === 0) {
    const renderers = html.match(/"videoRenderer"/g);
    if (renderers) count = renderers.length;
  }

  return { count, totalViews };
}

// ── YouTube Scraper ───────────────────────────────────────────────────
async function scrapeYouTube(): Promise<PlatformStats> {
  const handle = '@CutGlAsmr';
  const url = `https://www.youtube.com/${handle}`;
  const result: PlatformStats = {
    platform: 'youtube',
    handle,
    url,
    avatar: '',
    stats: {},
  };

  try {
    const [mainRes, shortsRes, videosRes] = await Promise.all([
      fetch(url, { headers: YT_HEADERS, signal: AbortSignal.timeout(15000) }),
      fetch(`${url}/shorts`, { headers: YT_HEADERS, signal: AbortSignal.timeout(15000) }),
      fetch(`${url}/videos`, { headers: YT_HEADERS, signal: AbortSignal.timeout(15000) }),
    ]);

    if (!mainRes.ok) {
      result.error = `HTTP ${mainRes.status}`;
      return result;
    }

    const [mainHtml, shortsHtml, videosHtml] = await Promise.all([
      mainRes.text(),
      shortsRes.ok ? shortsRes.text() : '',
      videosRes.ok ? videosRes.text() : '',
    ]);

    // Avatar
    const avatarMatch = mainHtml.match(/"avatar":\s*\{[^}]*"thumbnails":\s*\[\s*\{[^}]*"url":\s*"([^"]+)"/);
    if (avatarMatch) result.avatar = avatarMatch[1].replace(/\\u0026/g, '&');

    // Channel name
    const nameMatch = mainHtml.match(/"channelName":\s*"([^"]+)"/);
    if (nameMatch) {
      result.stats.channelName = nameMatch[1];
    } else {
      const titleMatch = mainHtml.match(/<title>([^<]+)<\/title>/);
      if (titleMatch) result.stats.channelName = titleMatch[1].replace(' - YouTube', '').trim();
    }

    // Shorts views
    const shortsData = extractVideoViews(shortsHtml);
    result.stats.shortsCount = shortsData.count;
    result.stats.shortsViews = shortsData.totalViews;

    // Videos views
    const videosData = extractVideoViews(videosHtml);
    result.stats.videoCount = videosData.count;
    result.stats.videoViews = videosData.totalViews;

    // Fallback for video views
    if (videosData.totalViews === 0) {
      const viewCountMatch = mainHtml.match(/"viewCountText":\s*\{[^}]*"simpleText":\s*"([^"]+)"\}/);
      if (viewCountMatch) result.stats.videoViews = parseViewString(viewCountMatch[1]);
    }

    // Combined totals
    result.stats.totalViews = (result.stats.videoViews as number || 0) + (result.stats.shortsViews as number || 0);

  } catch (err: any) {
    result.error = err.message || 'Failed to fetch';
  }

  return result;
}

// ── TikTok Scraper (via Apify) ───────────────────────────────────────
async function scrapeTikTok(): Promise<PlatformStats> {
  const handle = '@glasscut.asmr6';
  const url = `https://www.tiktok.com/${handle}`;
  const result: PlatformStats = {
    platform: 'tiktok',
    handle,
    url,
    avatar: '',
    stats: {},
  };

  try {
    // Use Apify's free TikTok scraper for real per-video play counts
    const apifyUrl = `https://api.apify.com/v2/acts/clockworks~free-tiktok-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profiles: ['glasscut.asmr6'],
        resultsPerPage: 30,
        shouldDownloadVideos: false,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (apifyRes.ok) {
      const videos: any[] = await apifyRes.json();
      let totalViews = 0;
      for (const video of videos) {
        totalViews += (video.playCount || 0);
      }
      result.stats.videos = videos.length;
      result.stats.totalViews = totalViews;

      // Profile info from first video's author
      if (videos.length > 0) {
        const author = videos[0].authorMeta || videos[0].author || {};
        result.stats.nickname = author.nickName || author.nickname || author.name || 'GlassCut ASMR';
        result.avatar = author.avatar || '';
      }
    }

    // Fallback: fetch profile page for nickname/avatar
    if (!result.stats.nickname || !result.avatar) {
      const profileRes = await fetch(url, {
        headers: { 'User-Agent': YT_HEADERS['User-Agent'], 'Accept-Language': 'en-US,en;q=0.9' },
        signal: AbortSignal.timeout(15000),
      });

      if (profileRes.ok) {
        const html = await profileRes.text();
        const rehydrationMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
        if (rehydrationMatch) {
          try {
            const data = JSON.parse(rehydrationMatch[1]);
            const userInfo = data?.['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo;
            if (userInfo) {
              const user = userInfo.user || {};
              if (!result.stats.nickname) result.stats.nickname = user.nickname || handle;
              if (!result.avatar) result.avatar = user.avatarLarger || user.avatarMedium || '';
              if (!result.stats.videos) result.stats.videos = userInfo.stats?.videoCount ?? 0;
            }
          } catch { /* ignore */ }
        }
      }
    }
  } catch (err: any) {
    result.error = err.message || 'Failed to fetch';
  }

  return result;
}

// ── Instagram Scraper (via Apify Reel Scraper) ──────────────────────
async function scrapeInstagram(): Promise<PlatformStats> {
  const handle = '@cutglasmr';
  const url = 'https://www.instagram.com/cutglasmr/';
  const result: PlatformStats = {
    platform: 'instagram',
    handle,
    url,
    avatar: '',
    stats: {},
  };

  try {
    // Use Apify's dedicated Instagram Reel Scraper for real-time view counts
    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ['cutglasmr'],
        resultsLimit: 30,
      }),
      signal: AbortSignal.timeout(180000),
    });

    if (apifyRes.ok) {
      const reels: any[] = await apifyRes.json();
      let totalViews = 0;
      for (const reel of reels) {
        totalViews += (reel.videoPlayCount || reel.videoViewCount || reel.views || reel.playCount || 0);
      }
      result.stats.posts = reels.length;
      result.stats.totalViews = totalViews;
    }

    // Fetch profile metadata (displayName, avatar) via GraphQL
    try {
      const apiUrl = 'https://www.instagram.com/api/v1/users/web_profile_info/?username=cutglasmr';
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': YT_HEADERS['User-Agent'],
          'X-IG-App-ID': '936619743392459',
          'Accept': '*/*',
          'Referer': 'https://www.instagram.com/cutglasmr/',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data?.data?.user;
        if (user) {
          result.stats.displayName = user.full_name || 'cutglasmr';
          if (!result.stats.posts) result.stats.posts = user.edge_owner_to_timeline_media?.count ?? 0;
          result.avatar = user.profile_pic_url_hd || user.profile_pic_url || '';

          // Use GraphQL views only if reel scraper returned nothing
          if (!result.stats.totalViews) {
            const edges = user.edge_owner_to_timeline_media?.edges || [];
            let totalViews = 0;
            for (const edge of edges) {
              if (edge?.node?.video_view_count) totalViews += edge.node.video_view_count;
            }
            result.stats.totalViews = totalViews;
          }
        }
      }
    } catch { /* GraphQL failed, continue */ }

    if (!result.stats.displayName) result.stats.displayName = 'Glass Cut';
  } catch (err: any) {
    result.error = err.message || 'Failed to fetch';
  }

  return result;
}

// ── Cached scraper wrapper ────────────────────────────────────────────
async function cachedScrape(
  key: string,
  scraper: () => Promise<PlatformStats>,
): Promise<PlatformStats> {
  const now = Date.now();
  const ttl = CACHE_TTL[key as keyof typeof CACHE_TTL] || 60 * 60 * 1000;
  const cached = cache[key];
  if (cached && (now - cached.timestamp) < ttl) {
    return cached.data;
  }
  const data = await scraper();
  cache[key] = { data, timestamp: now };
  return data;
}

// ── API Route ─────────────────────────────────────────────────────────
export const GET: APIRoute = async () => {
  try {
    const [youtube, tiktok, instagram] = await Promise.all([
      cachedScrape('youtube', scrapeYouTube),
      cachedScrape('tiktok', scrapeTikTok),
      cachedScrape('instagram', scrapeInstagram),
    ]);

    return new Response(JSON.stringify({
      success: true,
      platforms: { youtube, tiktok, instagram },
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // Browser cache 5 min (server cache is per-platform)
      },
    });
  } catch (error: any) {
    console.error('Error in social-stats API:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal error',
      platforms: {},
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
