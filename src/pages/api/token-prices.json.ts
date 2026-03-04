import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Only fetch tokens that actually exist on CoinGecko
    // 'aleister' is NOT on CoinGecko — handle separately
    const cgIds = 'ethereum,usd-coin';

    let data: Record<string, any> = {};
    let fetched = false;

    // Attempt 1: CoinGecko free API
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24h_change=true`,
        {
          headers: {
            'User-Agent': 'AleisterDashboard/1.0',
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      if (response.ok) {
        data = await response.json();
        if (data.ethereum?.usd) fetched = true;
      }
    } catch (_) {
      // CoinGecko rate-limited or down
    }

    // Attempt 2: Fallback price source (CoinCap)
    if (!fetched) {
      try {
        const [ethRes, usdcRes] = await Promise.all([
          fetch('https://api.coincap.io/v2/assets/ethereum', { signal: AbortSignal.timeout(5000) }),
          fetch('https://api.coincap.io/v2/assets/usd-coin', { signal: AbortSignal.timeout(5000) }),
        ]);
        const [ethData, usdcData] = await Promise.all([ethRes.json(), usdcRes.json()]);

        data.ethereum = {
          usd: parseFloat(ethData?.data?.priceUsd || '0'),
          usd_24h_change: parseFloat(ethData?.data?.changePercent24Hr || '0'),
        };
        data['usd-coin'] = {
          usd: parseFloat(usdcData?.data?.priceUsd || '1'),
          usd_24h_change: parseFloat(usdcData?.data?.changePercent24Hr || '0'),
        };
        if (data.ethereum.usd > 0) fetched = true;
      } catch (_) {
        // CoinCap also down — use hardcoded last-known
      }
    }

    // Attempt 3: Hardcoded fallback (better than $0)
    if (!fetched) {
      data.ethereum = { usd: 2200, usd_24h_change: 0 };
      data['usd-coin'] = { usd: 1, usd_24h_change: 0 };
    }

    // $ALEISTER token: fetch price directly from GeckoTerminal (Base DEX pool)
    // Cannot self-fetch /api/market-data.json on Vercel serverless — call GeckoTerminal directly
    const GECKO_POOL = '0xc12fb6d8757ae63623c4e9478fcd194a7e89ed97bbd88ceeb1a68fd1ab9c3e0d';
    try {
      const poolRes = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/base/pools/${GECKO_POOL}`,
        { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(5000) }
      );
      if (poolRes.ok) {
        const poolData = await poolRes.json();
        const attrs = poolData?.data?.attributes || {};
        data.aleister = {
          usd: parseFloat(attrs.base_token_price_usd || '0'),
          usd_24h_change: parseFloat(attrs.price_change_percentage?.h24 || '0'),
        };
      } else {
        data.aleister = { usd: 0, usd_24h_change: 0 };
      }
    } catch (_) {
      data.aleister = { usd: 0, usd_24h_change: 0 };
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching token prices:', error);

    return new Response(JSON.stringify({
      aleister: { usd: 0, usd_24h_change: 0 },
      ethereum: { usd: 2200, usd_24h_change: 0 },
      'usd-coin': { usd: 1, usd_24h_change: 0 },
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};