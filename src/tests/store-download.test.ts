/**
 * Unit tests for /api/download — Device-verified file download.
 * Mocks: Stripe API (fetch), node:fs (existsSync + readFileSync).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(params: Record<string, string | undefined>): Request {
    const url = new URL('http://localhost/api/download');
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) url.searchParams.set(k, v);
    }
    return new Request(url.toString());
}

function mockStripe(sessionData: object, piData?: object) {
    let call = 0;
    return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
        const url = String(input);
        if (url.includes('/checkout/sessions/')) {
            return { ok: true, status: 200, json: async () => sessionData } as Response;
        }
        if (url.includes('/payment_intents/')) {
            return { ok: true, status: 200, json: async () => piData ?? {} } as Response;
        }
        return { ok: false, status: 500, json: async () => ({}) } as Response;
    });
}

const COMPLETE_SESSION = {
    status: 'complete',
    payment_intent: 'pi_test_dl123',
    customer_details: { email: 'buyer@example.com' },
};

const PI_WITH_TOKEN = {
    id: 'pi_test_dl123',
    metadata: { download_device: 'tok_DEVICE_VALID' },
};

const FAKE_ZIP = Buffer.from('PK\x03\x04FakeZipContent');

let GET: (ctx: { request: Request }) => Promise<Response>;

beforeEach(async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_MOCK');

    // Mock fs so we don't need real zip files on disk during tests
    vi.mock('node:fs', () => ({
        existsSync: (path: string) => path.includes('humanizer') || path.includes('cipher'),
        readFileSync: () => FAKE_ZIP,
    }));

    ({ GET } = await import('../pages/api/download.ts?t=' + Date.now()));
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.resetModules();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('/api/download — input validation', () => {
    it('returns 400 when session_id is missing', async () => {
        const res = await GET({
            request: makeRequest({ slug: 'humanizer', dt: 'tok_DEVICE_VALID' }),
        });
        expect(res.status).toBe(400);
    });

    it('returns 400 when slug is missing', async () => {
        const res = await GET({
            request: makeRequest({ session_id: 'cs_test', dt: 'tok_DEVICE_VALID' }),
        });
        expect(res.status).toBe(400);
    });

    it('returns 400 when device token (dt) is missing', async () => {
        const res = await GET({
            request: makeRequest({ session_id: 'cs_test', slug: 'humanizer' }),
        });
        expect(res.status).toBe(400);
    });

    it('returns 400 when slug is not in VALID_SLUGS', async () => {
        const res = await GET({
            request: makeRequest({ session_id: 'cs_test', slug: 'malware.exe', dt: 'tok_X' }),
        });
        expect(res.status).toBe(400);
    });
});

describe('/api/download — Stripe verification', () => {
    it('returns 403 when Stripe session fetch fails', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({}),
        } as Response);

        const res = await GET({
            request: makeRequest({ session_id: 'cs_bad', slug: 'humanizer', dt: 'tok_X' }),
        });
        expect(res.status).toBe(403);
    });

    it('returns 403 when payment is incomplete', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ status: 'open', payment_intent: null }),
        } as Response);

        const res = await GET({
            request: makeRequest({ session_id: 'cs_open', slug: 'humanizer', dt: 'tok_X' }),
        });
        expect(res.status).toBe(403);
    });

    it('returns 403 when no device token is bound in Stripe metadata', async () => {
        mockStripe(COMPLETE_SESSION, { id: 'pi_test_dl123', metadata: {} });

        const res = await GET({
            request: makeRequest({ session_id: 'cs_test', slug: 'humanizer', dt: 'tok_ANY' }),
        });
        expect(res.status).toBe(403);
        const text = await res.text();
        expect(text).toMatch(/device not bound/i);
    });

    it('returns 403 when device token does not match stored token', async () => {
        mockStripe(COMPLETE_SESSION, PI_WITH_TOKEN);

        const res = await GET({
            request: makeRequest({ session_id: 'cs_test', slug: 'humanizer', dt: 'tok_WRONG' }),
        });
        expect(res.status).toBe(403);
        const text = await res.text();
        expect(text).toMatch(/device mismatch/i);
    });
});

describe('/api/download — successful download', () => {
    it('returns 200 with zip content for valid session + device token', async () => {
        mockStripe(COMPLETE_SESSION, PI_WITH_TOKEN);

        const res = await GET({
            request: makeRequest({
                session_id: 'cs_valid',
                slug: 'humanizer',
                dt: 'tok_DEVICE_VALID',
            }),
        });
        expect(res.status).toBe(200);
        expect(res.headers.get('Content-Type')).toBe('application/zip');
        expect(res.headers.get('Content-Disposition')).toBe('attachment; filename="humanizer.zip"');
        expect(res.headers.get('Cache-Control')).toBe('no-store');

        const buf = await res.arrayBuffer();
        expect(buf.byteLength).toBeGreaterThan(0);
    });

    it('Content-Disposition filename matches the slug', async () => {
        mockStripe(COMPLETE_SESSION, { ...PI_WITH_TOKEN, metadata: { download_device: 'tok_DEVICE_VALID' } });

        const res = await GET({
            request: makeRequest({
                session_id: 'cs_valid',
                slug: 'cipher',
                dt: 'tok_DEVICE_VALID',
            }),
        });
        expect(res.status).toBe(200);
        expect(res.headers.get('Content-Disposition')).toContain('cipher.zip');
    });

    it('returns correct Content-Length header', async () => {
        mockStripe(COMPLETE_SESSION, PI_WITH_TOKEN);

        const res = await GET({
            request: makeRequest({ session_id: 'cs_valid', slug: 'humanizer', dt: 'tok_DEVICE_VALID' }),
        });
        const length = parseInt(res.headers.get('Content-Length') ?? '0', 10);
        expect(length).toBe(FAKE_ZIP.length);
    });
});

describe('/api/download — file not found', () => {
    it('returns 404 when zip file does not exist on disk', async () => {
        mockStripe(COMPLETE_SESSION, PI_WITH_TOKEN);

        // 'rally' is valid slug but our mock fs only has humanizer/cipher
        const res = await GET({
            request: makeRequest({ session_id: 'cs_valid', slug: 'rally', dt: 'tok_DEVICE_VALID' }),
        });
        expect(res.status).toBe(404);
    });
});

describe('/api/download — security: path traversal', () => {
    it('rejects slug with path traversal attempt', async () => {
        const res = await GET({
            request: makeRequest({
                session_id: 'cs_test',
                slug: '../../../etc/passwd',
                dt: 'tok_X',
            }),
        });
        expect(res.status).toBe(400); // VALID_SLUGS check blocks this
    });

    it('rejects absolute path slug', async () => {
        const res = await GET({
            request: makeRequest({ session_id: 'cs_test', slug: '/etc/shadow', dt: 'tok_X' }),
        });
        expect(res.status).toBe(400);
    });
});
