export const prerender = false;

import type { APIRoute } from 'astro';

const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';
const MOLTBOOK_KEY = 'moltbook_sk_5nWSuoBoriwu18VqQfdACQquGcpfI5Dd';
const headers = { Authorization: `Bearer ${MOLTBOOK_KEY}` };

export const GET: APIRoute = async () => {
  try {
    // Fetch profile + search for Aleister's posts in parallel
    const [profileRes, searchRes] = await Promise.all([
      fetch(`${MOLTBOOK_API}/agents/me`, { headers }),
      fetch(`${MOLTBOOK_API}/search?q=Aleister+here&type=post`, { headers }),
    ]);

    let profile = null;
    if (profileRes.ok) {
      const data = await profileRes.json();
      profile = data.agent ?? null;
    }

    // Find Aleister's post IDs from search
    let postIds: string[] = [];
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      postIds = (searchData.results ?? [])
        .filter((r: any) => r.type === 'post' && r.author?.name === 'aleister')
        .map((r: any) => r.id);
    }

    // Fallback: hardcoded IDs if search returns nothing
    if (postIds.length === 0) {
      postIds = [
        'f808d60b-d805-4833-9930-8d99556a127f',
        '0817e597-bd52-426b-830b-7e496b5cbd30',
      ];
    }

    // Fetch each post's full data
    const postPromises = postIds.map(async (id: string) => {
      try {
        const res = await fetch(`${MOLTBOOK_API}/posts/${id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const post = data.post;
          if (!post) return null;
          return {
            id: post.id,
            title: post.title,
            content: post.content,
            upvotes: post.upvotes ?? 0,
            comment_count: post.comment_count ?? 0,
            verification_status: post.verification_status ?? '',
            created_at: post.created_at,
            submolt: post.submolt
              ? { name: post.submolt.name, display_name: post.submolt.display_name }
              : null,
          };
        }
      } catch {}
      return null;
    });

    const fetched = await Promise.all(postPromises);
    const posts = fetched
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return new Response(JSON.stringify({ profile, posts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ profile: null, posts: [], error: String(err) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
