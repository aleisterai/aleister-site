/**
 * Unit tests for /api/bind — Device token binding logic.
 * All Stripe API calls are mocked via vi.spyOn(globalThis, 'fetch').
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: object): Request {
    return new Request('http://localhost/api/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

function mockFetch(responses: Array<{ ok: boolean; status?: number; data: object }>) {
    let call = 0;
    return vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
        const r = responses[Math.min(call++, responses.length - 1)];
        return {
            ok: r.ok,
            status: r.status ?? (r.ok ? 200 : 400),
            json: async () => r.data,
        } as Response;
    });
}

const COMPLETE_SESSION = {
    status: 'complete',
    payment_intent: 'pi_test_abc123',
    customer_details: { email: 'buyer@example.com' },
};

const INCOMPLETE_SESSION = {
    status: 'open',
    payment_intent: null,
    customer_details: null,
};

const PI_NO_TOKEN = { id: 'pi_test_abc123', metadata: {} };
const PI_WITH_TOKEN = { id: 'pi_test_abc123', metadata: { download_device: 'tok_EXISTING' } };

// ─── Import handler ───────────────────────────────────────────────────────────
// We import the POST handler after mocking env
let POST: (ctx: { request: Request }) => Promise<Response>;

beforeEach(async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_MOCK');
    // Dynamic import so env stub is applied before module evaluates import.meta.env
    ({ POST } = await import('../pages/api/bind.ts?t=' + Date.now()));
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('/api/bind — input validation', () => {
    it('returns 400 when session_id is missing', async () => {
        mockFetch([]);
        const res = await POST({ request: makeRequest({}) });
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/session_id/);
    });

    it('returns 400 for malformed JSON body', async () => {
        mockFetch([]);
        const req = new Request('http://localhost/api/bind', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: 'NOT JSON {{{',
        });
        const res = await POST({ request: req });
        expect(res.status).toBe(400);
    });
});

describe('/api/bind — Stripe session validation', () => {
    it('returns 402 when Stripe session fetch fails', async () => {
        mockFetch([{ ok: false, status: 404, data: { error: 'not found' } }]);
        const res = await POST({ request: makeRequest({ session_id: 'cs_bad' }) });
        expect(res.status).toBe(402);
    });

    it('returns 402 when session status is not complete', async () => {
        mockFetch([{ ok: true, data: INCOMPLETE_SESSION }]);
        const res = await POST({ request: makeRequest({ session_id: 'cs_open' }) });
        expect(res.status).toBe(402);
        const body = await res.json();
        expect(body.error).toMatch(/invalid session/i);
    });
});

describe('/api/bind — first-use token issuance', () => {
    it('issues a new UUID token on first bind', async () => {
        mockFetch([
            { ok: true, data: COMPLETE_SESSION },       // GET session
            { ok: true, data: PI_NO_TOKEN },             // GET payment_intent
            { ok: true, data: {} },                      // POST update metadata
        ]);

        const res = await POST({ request: makeRequest({ session_id: 'cs_first' }) });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.token).toBeDefined();
        expect(typeof body.token).toBe('string');
        expect(body.token).toMatch(/^[0-9a-f-]{36}$/); // UUID format
        expect(body.email).toBe('buyer@example.com');
    });

    it('token is different for each new session (uniqueness)', async () => {
        const tokens = new Set<string>();
        for (let i = 0; i < 10; i++) {
            mockFetch([
                { ok: true, data: COMPLETE_SESSION },
                { ok: true, data: PI_NO_TOKEN },
                { ok: true, data: {} },
            ]);
            const res = await POST({ request: makeRequest({ session_id: `cs_session_${i}` }) });
            const body = await res.json();
            tokens.add(body.token);
        }
        expect(tokens.size).toBe(10); // All unique
    });
});

describe('/api/bind — same-device re-issue', () => {
    it('returns the stored token when correct device_token is presented', async () => {
        mockFetch([
            { ok: true, data: COMPLETE_SESSION },
            { ok: true, data: PI_WITH_TOKEN },
        ]);

        const res = await POST({
            request: makeRequest({ session_id: 'cs_returning', device_token: 'tok_EXISTING' }),
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.token).toBe('tok_EXISTING');
    });
});

describe('/api/bind — claimed by another device', () => {
    it('returns 409 when a different device_token is presented', async () => {
        mockFetch([
            { ok: true, data: COMPLETE_SESSION },
            { ok: true, data: PI_WITH_TOKEN },
        ]);

        const res = await POST({
            request: makeRequest({ session_id: 'cs_claimed', device_token: 'tok_WRONG_DEVICE' }),
        });
        expect(res.status).toBe(409);
        const body = await res.json();
        expect(body.error).toBe('claimed');
        expect(body.message).toContain('another device');
    });

    it('returns 409 when no device_token is presented and token is already claimed', async () => {
        mockFetch([
            { ok: true, data: COMPLETE_SESSION },
            { ok: true, data: PI_WITH_TOKEN },
        ]);

        const res = await POST({ request: makeRequest({ session_id: 'cs_claimed_no_dt' }) });
        expect(res.status).toBe(409);
    });
});

describe('/api/bind — email recovery', () => {
    it('re-issues a new token when correct purchase email is provided', async () => {
        mockFetch([
            { ok: true, data: COMPLETE_SESSION },
            { ok: true, data: PI_WITH_TOKEN },
            { ok: true, data: {} }, // update metadata
        ]);

        const res = await POST({
            request: makeRequest({
                session_id: 'cs_recover',
                email: 'buyer@example.com', // matches COMPLETE_SESSION.customer_details.email
            }),
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.token).toBeDefined();
        expect(body.token).not.toBe('tok_EXISTING'); // New token generated
        expect(body.recovered).toBe(true);
    });

    it('returns 409 for wrong recovery email', async () => {
        mockFetch([
            { ok: true, data: COMPLETE_SESSION },
            { ok: true, data: PI_WITH_TOKEN },
        ]);

        const res = await POST({
            request: makeRequest({
                session_id: 'cs_recover_fail',
                email: 'attacker@evil.com',
            }),
        });
        expect(res.status).toBe(409);
    });

    it('email comparison is case-insensitive', async () => {
        mockFetch([
            { ok: true, data: COMPLETE_SESSION },
            { ok: true, data: PI_WITH_TOKEN },
            { ok: true, data: {} },
        ]);

        const res = await POST({
            request: makeRequest({
                session_id: 'cs_case_email',
                email: 'BUYER@EXAMPLE.COM', // uppercase
            }),
        });
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.recovered).toBe(true);
    });
});

describe('/api/bind — edge case: no payment_intent', () => {
    it('returns an ephemeral token when session has no payment_intent', async () => {
        const sessionNoPI = { ...COMPLETE_SESSION, payment_intent: null };
        mockFetch([{ ok: true, data: sessionNoPI }]);

        const res = await POST({ request: makeRequest({ session_id: 'cs_no_pi' }) });
        // Should still succeed (edge case — e.g. free checkout)
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.token).toBeDefined();
    });
});
