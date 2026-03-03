import type { APIRoute } from 'astro';

const TREASURY_SAFE = "0x9BeBF2c780D5ac632c11984E28fA9760D33a10e6";
const TOKEN_CONTRACT = "0xacb4543f479ea44e6df4fa01e483bb5b78361ba3";

// Token addresses on Base
const TOKENS = {
  ETH: {
    type: 'native',
    decimals: 18,
    coingeckoId: "ethereum"
  },
  WETH: {
    address: "0x4200000000000000000000000000000000000006", // WETH on Base
    decimals: 18,
    coingeckoId: "ethereum" // Same price as ETH
  },
  ALEISTER: {
    address: TOKEN_CONTRACT,
    decimals: 18,
    coingeckoId: "aleister"
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    decimals: 6,
    coingeckoId: "usd-coin"
  }
};

// Base RPC endpoint
const BASE_RPC_URL = "https://mainnet.base.org";

async function callRpc(method: string, params: any[]): Promise<any> {
  try {
    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    });
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('RPC call error:', error);
    return null;
  }
}

async function getEthBalance(address: string): Promise<string> {
  const balance = await callRpc('eth_getBalance', [address, 'latest']);
  return balance || '0';
}

async function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
  // Encode the balanceOf call: balanceOf(address)
  const data = '0x70a08231000000000000000000000000' + walletAddress.slice(2);
  
  const result = await callRpc('eth_call', [{
    to: tokenAddress,
    data: data
  }, 'latest']);
  
  return result || '0';
}

function formatBalance(rawBalance: string, decimals: number): number {
  if (!rawBalance || rawBalance === '0x') return 0;
  const balance = parseInt(rawBalance, 16) / Math.pow(10, decimals);
  return balance;
}

export const GET: APIRoute = async () => {
  try {
    const balances = [];
    
    // Fetch native ETH balance
    const ethRawBalance = await getEthBalance(TREASURY_SAFE);
    const ethBalance = formatBalance(ethRawBalance, TOKENS.ETH.decimals);
    balances.push({
      symbol: 'ETH',
      balance: ethBalance,
      rawBalance: ethRawBalance,
      decimals: TOKENS.ETH.decimals,
      type: 'native'
    });
    
    // Fetch WETH balance
    const wethRawBalance = await getTokenBalance(TOKENS.WETH.address, TREASURY_SAFE);
    const wethBalance = formatBalance(wethRawBalance, TOKENS.WETH.decimals);
    balances.push({
      symbol: 'WETH',
      balance: wethBalance,
      rawBalance: wethRawBalance,
      decimals: TOKENS.WETH.decimals,
      address: TOKENS.WETH.address,
      type: 'erc20'
    });
    
    // Fetch ALEISTER balance
    const aleisterRawBalance = await getTokenBalance(TOKENS.ALEISTER.address, TREASURY_SAFE);
    const aleisterBalance = formatBalance(aleisterRawBalance, TOKENS.ALEISTER.decimals);
    balances.push({
      symbol: 'ALEISTER',
      balance: aleisterBalance,
      rawBalance: aleisterRawBalance,
      decimals: TOKENS.ALEISTER.decimals,
      address: TOKENS.ALEISTER.address,
      type: 'erc20'
    });
    
    // Fetch USDC balance
    const usdcRawBalance = await getTokenBalance(TOKENS.USDC.address, TREASURY_SAFE);
    const usdcBalance = formatBalance(usdcRawBalance, TOKENS.USDC.decimals);
    balances.push({
      symbol: 'USDC',
      balance: usdcBalance,
      rawBalance: usdcRawBalance,
      decimals: TOKENS.USDC.decimals,
      address: TOKENS.USDC.address,
      type: 'erc20'
    });
    
    return new Response(JSON.stringify({
      success: true,
      treasuryAddress: TREASURY_SAFE,
      balances,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching treasury balances:', error);
    
    // Return fallback data with realistic values
    const fallbackData = {
      success: false,
      treasuryAddress: TREASURY_SAFE,
      balances: [
        { symbol: 'ETH', balance: 0.00508263, type: 'native', decimals: 18 },
        { symbol: 'WETH', balance: 0, type: 'erc20', decimals: 18 },
        { symbol: 'ALEISTER', balance: 0, type: 'erc20', decimals: 18 },
        { symbol: 'USDC', balance: 10, type: 'erc20', decimals: 6 }
      ],
      timestamp: new Date().toISOString(),
      error: 'Using fallback data'
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