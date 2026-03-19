import type { APIRoute } from 'astro';

const BASE_RPC_URL = "https://mainnet.base.org";
const TREASURY_SAFE = "0x9BeBF2c780D5ac632c11984E28fA9760D33a10e6";
const TOKEN_CONTRACT = "0xacb4543f479ea44e6df4fa01e483bb5b78361ba3"; // $ALEISTER
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006"; // WETH on Base

// ERC-20 Transfer(address from, address to, uint256 value)
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// Known buyback transactions (WETH → $ALEISTER from Safe wallet)
const BUYBACK_TX_HASHES = [
  "0x0cd39b0bb2d752bafef290a759bb8bce1e5b5b34948bdeac8e76f349835bbc39",
];

function padAddress(addr: string): string {
  return "0x000000000000000000000000" + addr.slice(2).toLowerCase();
}

async function callRpc(method: string, params: any[]): Promise<any> {
  const response = await fetch(BASE_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

function hexToToken(hex: string, decimals: number): number {
  if (!hex || hex === '0x' || hex === '0x0') return 0;
  try {
    const raw = BigInt(hex);
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = raw / divisor;
    const remainder = raw % divisor;
    const fracStr = remainder.toString().padStart(decimals, '0');
    return Number(whole) + Number(`0.${fracStr}`);
  } catch {
    return 0;
  }
}

interface BuybackSwap {
  txHash: string;
  wethSpent: number;
  aleisterBought: number;
}

async function parseBuybackTx(txHash: string): Promise<BuybackSwap | null> {
  try {
    const receipt = await callRpc('eth_getTransactionReceipt', [txHash]);
    if (!receipt?.logs) return null;

    const safePadded = padAddress(TREASURY_SAFE);
    let wethSpent = 0;
    let aleisterBought = 0;

    for (const log of receipt.logs) {
      const addr = log.address?.toLowerCase();
      const topic0 = log.topics?.[0];
      const topicFrom = log.topics?.[1]?.toLowerCase();
      const topicTo = log.topics?.[2]?.toLowerCase();

      if (topic0 !== TRANSFER_TOPIC) continue;

      // WETH Transfer FROM the safe = WETH spent
      if (addr === WETH_ADDRESS.toLowerCase() && topicFrom === safePadded) {
        wethSpent += hexToToken(log.data, 18);
      }

      // $ALEISTER Transfer TO the safe = tokens bought
      if (addr === TOKEN_CONTRACT.toLowerCase() && topicTo === safePadded) {
        aleisterBought += hexToToken(log.data, 18);
      }
    }

    if (wethSpent > 0 || aleisterBought > 0) {
      return { txHash, wethSpent, aleisterBought };
    }
    return null;
  } catch (error) {
    console.error(`Error parsing buyback tx ${txHash}:`, error);
    return null;
  }
}

export const GET: APIRoute = async () => {
  try {
    const results = await Promise.all(
      BUYBACK_TX_HASHES.map((hash) => parseBuybackTx(hash))
    );

    const swaps: BuybackSwap[] = results.filter((r): r is BuybackSwap => r !== null);
    let totalWethSpent = 0;
    let totalAleisterBought = 0;

    for (const swap of swaps) {
      totalWethSpent += swap.wethSpent;
      totalAleisterBought += swap.aleisterBought;
    }

    return new Response(JSON.stringify({
      success: true,
      totalWethSpent,
      totalAleisterBought,
      swapCount: swaps.length,
      swaps,
      treasuryAddress: TREASURY_SAFE,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // 5min — buyback txs don't change
      },
    });
  } catch (error) {
    console.error('Error fetching buyback data:', error);

    return new Response(JSON.stringify({
      success: false,
      totalWethSpent: 0,
      totalAleisterBought: 0,
      swapCount: 0,
      swaps: [],
      treasuryAddress: TREASURY_SAFE,
      timestamp: new Date().toISOString(),
      error: 'Unable to fetch buyback data',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
