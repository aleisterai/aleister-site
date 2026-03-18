import type { APIRoute } from 'astro';

const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";
const TOKEN_CONTRACT = "0xacb4543f479ea44e6df4fa01e483bb5b78361ba3";
const TOKEN_DECIMALS = 18;
const BASE_RPC_URL = "https://mainnet.base.org";

async function callRpc(method: string, params: any[]): Promise<any> {
  try {
    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Burn balance RPC error:', error);
    return null;
  }
}

function formatBalance(rawBalance: string, decimals: number): number {
  if (!rawBalance || rawBalance === '0x' || rawBalance === '0x0') return 0;
  try {
    const raw = BigInt(rawBalance);
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = raw / divisor;
    const remainder = raw % divisor;
    const fracStr = remainder.toString().padStart(decimals, '0');
    return Number(whole) + Number(`0.${fracStr}`);
  } catch {
    return parseInt(rawBalance, 16) / Math.pow(10, decimals);
  }
}

export const GET: APIRoute = async () => {
  try {
    // balanceOf(address) selector = 0x70a08231
    const data = '0x70a08231000000000000000000000000' + BURN_ADDRESS.slice(2);

    const rawBalance = await callRpc('eth_call', [{
      to: TOKEN_CONTRACT,
      data
    }, 'latest']);

    const balance = formatBalance(rawBalance, TOKEN_DECIMALS);

    return new Response(JSON.stringify({
      success: true,
      burnAddress: BURN_ADDRESS,
      tokenContract: TOKEN_CONTRACT,
      balance,
      rawBalance,
      decimals: TOKEN_DECIMALS,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('Error fetching burn balance:', error);

    return new Response(JSON.stringify({
      success: false,
      burnAddress: BURN_ADDRESS,
      tokenContract: TOKEN_CONTRACT,
      balance: 0,
      decimals: TOKEN_DECIMALS,
      timestamp: new Date().toISOString(),
      error: 'Using fallback data'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
