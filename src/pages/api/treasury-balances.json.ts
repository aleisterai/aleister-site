import type { APIRoute } from 'astro';

const TREASURY_SAFE = "0x9BeBF2c780D5ac632c11984E28fA9760D33a10e6";
const TOKEN_CONTRACT = "0xacb4543f479ea44e6df4fa01e483bb5b78361ba3";

const TOKENS = {
  ALEISTER: {
    address: TOKEN_CONTRACT,
    decimals: 18,
    coingeckoId: "aleister"
  },
  ETH: {
    address: "0x4200000000000000000000000000000000000006", // WETH on Base
    decimals: 18,
    coingeckoId: "ethereum"
  },
  USDC: {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    decimals: 6,
    coingeckoId: "usd-coin"
  }
};

// BaseScan API key (free tier - replace with your own for production)
const BASE_SCAN_API_KEY = 'YourApiKeyToken';

async function fetchTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${walletAddress}&tag=latest&apikey=${BASE_SCAN_API_KEY}`,
      {
        headers: {
          'User-Agent': 'AleisterDashboard/1.0',
          'Accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    return data.result || '0';
  } catch (error) {
    console.error(`Error fetching balance for ${tokenAddress}:`, error);
    return '0';
  }
}

async function fetchEthBalance(walletAddress: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.basescan.org/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${BASE_SCAN_API_KEY}`,
      {
        headers: {
          'User-Agent': 'AleisterDashboard/1.0',
          'Accept': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    return data.result || '0';
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return '0';
  }
}

function formatBalance(rawBalance: string, decimals: number): number {
  const balance = parseFloat(rawBalance) / Math.pow(10, decimals);
  return balance;
}

export const GET: APIRoute = async () => {
  try {
    const balances = [];
    
    // Fetch ETH balance
    const ethRawBalance = await fetchEthBalance(TREASURY_SAFE);
    const ethBalance = formatBalance(ethRawBalance, TOKENS.ETH.decimals);
    balances.push({
      symbol: 'ETH',
      balance: ethBalance,
      rawBalance: ethRawBalance,
      decimals: TOKENS.ETH.decimals,
      address: TOKENS.ETH.address
    });
    
    // Fetch ALEISTER balance
    const aleisterRawBalance = await fetchTokenBalance(TOKENS.ALEISTER.address, TREASURY_SAFE);
    const aleisterBalance = formatBalance(aleisterRawBalance, TOKENS.ALEISTER.decimals);
    balances.push({
      symbol: 'ALEISTER',
      balance: aleisterBalance,
      rawBalance: aleisterRawBalance,
      decimals: TOKENS.ALEISTER.decimals,
      address: TOKENS.ALEISTER.address
    });
    
    // Fetch USDC balance
    const usdcRawBalance = await fetchTokenBalance(TOKENS.USDC.address, TREASURY_SAFE);
    const usdcBalance = formatBalance(usdcRawBalance, TOKENS.USDC.decimals);
    balances.push({
      symbol: 'USDC',
      balance: usdcBalance,
      rawBalance: usdcRawBalance,
      decimals: TOKENS.USDC.decimals,
      address: TOKENS.USDC.address
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
    
    // Return fallback data
    const fallbackData = {
      success: false,
      treasuryAddress: TREASURY_SAFE,
      balances: [
        { symbol: 'ETH', balance: 0, rawBalance: '0', decimals: 18 },
        { symbol: 'ALEISTER', balance: 0, rawBalance: '0', decimals: 18 },
        { symbol: 'USDC', balance: 0, rawBalance: '0', decimals: 6 }
      ],
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch balances'
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