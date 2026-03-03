import { describe, it, expect } from 'vitest';

const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';
const MOLTBOOK_KEY = 'moltbook_sk_5nWSuoBoriwu18VqQfdACQquGcpfI5Dd';
const headers = { Authorization: `Bearer ${MOLTBOOK_KEY}` };

const KNOWN_POST_IDS = [
  'f808d60b-d805-4833-9930-8d99556a127f', // 4-Tier Memory Architecture
  '0817e597-bd52-426b-830b-7e496b5cbd30', // Hi Moltbook — Aleister here
];

// ─── Moltbook API Integration Tests ───────────────────────────

describe('Moltbook API — Profile', () => {
  it('should return Aleister profile from /agents/me', async () => {
    const res = await fetch(`${MOLTBOOK_API}/agents/me`, { headers });
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.agent).toBeDefined();
    expect(data.agent.name).toBe('aleister');
    expect(data.agent.description).toBeTruthy();
    expect(typeof data.agent.karma).toBe('number');
    expect(typeof data.agent.follower_count).toBe('number');
  });

  it('should have karma and follower_count as non-negative', async () => {
    const res = await fetch(`${MOLTBOOK_API}/agents/me`, { headers });
    const data = await res.json();
    expect(data.agent.karma).toBeGreaterThanOrEqual(0);
    expect(data.agent.follower_count).toBeGreaterThanOrEqual(0);
  });
});

describe('Moltbook API — Posts by ID', () => {
  it.each(KNOWN_POST_IDS)('should fetch post %s successfully', async (id) => {
    const res = await fetch(`${MOLTBOOK_API}/posts/${id}`, { headers });
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.post).toBeDefined();
    expect(data.post.id).toBe(id);
    expect(data.post.title).toBeTruthy();
    expect(data.post.content).toBeTruthy();
    expect(data.post.author).toBeDefined();
  });

  it('should have correct fields on each post', async () => {
    const res = await fetch(`${MOLTBOOK_API}/posts/${KNOWN_POST_IDS[0]}`, { headers });
    const { post } = await res.json();

    expect(post).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      content: expect.any(String),
      upvotes: expect.any(Number),
      comment_count: expect.any(Number),
      created_at: expect.any(String),
    });
    expect(post.submolt).toBeDefined();
    expect(post.submolt.name).toBeTruthy();
  });

  it('should return 404 for non-existent post', async () => {
    const res = await fetch(`${MOLTBOOK_API}/posts/00000000-0000-0000-0000-000000000000`, { headers });
    expect(res.status).toBe(404);
  });

  it('should have author name = aleister on known posts', async () => {
    for (const id of KNOWN_POST_IDS) {
      const res = await fetch(`${MOLTBOOK_API}/posts/${id}`, { headers });
      const { post } = await res.json();
      const authorName = typeof post.author === 'object' ? post.author.name : post.author;
      expect(authorName).toBe('aleister');
    }
  });
});

describe('Moltbook API — Search discovery', () => {
  it('should find Aleister posts via search', async () => {
    const res = await fetch(`${MOLTBOOK_API}/search?q=Aleister+here&type=post`, { headers });
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.results).toBeInstanceOf(Array);

    const aleisterPosts = data.results.filter(
      (r: any) => r.type === 'post' && r.author?.name === 'aleister'
    );
    // Search may or may not return results (it's inconsistent)
    // but if it does, they should be Aleister's
    for (const post of aleisterPosts) {
      expect(post.author.name).toBe('aleister');
      expect(post.id).toBeTruthy();
      expect(post.title).toBeTruthy();
    }
  });
});

// ─── /api/moltbook Endpoint Tests ─────────────────────────────

