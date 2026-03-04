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

    // $ALEISTER token: fetch from our market-data endpoint or use 0
    try {
      const marketResponse = await fetch(new URL('/api/market-data.json', request.url).toString(), {
        signal: AbortSignal.timeout(3000),
      });
      if (marketResponse.ok) {
        const marketData = await marketResponse.json();
        data.aleister = {
          usd: marketData.price || 0,
          usd_24h_change: marketData.change24h || 0,
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