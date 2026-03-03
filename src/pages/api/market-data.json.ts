import type { APIRoute } from 'astro';

const GECKO_POOL = "0xc12fb6d8757ae63623c4e9478fcd194a7e89ed97bbd88ceeb1a68fd1ab9c3e0d";

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/base/pools/${GECKO_POOL}`,
      {
        headers: {
          'User-Agent': 'AleisterDashboard/1.0',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`GeckoTerminal API error: ${response.status}`);
    }
    
    const data = await response.json();
    const attrs = data?.data?.attributes || {};
    
    const marketData = {
      marketCap: parseFloat(attrs.market_cap_usd || attrs.fdv_usd || '0'),
      price: parseFloat(attrs.base_token_price_usd || '0'),
      change24h: parseFloat(attrs.price_change_percentage?.h24 || '0'),
      liquidity: parseFloat(attrs.reserve_in_usd || '0'),
      volume24h: parseFloat(attrs.volume_usd?.h24 || '0'),
      timestamp: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      ...marketData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    
    // Return fallback data
    const fallbackData = {
      success: false,
      marketCap: 0,
      price: 0,
      change24h: 0,
      liquidity: 0,
      volume24h: 0,
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch market data'
    };
    
    return new Response(JSON.stringify(fallbackData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};