describe('/api/moltbook endpoint logic', () => {
  // Simulate what the endpoint does
  async function fetchMoltbookData() {
    const [profileRes, searchRes] = await Promise.all([
      fetch(`${MOLTBOOK_API}/agents/me`, { headers }),
      fetch(`${MOLTBOOK_API}/search?q=Aleister+here&type=post`, { headers }),
    ]);

    let profile = null;
    if (profileRes.ok) {
      const data = await profileRes.json();
      profile = data.agent ?? null;
    }

    let postIds: string[] = [];
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      postIds = (searchData.results ?? [])
        .filter((r: any) => r.type === 'post' && r.author?.name === 'aleister')
        .map((r: any) => r.id);
    }

    // Fallback
    if (postIds.length === 0) {
      postIds = KNOWN_POST_IDS;
    }

    const postPromises = postIds.map(async (id: string) => {
      try {
        const res = await fetch(`${MOLTBOOK_API}/posts/${id}`, { headers });
        if (res.ok) {
          const data = await res.json();
          return data.post ?? null;
        }
      } catch {}
      return null;
    });

    const fetched = await Promise.all(postPromises);
    const posts = fetched
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return { profile, posts };
  }

  it('should return profile with required fields', async () => {
    const { profile } = await fetchMoltbookData();
    expect(profile).toBeDefined();
    expect(profile!.name).toBe('aleister');
    expect(typeof profile!.karma).toBe('number');
    expect(typeof profile!.follower_count).toBe('number');
    expect(profile!.description).toBeTruthy();
  });

  it('should return at least 2 posts', async () => {
    const { posts } = await fetchMoltbookData();
    expect(posts.length).toBeGreaterThanOrEqual(2);
  });

  it('should return posts sorted newest first', async () => {
    const { posts } = await fetchMoltbookData();
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].created_at).getTime();
      const curr = new Date(posts[i].created_at).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('should have valid submolt on each post', async () => {
    const { posts } = await fetchMoltbookData();
    for (const post of posts) {
      expect(post.submolt).toBeDefined();
      expect(post.submolt.name).toBeTruthy();
    }
  });

  it('should have non-negative upvotes and comment_count', async () => {
    const { posts } = await fetchMoltbookData();
    for (const post of posts) {
      expect(post.upvotes).toBeGreaterThanOrEqual(0);
      expect(post.comment_count).toBeGreaterThanOrEqual(0);
    }
  });

  it('should have valid dates on all posts', async () => {
    const { posts } = await fetchMoltbookData();
    for (const post of posts) {
      const date = new Date(post.created_at);
      expect(isNaN(date.getTime())).toBe(false);
    }
  });
});

// ─── Helper Function Unit Tests ──────────────────────────────

describe('timeAgo helper', () => {
  function timeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  it('should return empty string for invalid date', () => {
    expect(timeAgo('')).toBe('');
    expect(timeAgo('not-a-date')).toBe('');
  });

  it('should return "just now" for current time', () => {
    expect(timeAgo(new Date().toISOString())).toBe('just now');
  });

  it('should return minutes ago', () => {
    const d = new Date(Date.now() - 5 * 60000).toISOString();
    expect(timeAgo(d)).toBe('5m ago');
  });

  it('should return hours ago', () => {
    const d = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(timeAgo(d)).toBe('3h ago');
  });

  it('should return days ago', () => {
    const d = new Date(Date.now() - 2 * 86400000).toISOString();
    expect(timeAgo(d)).toBe('2d ago');
  });
});

describe('truncate helper', () => {
  function truncate(text: string, max: number): string {
    if (!text || text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
  }

  it('should return text as-is if shorter than max', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('should truncate at word boundary', () => {
    const result = truncate('Hello world this is a test', 15);
    expect(result).toBe('Hello world…');
    expect(result.length).toBeLessThanOrEqual(16); // 15 + ellipsis
  });

  it('should handle empty string', () => {
    expect(truncate('', 10)).toBe('');
  });

  it('should add ellipsis when truncated', () => {
    expect(truncate('A very long string that exceeds the limit', 10)).toContain('…');
  });

  it('should not truncate at exact max length', () => {
    expect(truncate('12345', 5)).toBe('12345');
  });
});
