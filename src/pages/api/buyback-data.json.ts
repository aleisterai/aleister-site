import type { APIRoute } from 'astro';

const BASE_RPC_URL = "https://mainnet.base.org";
const TREASURY_SAFE = "0x9BeBF2c780D5ac632c11984E28fA9760D33a10e6";
const TOKEN_CONTRACT = "0xacb4543f479ea44e6df4fa01e483bb5b78361ba3"; // $ALEISTER
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006"; // WETH on Base

// ERC-20 Transfer(address from, address to, uint256 value)
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// Safe deployed around block 22000000 (scan from a safe start)
const START_BLOCK = "0x14FB180"; // ~22_000_000

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

export const GET: APIRoute = async () => {
  try {
    const safePadded = padAddress(TREASURY_SAFE);

    // 1) Find all WETH transfers FROM the treasury safe (WETH spent)
    const wethOutLogs = await callRpc('eth_getLogs', [{
      fromBlock: START_BLOCK,
      toBlock: 'latest',
      address: WETH_ADDRESS,
      topics: [TRANSFER_TOPIC, safePadded, null], // from=safe, to=anyone
    }]);

    // 2) Find all $ALEISTER transfers TO the treasury safe (tokens bought)
    const aleisterInLogs = await callRpc('eth_getLogs', [{
      fromBlock: START_BLOCK,
      toBlock: 'latest',
      address: TOKEN_CONTRACT,
      topics: [TRANSFER_TOPIC, null, safePadded], // from=anyone, to=safe
    }]);

    // Build a set of tx hashes where WETH left the safe
    const wethOutTxs = new Map<string, number>();
    for (const log of (wethOutLogs || [])) {
      const amount = hexToToken(log.data, 18);
      const txHash = log.transactionHash;
      wethOutTxs.set(txHash, (wethOutTxs.get(txHash) || 0) + amount);
    }

    // Find matching txs where $ALEISTER came in AND WETH went out (= swaps)
    let totalWethSpent = 0;
    let totalAleisterBought = 0;
    let swapCount = 0;
    const swapTxHashes: string[] = [];

    for (const log of (aleisterInLogs || [])) {
      const txHash = log.transactionHash;
      if (wethOutTxs.has(txHash)) {
        const aleisterAmount = hexToToken(log.data, 18);
        const wethAmount = wethOutTxs.get(txHash)!;
        totalAleisterBought += aleisterAmount;
        totalWethSpent += wethAmount;
        swapCount++;
        if (!swapTxHashes.includes(txHash)) {
          swapTxHashes.push(txHash);
        }
        // Remove to avoid double-counting if multiple ALEISTER transfers in same tx
        wethOutTxs.delete(txHash);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      totalWethSpent,
      totalAleisterBought,
      swapCount: swapTxHashes.length,
      swapTxHashes,
      treasuryAddress: TREASURY_SAFE,
      timestamp: new Date().toISOString(),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120', // 2min cache
      },
    });
  } catch (error) {
    console.error('Error fetching buyback data:', error);

    return new Response(JSON.stringify({
      success: false,
      totalWethSpent: 0,
      totalAleisterBought: 0,
      swapCount: 0,
      swapTxHashes: [],
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
