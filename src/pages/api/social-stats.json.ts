import type { APIRoute } from 'astro';

// ── Social Media Stats Scraper ────────────────────────────────────────
// Fetches live stats from YouTube, TikTok, and Instagram by parsing
// their public page HTML. No API keys required.

interface PlatformStats {
  platform: string;
  handle: string;
  url: string;
  avatar: string;
  stats: Record<string, string | number>;
  error?: string;
}

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

  // Method 1: overlayMetadata (works for shorts)
  // Pattern: "overlayMetadata":{"primaryText":{"content":"..."},"secondaryText":{"content":"563 views"}}
  const overlayPattern = /"overlayMetadata":\{[^]*?"secondaryText":\{"content":"([^"]+)"\}/g;
  let match;
  while ((match = overlayPattern.exec(html)) !== null) {
    const viewText = match[1];
    if (/\d/.test(viewText) && /view/i.test(viewText)) {
      totalViews += parseViewString(viewText);
      count++;
    }
  }

  // Method 2: viewCountText (works for regular videos)
  if (count === 0) {
    const viewCountPattern = /"viewCountText":\{"simpleText":"([^"]+)"\}/g;
    while ((match = viewCountPattern.exec(html)) !== null) {
      totalViews += parseViewString(match[1]);
      count++;
    }
  }

  // Method 3: count videoRenderer entries for video count
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
    // Fetch both main channel page and shorts page in parallel
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

    // ── Channel metadata from main page ──
    // Avatar
    const avatarMatch = mainHtml.match(/"avatar":\s*\{[^}]*"thumbnails":\s*\[\s*\{[^}]*"url":\s*"([^"]+)"/);
    if (avatarMatch) {
      result.avatar = avatarMatch[1].replace(/\\u0026/g, '&');
    }

    // Channel name
    const nameMatch = mainHtml.match(/"channelName":\s*"([^"]+)"/);
    if (nameMatch) {
      result.stats.channelName = nameMatch[1];
    } else {
      const titleMatch = mainHtml.match(/<title>([^<]+)<\/title>/);
      if (titleMatch) {
        result.stats.channelName = titleMatch[1].replace(' - YouTube', '').trim();
      }
    }

    // ── Extract view counts from shorts page ──
    const shortsData = extractVideoViews(shortsHtml);
    result.stats.shortsCount = shortsData.count;
    result.stats.shortsViews = shortsData.totalViews;

    // ── Extract view counts from videos page ──
    const videosData = extractVideoViews(videosHtml);
    result.stats.videoCount = videosData.count;
    result.stats.videoViews = videosData.totalViews;

    // If videos page didn't have overlayMetadata, try viewCountText from main page
    if (videosData.totalViews === 0) {
      const viewCountMatch = mainHtml.match(/"viewCountText":\s*\{[^}]*"simpleText":\s*"([^"]+)"/);
      if (viewCountMatch) {
        result.stats.videoViews = parseViewString(viewCountMatch[1]);
      }
    }

    // ── Combined totals ──
    result.stats.totalViews = (result.stats.videoViews as number || 0) + (result.stats.shortsViews as number || 0);

  } catch (err: any) {
    result.error = err.message || 'Failed to fetch';
  }

  return result;
}

