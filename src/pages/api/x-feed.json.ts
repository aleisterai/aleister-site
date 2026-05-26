export const prerender = false;

import type { APIRoute } from 'astro';

// ── Live X / Twitter feed for @aleisterai ─────────────────────────────
// Pulls profile + recent tweets. Source priority:
//   1. Official X API v2  — if X_BEARER_TOKEN is set (cheapest, canonical)
//   2. Apify tweet-scraper — uses the existing APIFY_TOKEN otherwise
// Server-cached so we don't hammer either source on every page load.

const HANDLE = 'aleisterai';
const APIFY_TOKEN = import.meta.env.APIFY_TOKEN || process.env.APIFY_TOKEN || '';
const X_BEARER =
    import.meta.env.X_BEARER_TOKEN || process.env.X_BEARER_TOKEN || '';

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours
let cache: { data: FeedPayload; timestamp: number } | null = null;

interface FeedTweet {
    id: string;
    created_at: string; // ISO 8601
    content: string;
    likes: number;
    retweets: number;
    replies: number;
    views: number;
    isPinned: boolean;
}

interface FeedProfile {
    name: string;
    handle: string;
    description: string;
    followers: number;
    following: number;
    avatar: string;
}

interface FeedPayload {
    success: boolean;
    source: 'x-api' | 'apify' | 'none';
    profile: FeedProfile | null;
    tweets: FeedTweet[];
    timestamp: string;
}

function num(v: unknown): number {
    const n = typeof v === 'string' ? parseInt(v.replace(/[^0-9]/g, ''), 10) : Number(v);
    return Number.isFinite(n) ? n : 0;
}

// ── Source 1: Official X API v2 ───────────────────────────────────────
async function fetchViaXApi(): Promise<FeedPayload | null> {
    if (!X_BEARER) return null;
    const headers = { Authorization: `Bearer ${X_BEARER}` };

    const userRes = await fetch(
        `https://api.twitter.com/2/users/by/username/${HANDLE}?user.fields=name,description,profile_image_url,public_metrics`,
        { headers, signal: AbortSignal.timeout(10000) },
    );
    if (!userRes.ok) throw new Error(`X API user: ${userRes.status}`);
    const userJson = await userRes.json();
    const u = userJson.data;
    if (!u) throw new Error('X API: no user');

    const tweetsRes = await fetch(
        `https://api.twitter.com/2/users/${u.id}/tweets?max_results=10&exclude=replies&tweet.fields=created_at,public_metrics`,
        { headers, signal: AbortSignal.timeout(10000) },
    );
    if (!tweetsRes.ok) throw new Error(`X API tweets: ${tweetsRes.status}`);
    const tweetsJson = await tweetsRes.json();

    const tweets: FeedTweet[] = (tweetsJson.data || []).map((t: any) => ({
        id: t.id,
        created_at: t.created_at,
        content: t.text || '',
        likes: num(t.public_metrics?.like_count),
        retweets: num(t.public_metrics?.retweet_count),
        replies: num(t.public_metrics?.reply_count),
        views: num(t.public_metrics?.impression_count),
        isPinned: false,
    }));

    return {
        success: true,
        source: 'x-api',
        profile: {
            name: u.name || 'Aleister',
            handle: HANDLE,
            description: u.description || '',
            followers: num(u.public_metrics?.followers_count),
            following: num(u.public_metrics?.following_count),
            // upgrade the default normal-res avatar to higher res
            avatar: (u.profile_image_url || '').replace('_normal', '_400x400'),
        },
        tweets,
        timestamp: new Date().toISOString(),
    };
}

// ── Source 2: Apify tweet-scraper ─────────────────────────────────────
async function fetchViaApify(): Promise<FeedPayload | null> {
    if (!APIFY_TOKEN) return null;
    const url = `https://api.apify.com/v2/acts/apidojo~tweet-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            twitterHandles: [HANDLE],
            maxItems: 12,
            sort: 'Latest',
        }),
        signal: AbortSignal.timeout(90000),
    });
    if (!res.ok) throw new Error(`Apify: ${res.status}`);
    const items: any[] = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Apify: empty dataset');
    }

    // Defensive field extraction — Apify Twitter actor field names vary.
    const tweets: FeedTweet[] = items
        .filter((t) => t && (t.text || t.fullText || t.full_text))
        .map((t) => ({
            id: String(t.id ?? t.tweetId ?? t.id_str ?? ''),
            created_at: t.createdAt ?? t.created_at ?? t.date ?? '',
            content: t.text ?? t.fullText ?? t.full_text ?? '',
            likes: num(t.likeCount ?? t.favoriteCount ?? t.favorite_count ?? t.likes),
            retweets: num(t.retweetCount ?? t.retweet_count ?? t.retweets),
            replies: num(t.replyCount ?? t.reply_count ?? t.replies),
            views: num(t.viewCount ?? t.viewsCount ?? t.views ?? t.impressions),
            isPinned: Boolean(t.isPinned ?? t.pinned ?? false),
        }))
        .slice(0, 10);

    // Author/profile is embedded on each tweet item
    const a =
        items[0].author ||
        items[0].user ||
        items[0].authorMeta ||
        {};
    const profile: FeedProfile = {
        name: a.name ?? a.displayName ?? 'Aleister',
        handle: HANDLE,
        description: a.description ?? a.bio ?? a.rawDescription ?? '',
        followers: num(a.followers ?? a.followersCount ?? a.followers_count),
        following: num(a.following ?? a.followingCount ?? a.friends_count ?? a.followingCount),
        avatar: (a.profilePicture ?? a.profileImageUrl ?? a.avatar ?? '').replace(
            '_normal',
            '_400x400',
        ),
    };

    return {
        success: true,
        source: 'apify',
        profile,
        tweets,
        timestamp: new Date().toISOString(),
    };
}

export const GET: APIRoute = async () => {
    // Serve fresh cache
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
        return json(cache.data);
    }

    let xError: string | null = null;
    try {
        // Prefer the official API, fall back to Apify
        let payload: FeedPayload | null = null;
        try {
            payload = await fetchViaXApi();
        } catch (e) {
            xError = e instanceof Error ? e.message : String(e);
            console.error('x-feed: X API failed, trying Apify:', e);
        }
        if (!payload) {
            payload = await fetchViaApify();
        }

        if (payload && payload.tweets.length > 0) {
            cache = { data: payload, timestamp: Date.now() };
            return json(payload);
        }

        // Both sources unavailable
        return fail(xError);
    } catch (error) {
        console.error('x-feed error:', error);
        // Serve stale cache if we have any, else signal failure
        if (cache) return json(cache.data);
        return fail(xError ?? (error instanceof Error ? error.message : String(error)));
    }
};

function json(data: FeedPayload): Response {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            // s-maxage gates how often the X API is actually hit: the
            // Vercel CDN serves this cached for 6h, so X is called ~once
            // per 6h per region (keeps pay-per-use cost to ~$1-2/mo).
            'Cache-Control': 'public, max-age=600, s-maxage=21600, stale-while-revalidate=86400',
        },
    });
}

// Failure response with safe diagnostics (no secret leaked — just whether
// a token was seen and the upstream HTTP status). Short cache so the feed
// recovers quickly once the token/config is fixed.
function fail(detail: string | null): Response {
    return new Response(
        JSON.stringify({
            success: false,
            source: 'none',
            profile: null,
            tweets: [],
            tokenPresent: Boolean(X_BEARER),
            detail,
            timestamp: new Date().toISOString(),
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=60',
            },
        },
    );
}
