import type { APIRoute } from 'astro';

const BASE_RPC_URL = "https://mainnet.base.org";

// Known buyback transactions: WETH → $ALEISTER swaps from Safe wallet
const BUYBACK_TXS = [
  {
    hash: "0x0cd39b0bb2d752bafef290a759bb8bce1e5b5b34948bdeac8e76f349835bbc39",
    pair: "WETH → $ALEISTER",
    source: "Safe Wallet",
  },
];

// ERC-20 Transfer event topic: Transfer(address,address,address)
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
// WETH on Base
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";

async function callRpc(method: string, params: any[]): Promise<any> {
  try {
    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Buyback RPC error:', error);
    return null;
  }
}

function hexToEth(hex: string): number {
  if (!hex || hex === '0x' || hex === '0x0') return 0;
  try {
    const raw = BigInt(hex);
    const divisor = BigInt(10) ** BigInt(18);
    const whole = raw / divisor;
    const remainder = raw % divisor;
    const fracStr = remainder.toString().padStart(18, '0');
    return Number(whole) + Number(`0.${fracStr}`);
  } catch {
    return 0;
  }
}

export const GET: APIRoute = async () => {
  try {
    let totalWethSpent = 0;
    const buybacks = [];

    for (const tx of BUYBACK_TXS) {
      const receipt = await callRpc('eth_getTransactionReceipt', [tx.hash]);
      let wethAmount = 0;

      if (receipt?.logs) {
        // Find WETH Transfer events (the first one is typically the input)
        for (const log of receipt.logs) {
          const isWethTransfer =
            log.address?.toLowerCase() === WETH_ADDRESS.toLowerCase() &&
            log.topics?.[0] === TRANSFER_TOPIC;

          if (isWethTransfer) {
            // The first WETH Transfer is the amount spent
            wethAmount = hexToEth(log.data);
            break;
          }
        }
      }

      totalWethSpent += wethAmount;
      buybacks.push({
        hash: tx.hash,
        pair: tx.pair,
        source: tx.source,
        wethAmount,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      buybacks,
      totalWethSpent,
      count: buybacks.length,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // 5min — buybacks don't change often
      },
    });
  } catch (error) {
    console.error('Error fetching buyback data:', error);

    return new Response(JSON.stringify({
      success: false,
      buybacks: [],
      totalWethSpent: 0,
      count: 0,
      timestamp: new Date().toISOString(),
      error: 'Using fallback data',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
