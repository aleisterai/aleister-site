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

    // Extract subscriber count from meta tags or page content
    const subscriberMatch = html.match(/"subscriberCountText":\s*\{[^}]*"simpleText":\s*"([^"]+)"/);
    if (subscriberMatch) {
      result.stats.subscribers = subscriberMatch[1];
    }

    // Extract video count
    const videoCountMatch = html.match(/"videosCountText":\s*\{[^}]*"runs":\s*\[\s*\{[^}]*"text":\s*"([^"]+)"/);
    if (videoCountMatch) {
      result.stats.videoCount = videoCountMatch[1];
    }

    // Try alternate video count pattern
    if (!result.stats.videoCount) {
      const altVideoMatch = html.match(/"videoCountText":\s*\{[^}]*"simpleText":\s*"([^"]+)"/);
      if (altVideoMatch) {
        result.stats.videoCount = altVideoMatch[1];
      }
    }

    // Extract avatar thumbnail
    const avatarMatch = html.match(/"avatar":\s*\{[^}]*"thumbnails":\s*\[\s*\{[^}]*"url":\s*"([^"]+)"/);
    if (avatarMatch) {
      result.avatar = avatarMatch[1].replace(/\\u0026/g, '&');
    }

    // Extract channel description
    const descMatch = html.match(/"description":\s*"([^"]{0,200})"/);
    if (descMatch) {
      result.stats.description = descMatch[1].replace(/\\n/g, ' ').substring(0, 100);
    }

    // Extract total view count from about page data
    const viewCountMatch = html.match(/"viewCountText":\s*\{[^}]*"simpleText":\s*"([^"]+)"/);
    if (viewCountMatch) {
      result.stats.totalViews = viewCountMatch[1];
    }

    // Try to get channel name
    const nameMatch = html.match(/"channelName":\s*"([^"]+)"/);
    if (nameMatch) {
      result.stats.channelName = nameMatch[1];
    }

    // Fallback: extract title
    if (!result.stats.channelName) {
      const titleMatch = html.match(/<title>([^<]+)<\/title>/);
      if (titleMatch) {
        result.stats.channelName = titleMatch[1].replace(' - YouTube', '').trim();
      }
    }

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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      result.error = `HTTP ${response.status}`;
      return result;
    }

    const html = await response.text();

    // Try to extract from meta description (format: "X Followers, Y Following, Z Posts")
    const metaDescMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) ||
                          html.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i);
    if (metaDescMatch) {
      const desc = metaDescMatch[1];
      result.stats.description = desc;

      // Parse followers/following/posts from meta description
      const followersM = desc.match(/([\d,.]+[KMB]?)\s*Followers/i);
      if (followersM) result.stats.followers = followersM[1];

      const followingM = desc.match(/([\d,.]+[KMB]?)\s*Following/i);
      if (followingM) result.stats.following = followingM[1];

      const postsM = desc.match(/([\d,.]+[KMB]?)\s*Posts/i);
      if (postsM) result.stats.posts = postsM[1];
    }

    // Try to get OG image for avatar
    const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i);
    if (ogImageMatch) {
      result.avatar = ogImageMatch[1];
    }

    // Extract user name from title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      const namePart = titleMatch[1].split('(')[0].trim();
      if (namePart) result.stats.displayName = namePart;
    }

    // Try to extract from SharedData (older Instagram pages)
    const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({[\s\S]*?});<\/script>/);
    if (sharedDataMatch) {
      try {
        const sharedData = JSON.parse(sharedDataMatch[1]);
        const user = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user;
        if (user) {
          result.stats.followers = user.edge_followed_by?.count ?? result.stats.followers;
          result.stats.following = user.edge_follow?.count ?? result.stats.following;
          result.stats.posts = user.edge_owner_to_timeline_media?.count ?? result.stats.posts;
          result.avatar = user.profile_pic_url_hd || user.profile_pic_url || result.avatar;
          result.stats.fullName = user.full_name || '';
          result.stats.verified = user.is_verified || false;
        }
      } catch (e) {
        // Parsing failed, we already have meta data
      }
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
