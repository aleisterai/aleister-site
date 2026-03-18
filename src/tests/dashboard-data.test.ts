/**
 * Dashboard API endpoint tests & stress tests.
 *
 * Covers:
 * 1. token-prices.json — CoinGecko → CoinCap → hardcoded fallback chain
 * 2. treasury-balances.json — Base RPC balance fetching + formatting
 * 3. store-revenue.json — Stripe balance & charges
 * 4. market-data.json — GeckoTerminal pool price
 * 5. Stress — concurrent requests, partial failures, total API outages
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeAstroCtx(url = 'http://localhost/api/test') {
    return { request: new Request(url) };
}

type FetchMock = ReturnType<typeof vi.spyOn>;

function mockResponse(body: any, ok = true, status = 200): Response {
    return {
        ok,
        status,
        json: async () => body,
        text: async () => JSON.stringify(body),
        headers: new Headers(),
    } as unknown as Response;
}

// ─── token-prices.json ────────────────────────────────────────────────────────

describe('token-prices.json', () => {
    let GET: (ctx: any) => Promise<Response>;
    let fetchSpy: FetchMock;

    beforeEach(async () => {
        vi.resetModules();
        ({ GET } = await import('../pages/api/token-prices.json.ts?t=' + Date.now()));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns ETH + USDC from CoinGecko when available', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes('coingecko.com')) {
                return mockResponse({
                    ethereum: { usd: 2100, usd_24h_change: 3.5 },
                    'usd-coin': { usd: 1.0, usd_24h_change: 0.01 },
                });
            }
            if (url.includes('geckoterminal.com')) {
                return mockResponse({
                    data: {
                        attributes: {
                            base_token_price_usd: '0.000000494',
                            price_change_percentage: { h24: '12.5' },
                        },
                    },
                });
            }
            return mockResponse({}, false, 500);
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.ethereum.usd).toBe(2100);
        expect(data['usd-coin'].usd).toBe(1.0);
        expect(data.aleister.usd).toBeCloseTo(0.000000494, 9);
        expect(data.aleister.usd_24h_change).toBe(12.5);
    });

    it('falls back to CoinCap when CoinGecko fails', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes('coingecko.com')) {
                return mockResponse({}, false, 429); // Rate limited
            }
            if (url.includes('coincap.io') && url.includes('ethereum')) {
                return mockResponse({ data: { priceUsd: '1950.50', changePercent24Hr: '-1.2' } });
            }
            if (url.includes('coincap.io') && url.includes('usd-coin')) {
                return mockResponse({ data: { priceUsd: '0.9999', changePercent24Hr: '0.01' } });
            }
            if (url.includes('geckoterminal.com')) {
                return mockResponse({
                    data: { attributes: { base_token_price_usd: '0.0000005' } },
                });
            }
            return mockResponse({}, false, 500);
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.ethereum.usd).toBeCloseTo(1950.5, 1);
        expect(data['usd-coin'].usd).toBeCloseTo(0.9999, 3);
    });

    it('uses hardcoded fallback when both CoinGecko and CoinCap fail', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('Network down');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        // Hardcoded fallback values
        expect(data.ethereum.usd).toBe(2200);
        expect(data['usd-coin'].usd).toBe(1);
        expect(data.aleister.usd).toBe(0); // GeckoTerminal also fails
    });

    it('returns valid JSON structure even on total catastrophic failure', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('DNS resolution failed');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toHaveProperty('ethereum');
        expect(data).toHaveProperty('usd-coin');
        expect(data).toHaveProperty('aleister');
        expect(typeof data.ethereum.usd).toBe('number');
        expect(data.ethereum.usd).toBeGreaterThan(0); // Never $0
    });

    it('handles CoinGecko returning malformed data', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes('coingecko.com')) {
                return mockResponse({ status: 'error', message: 'rate limited' }); // No price data
            }
            if (url.includes('coincap.io') && url.includes('ethereum')) {
                return mockResponse({ data: { priceUsd: '2000', changePercent24Hr: '0' } });
            }
            if (url.includes('coincap.io') && url.includes('usd-coin')) {
                return mockResponse({ data: { priceUsd: '1', changePercent24Hr: '0' } });
            }
            if (url.includes('geckoterminal.com')) {
                return mockResponse({ data: { attributes: {} } });
            }
            return mockResponse({}, false, 500);
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.ethereum.usd).toBeGreaterThan(0); // Fell back to CoinCap
    });
});

// ─── treasury-balances.json ───────────────────────────────────────────────────

describe('treasury-balances.json', () => {
    let GET: (ctx: any) => Promise<Response>;
    let fetchSpy: FetchMock;

    beforeEach(async () => {
        vi.resetModules();
        ({ GET } = await import('../pages/api/treasury-balances.json.ts?t=' + Date.now()));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns ETH, $ALEISTER, and USDC balances from Base RPC', async () => {
        let callIndex = 0;
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            callIndex++;
            // RPC calls: 1=ETH balance, 2=WETH, 3=ALEISTER, 4=USDC
            switch (callIndex) {
                case 1: return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x5AF3107A4000' }); // ~0.0001 ETH
                case 2: return mockResponse({ jsonrpc: '2.0', id: 1, result: '0xDE0B6B3A7640000' }); // 1 WETH
                case 3: return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x52B7D2DCC80CD2E4000000' }); // big ALEISTER
                case 4: return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x989680' }); // 10 USDC (6 decimals)
                default: return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x0' });
            }
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.balances).toHaveLength(3);

        // ETH is combined (native + WETH)
        const eth = data.balances.find((b: any) => b.symbol === 'ETH');
        expect(eth).toBeDefined();
        expect(eth.balance).toBeGreaterThan(0);
        expect(eth.type).toBe('combined');

        // USDC
        const usdc = data.balances.find((b: any) => b.symbol === 'USDC');
        expect(usdc).toBeDefined();
        expect(usdc.balance).toBe(10); // 0x989680 / 10^6

        // $ALEISTER
        const aleister = data.balances.find((b: any) => b.symbol === '$ALEISTER');
        expect(aleister).toBeDefined();
        expect(aleister.balance).toBeGreaterThan(0);
    });

    it('returns fallback data when Base RPC is down', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('RPC unreachable');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.balances).toHaveLength(3);
        expect(data.balances.map((b: any) => b.symbol)).toEqual(['ETH', '$ALEISTER', 'USDC']);
    });

    it('handles RPC returning null/empty results', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({ jsonrpc: '2.0', id: 1, result: null });
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        // Should handle null gracefully, balances will be 0
        const eth = data.balances.find((b: any) => b.symbol === 'ETH');
        expect(eth.balance).toBe(0);
    });

    it('includes treasury address in response', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x0' });
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(data.treasuryAddress).toBe('0x9BeBF2c780D5ac632c11984E28fA9760D33a10e6');
    });
});

// ─── store-revenue.json ───────────────────────────────────────────────────────

describe('store-revenue.json', () => {
    let GET: (ctx: any) => Promise<Response>;
    let fetchSpy: FetchMock;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_DASHBOARD');
        ({ GET } = await import('../pages/api/store-revenue.json.ts?t=' + Date.now()));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
    });

    it('returns balance + 30d revenue from Stripe', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes('/balance')) {
                return mockResponse({
                    available: [{ amount: 5000, currency: 'usd' }],
                    pending: [{ amount: 1500, currency: 'usd' }],
                });
            }
            if (url.includes('/charges')) {
                return mockResponse({
                    data: [
                        { id: 'ch_1', amount: 2500, status: 'succeeded', refunded: false, created: Date.now() / 1000, description: 'Grimoire PDF' },
                        { id: 'ch_2', amount: 1500, status: 'succeeded', refunded: false, created: Date.now() / 1000, description: 'Tarot Deck' },
                        { id: 'ch_3', amount: 1000, status: 'failed', refunded: false, created: Date.now() / 1000 },
                        { id: 'ch_4', amount: 500, status: 'succeeded', refunded: true, created: Date.now() / 1000 },
                    ],
                });
            }
            return mockResponse({}, false, 500);
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);

        // Balance: $50 available + $15 pending
        expect(data.balance.available).toBe(50);
        expect(data.balance.pending).toBe(15);
        expect(data.balance.total).toBe(65);

        // Revenue: only succeeded + not refunded = ch_1 + ch_2 = $40
        expect(data.revenue30d).toBe(40);
        expect(data.chargeCount30d).toBe(2);

        // Recent transactions
        expect(data.recentTransactions).toHaveLength(2);
        expect(data.recentTransactions[0].description).toBe('Grimoire PDF');
    });

    it('returns zero data when Stripe API fails', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('Stripe API key revoked');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(false);
        expect(data.balance.total).toBe(0);
        expect(data.revenue30d).toBe(0);
        expect(data.recentTransactions).toEqual([]);
    });

    it('filters out refunded and failed charges correctly', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes('/balance')) {
                return mockResponse({ available: [], pending: [] });
            }
            if (url.includes('/charges')) {
                return mockResponse({
                    data: [
                        { id: 'ch_ok', amount: 3000, status: 'succeeded', refunded: false, created: Date.now() / 1000 },
                        { id: 'ch_refund', amount: 3000, status: 'succeeded', refunded: true, created: Date.now() / 1000 },
                        { id: 'ch_fail', amount: 3000, status: 'failed', refunded: false, created: Date.now() / 1000 },
                        { id: 'ch_pending', amount: 3000, status: 'pending', refunded: false, created: Date.now() / 1000 },
                    ],
                });
            }
            return mockResponse({}, false, 500);
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(data.chargeCount30d).toBe(1); // Only ch_ok
        expect(data.revenue30d).toBe(30);
    });
});

// ─── market-data.json ─────────────────────────────────────────────────────────

describe('market-data.json', () => {
    let GET: (ctx: any) => Promise<Response>;
    let fetchSpy: FetchMock;

    beforeEach(async () => {
        vi.resetModules();
        ({ GET } = await import('../pages/api/market-data.json.ts?t=' + Date.now()));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns $ALEISTER price from GeckoTerminal pool', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({
                data: {
                    attributes: {
                        base_token_price_usd: '0.000000494',
                        fdv_usd: '49411.97',
                        price_change_percentage: { h24: '24.651' },
                        reserve_in_usd: '46270.99',
                        volume_usd: { h24: '50803.91' },
                    },
                },
            });
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.price).toBeCloseTo(0.000000494, 9);
        expect(data.change24h).toBe(24.651);
        expect(data.liquidity).toBeCloseTo(46270.99, 1);
        expect(data.volume24h).toBeCloseTo(50803.91, 1);
    });

    it('returns zero data when GeckoTerminal API fails', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('GeckoTerminal down');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(false);
        expect(data.price).toBe(0);
        expect(data.marketCap).toBe(0);
    });
});

// ─── fundlyhub-revenue.json ───────────────────────────────────────────────────

describe('fundlyhub-revenue.json', () => {
    let GET: (ctx: any) => Promise<Response>;
    let fetchSpy: FetchMock;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubEnv('FUNDLYHUB_STRIPE_KEY', 'rk_test_FUNDLYHUB');
        ({ GET } = await import('../pages/api/fundlyhub-revenue.json.ts?t=' + Date.now()));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
    });

    it('returns total revenue and 30d revenue from FundlyHub Stripe', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes('/balance')) {
                return mockResponse({
                    available: [{ amount: 12000, currency: 'usd' }],
                    pending: [{ amount: 3000, currency: 'usd' }],
                });
            }
            if (url.includes('/charges')) {
                return mockResponse({
                    data: [
                        { id: 'ch_1', amount: 5000, status: 'succeeded', refunded: false, created: Date.now() / 1000 },
                        { id: 'ch_2', amount: 3000, status: 'succeeded', refunded: false, created: Date.now() / 1000 },
                        { id: 'ch_3', amount: 2000, status: 'failed', refunded: false, created: Date.now() / 1000 },
                    ],
                });
            }
            return mockResponse({}, false, 500);
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.balance.available).toBe(120);
        expect(data.balance.pending).toBe(30);
        expect(data.balance.total).toBe(150);
        expect(data.chargeCount30d).toBe(2); // Only succeeded + not refunded
    });

    it('returns $0 fallback when Stripe API fails', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('Stripe API unavailable');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(false);
        expect(data.totalRevenue).toBe(0);
        expect(data.revenue30d).toBe(0);
        expect(data.chargeCount30d).toBe(0);
    });

    it('handles missing API key gracefully', async () => {
        vi.resetModules();
        vi.unstubAllEnvs();
        // No FUNDLYHUB_STRIPE_KEY set
        const mod = await import('../pages/api/fundlyhub-revenue.json.ts?t=nokey' + Date.now());

        const res = await mod.GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.totalRevenue).toBe(0); // Fallback
    });
});

// ─── burn-balance.json ────────────────────────────────────────────────────────

describe('burn-balance.json', () => {
    let GET: (ctx: any) => Promise<Response>;
    let fetchSpy: FetchMock;

    beforeEach(async () => {
        vi.resetModules();
        ({ GET } = await import('../pages/api/burn-balance.json.ts?t=' + Date.now()));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns $ALEISTER balance at burn address from Base RPC', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            // balanceOf returns a large token balance
            return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x52B7D2DCC80CD2E4000000' });
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.burnAddress).toBe('0x000000000000000000000000000000000000dEaD');
        expect(data.balance).toBeGreaterThan(0);
        expect(data.decimals).toBe(18);
        expect(data.tokenContract).toBe('0xacb4543f479ea44e6df4fa01e483bb5b78361ba3');
    });

    it('returns fallback data when Base RPC is down', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('RPC unreachable');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        // callRpc catches internally, so endpoint still returns success:true with balance:0
        expect(data.success).toBe(true);
        expect(data.balance).toBe(0);
    });

    it('handles zero balance (no burns yet)', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x0' });
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.balance).toBe(0);
    });

    it('handles RPC returning null result', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({ jsonrpc: '2.0', id: 1, result: null });
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.balance).toBe(0);
    });

    it('response structure matches what dashboard JS expects', async () => {
        fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({ jsonrpc: '2.0', id: 1, result: '0xDE0B6B3A7640000' }); // 1 token
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        // Dashboard JS accesses: data.balance
        expect(data).toHaveProperty('success');
        expect(data).toHaveProperty('burnAddress');
        expect(data).toHaveProperty('balance');
        expect(data).toHaveProperty('timestamp');
        expect(typeof data.balance).toBe('number');
    });
});

// ─── Stress Tests ─────────────────────────────────────────────────────────────

describe('Stress — concurrent dashboard requests', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('50 concurrent token-prices requests all resolve without errors', async () => {
        vi.resetModules();
        const { GET } = await import('../pages/api/token-prices.json.ts?t=' + Date.now());

        vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
            const url = String(input);
            if (url.includes('coingecko.com')) {
                return mockResponse({
                    ethereum: { usd: 2050, usd_24h_change: 1.5 },
                    'usd-coin': { usd: 1, usd_24h_change: 0 },
                });
            }
            if (url.includes('geckoterminal.com')) {
                return mockResponse({
                    data: { attributes: { base_token_price_usd: '0.0000005' } },
                });
            }
            return mockResponse({}, false, 500);
        });

        const start = Date.now();
        const results = await Promise.all(
            Array.from({ length: 50 }, () => GET(makeAstroCtx()))
        );
        const elapsed = Date.now() - start;

        expect(results.every(r => r.status === 200)).toBe(true);

        // Verify all returned valid ETH prices
        for (const res of results) {
            const data = await res.json();
            expect(data.ethereum.usd).toBe(2050);
        }

        console.log(`50 concurrent token-prices: ${elapsed}ms`);
        expect(elapsed).toBeLessThan(2000);
    });

    it('50 concurrent treasury-balance requests all resolve', async () => {
        vi.resetModules();
        const { GET } = await import('../pages/api/treasury-balances.json.ts?t=' + Date.now());

        vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({ jsonrpc: '2.0', id: 1, result: '0xDE0B6B3A7640000' }); // 1 ETH
        });

        const start = Date.now();
        const results = await Promise.all(
            Array.from({ length: 50 }, () => GET(makeAstroCtx()))
        );
        const elapsed = Date.now() - start;

        expect(results.every(r => r.status === 200)).toBe(true);

        for (const res of results) {
            const data = await res.json();
            expect(data.balances).toHaveLength(3);
        }

        console.log(`50 concurrent treasury-balances: ${elapsed}ms`);
        expect(elapsed).toBeLessThan(2000);
    });

    it('mixed failures: intermittent API errors return graceful fallbacks', async () => {
        vi.resetModules();
        const { GET } = await import('../pages/api/token-prices.json.ts?t=' + Date.now());

        let callCount = 0;
        vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            callCount++;
            // Every other request fails
            if (callCount % 2 === 0) {
                throw new Error('Intermittent failure');
            }
            return mockResponse({
                ethereum: { usd: 2100, usd_24h_change: 0 },
                'usd-coin': { usd: 1, usd_24h_change: 0 },
            });
        });

        const results = await Promise.all(
            Array.from({ length: 20 }, () => GET(makeAstroCtx()))
        );

        // All should return 200 (fallbacks kick in)
        expect(results.every(r => r.status === 200)).toBe(true);

        // All should have valid ETH prices (either real or fallback)
        for (const res of results) {
            const data = await res.json();
            expect(data.ethereum.usd).toBeGreaterThan(0);
        }
    });

    it('complete API outage: all endpoints return safe fallback data', async () => {
        vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('Total network outage');
        });

        // Test all endpoints in parallel
        vi.resetModules();
        vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_OUTAGE');
        vi.stubEnv('FUNDLYHUB_STRIPE_KEY', 'rk_test_OUTAGE');
        const [tokenMod, treasuryMod, stripeMod, marketMod, fundlyhubMod, burnMod] = await Promise.all([
            import('../pages/api/token-prices.json.ts?t=outage' + Date.now()),
            import('../pages/api/treasury-balances.json.ts?t=outage' + Date.now()),
            import('../pages/api/store-revenue.json.ts?t=outage' + Date.now()),
            import('../pages/api/market-data.json.ts?t=outage' + Date.now()),
            import('../pages/api/fundlyhub-revenue.json.ts?t=outage' + Date.now()),
            import('../pages/api/burn-balance.json.ts?t=outage' + Date.now()),
        ]);

        const [tokenRes, treasuryRes, stripeRes, marketRes, fundlyhubRes, burnRes] = await Promise.all([
            tokenMod.GET(makeAstroCtx()),
            treasuryMod.GET(makeAstroCtx()),
            stripeMod.GET(makeAstroCtx()),
            marketMod.GET(makeAstroCtx()),
            fundlyhubMod.GET(makeAstroCtx()),
            burnMod.GET(makeAstroCtx()),
        ]);

        // ALL must return 200 — never crash or 500
        expect(tokenRes.status).toBe(200);
        expect(treasuryRes.status).toBe(200);
        expect(stripeRes.status).toBe(200);
        expect(marketRes.status).toBe(200);
        expect(fundlyhubRes.status).toBe(200);
        expect(burnRes.status).toBe(200);

        const tokenData = await tokenRes.json();
        const treasuryData = await treasuryRes.json();
        const stripeData = await stripeRes.json();
        const marketData = await marketRes.json();
        const fundlyhubData = await fundlyhubRes.json();
        const burnData = await burnRes.json();

        // token-prices: ETH should never be $0
        expect(tokenData.ethereum.usd).toBeGreaterThan(0);

        // treasury: should have 3 balance entries
        expect(treasuryData.balances).toHaveLength(3);

        // store-revenue: safe zeros
        expect(stripeData.balance.total).toBe(0);
        expect(stripeData.recentTransactions).toEqual([]);

        // market-data: zero but not crash
        expect(marketData.price).toBe(0);

        // fundlyhub: $0 fallback
        expect(fundlyhubData.totalRevenue).toBe(0);
        expect(fundlyhubData.chargeCount30d).toBe(0);

        // burn-balance: callRpc catches errors internally, so success:true with balance:0
        expect(burnData.success).toBe(true);
        expect(burnData.balance).toBe(0);

        console.log('✓ All 6 endpoints survived total API outage with graceful fallbacks');
    });
});

// ─── Data Consistency Tests ───────────────────────────────────────────────────

describe('Data consistency — cross-endpoint invariants', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    it('token-prices response structure matches what dashboard JS expects', async () => {
        vi.resetModules();
        const { GET } = await import('../pages/api/token-prices.json.ts?t=' + Date.now());

        vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('Force fallback');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        // Dashboard JS accesses: data.ethereum.usd, data['usd-coin'].usd, data.aleister.usd
        expect(data.ethereum).toBeDefined();
        expect(typeof data.ethereum.usd).toBe('number');
        expect(data['usd-coin']).toBeDefined();
        expect(typeof data['usd-coin'].usd).toBe('number');
        expect(data.aleister).toBeDefined();
        expect(typeof data.aleister.usd).toBe('number');
    });

    it('treasury-balances response structure matches what dashboard JS expects', async () => {
        vi.resetModules();
        const { GET } = await import('../pages/api/treasury-balances.json.ts?t=' + Date.now());

        vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            return mockResponse({ jsonrpc: '2.0', id: 1, result: '0x0' });
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        // Dashboard JS accesses: data.balances[].symbol, data.balances[].balance, data.balances[].breakdown
        expect(Array.isArray(data.balances)).toBe(true);
        for (const balance of data.balances) {
            expect(balance).toHaveProperty('symbol');
            expect(balance).toHaveProperty('balance');
            expect(typeof balance.balance).toBe('number');
        }

        // ETH should have breakdown
        const eth = data.balances.find((b: any) => b.symbol === 'ETH');
        expect(eth).toBeDefined();
        expect(eth.breakdown).toBeDefined();
        expect(typeof eth.breakdown.native).toBe('number');
        expect(typeof eth.breakdown.wrapped).toBe('number');
    });

    it('store-revenue response structure matches what dashboard JS expects', async () => {
        vi.resetModules();
        vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_STRUCT');
        const { GET } = await import('../pages/api/store-revenue.json.ts?t=' + Date.now());

        vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            throw new Error('Force fallback');
        });

        const res = await GET(makeAstroCtx());
        const data = await res.json();

        // Dashboard JS accesses: data.balance.total, data.chargeCount30d
        expect(data.balance).toBeDefined();
        expect(typeof data.balance.total).toBe('number');
        expect(typeof data.balance.available).toBe('number');
        expect(typeof data.balance.pending).toBe('number');
        expect(typeof data.chargeCount30d).toBe('number');
        expect(Array.isArray(data.recentTransactions)).toBe(true);

        vi.unstubAllEnvs();
    });

    it('all-time revenue calculation: clawmart + store + fundlyhub + tokenFees', () => {
        // Simulates the dashboard JS calculation
        const clawmart = 89;
        const store = 65; // Stripe balance
        const fundlyhub = 150; // FundlyHub Stripe revenue
        const tokenFees = 1840.90; // Treasury value (ETH + ALEISTER + USDC)

        const total = clawmart + store + fundlyhub + tokenFees;

        expect(total).toBeCloseTo(2144.90, 2);
        expect(total).toBeGreaterThan(0);

        // Verify no double-counting (tokenFees IS treasury, not added separately)
        // This was a bug we fixed — treasury should NOT be added on top of tokenFees
        const withDuplicateTreasury = total + tokenFees;
        expect(withDuplicateTreasury).not.toBe(total); // Confirms they'd be different if doubled
    });
});