// ── TikTok Scraper ────────────────────────────────────────────────────
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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      result.error = `HTTP ${response.status}`;
      return result;
    }

    const html = await response.text();

    // Extract __UNIVERSAL_DATA_FOR_REHYDRATION__ JSON
    const rehydrationMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    if (rehydrationMatch) {
      try {
        const data = JSON.parse(rehydrationMatch[1]);
        const userDetail = data?.['__DEFAULT_SCOPE__']?.['webapp.user-detail'];
        const userInfo = userDetail?.userInfo;

        if (userInfo) {
          const user = userInfo.user || {};
          const stats = userInfo.stats || {};

          result.stats.nickname = user.nickname || handle;
          result.stats.followers = stats.followerCount ?? 0;
          result.stats.following = stats.followingCount ?? 0;
          result.stats.likes = stats.heartCount ?? stats.heart ?? 0;
          result.stats.videos = stats.videoCount ?? 0;
          result.stats.diggs = stats.diggCount ?? 0;
          result.avatar = user.avatarLarger || user.avatarMedium || user.avatarThumb || '';

          if (user.signature) {
            result.stats.bio = user.signature;
          }
          if (user.verified !== undefined) {
            result.stats.verified = user.verified;
          }
        }
      } catch (parseErr) {
        // JSON parsing failed, try regex fallback
      }
    }

    // Fallback: try meta tag extraction
    if (!result.stats.followers) {
      const followersMatch = html.match(/"followerCount":\s*(\d+)/);
      if (followersMatch) result.stats.followers = parseInt(followersMatch[1]);
    }
    if (!result.stats.likes) {
      const likesMatch = html.match(/"heartCount":\s*(\d+)/);
      if (likesMatch) result.stats.likes = parseInt(likesMatch[1]);
    }
    if (!result.avatar) {
      const avatarMatch = html.match(/"avatarLarger":\s*"([^"]+)"/);
      if (avatarMatch) result.avatar = avatarMatch[1].replace(/\\u002F/g, '/');
    }

  } catch (err: any) {
    result.error = err.message || 'Failed to fetch';
  }

  return result;
}

// ── Instagram Scraper ─────────────────────────────────────────────────
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
    // Use Instagram's internal GraphQL API with the public app ID
    const apiUrl = 'https://www.instagram.com/api/v1/users/web_profile_info/?username=cutglasmr';
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-IG-App-ID': '936619743392459',
        'Accept': '*/*',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Referer': 'https://www.instagram.com/cutglasmr/',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      // Fallback to HTML scraping if API fails
      return await scrapeInstagramFallback(result);
    }

    const data = await response.json();
    const user = data?.data?.user;

    if (user) {
      result.stats.displayName = user.full_name || 'cutglasmr';
      result.stats.posts = user.edge_owner_to_timeline_media?.count ?? 0;
      result.stats.followers = user.edge_followed_by?.count ?? 0;
      result.avatar = user.profile_pic_url_hd || user.profile_pic_url || '';

      // Sum up video_view_count from all posts
      const edges = user.edge_owner_to_timeline_media?.edges || [];
      let totalViews = 0;
      for (const edge of edges) {
        const node = edge?.node;
        if (node?.video_view_count) {
          totalViews += node.video_view_count;
        }
      }
      result.stats.totalViews = totalViews;
    }
  } catch (err: any) {
    // Try fallback
    return await scrapeInstagramFallback(result);
  }

  return result;
}

/** Fallback Instagram scraper using HTML meta tags */
async function scrapeInstagramFallback(result: PlatformStats): Promise<PlatformStats> {
  try {
    const response = await fetch('https://www.instagram.com/cutglasmr/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      result.error = `HTTP ${response.status}`;
      return result;
    }

    const html = await response.text();

    // Meta description: "X Followers, Y Following, Z Posts"
    const metaDescMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
    if (metaDescMatch) {
      const desc = metaDescMatch[1];
      const postsM = desc.match(/([\d,.]+[KMB]?)\s*Posts/i);
      if (postsM) result.stats.posts = postsM[1];
      const followersM = desc.match(/([\d,.]+[KMB]?)\s*Followers/i);
      if (followersM) result.stats.followers = followersM[1];
    }

    const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
    if (ogImageMatch) result.avatar = ogImageMatch[1];

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      const namePart = titleMatch[1].split('(')[0].trim();
      if (namePart) result.stats.displayName = namePart;
    }
  } catch (err: any) {
    result.error = err.message || 'Failed to fetch';
  }

  return result;
}

// ── API Route ─────────────────────────────────────────────────────────
export const GET: APIRoute = async () => {
  try {
    const [youtube, tiktok, instagram] = await Promise.all([
      scrapeYouTube(),
      scrapeTikTok(),
      scrapeInstagram(),
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
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
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
