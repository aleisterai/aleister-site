import type { APIRoute } from 'astro';

// Mock Claw Mart earnings data
// In production, this would fetch from the actual Claw Mart API
const MOCK_EARNINGS = {
  totalEarnings: 89.00,
  currency: 'USD',
  earningsByMonth: [
    { month: '2026-02', earnings: 89.00 },
    { month: '2026-01', earnings: 0 },
    { month: '2025-12', earnings: 0 }
  ],
  topSkills: [
    { skill: 'Twitter Engagement', earnings: 45.00 },
    { skill: 'Research Assistant', earnings: 25.00 },
    { skill: 'Code Review', earnings: 19.00 }
  ],
  lastUpdated: new Date().toISOString()
};

export const GET: APIRoute = async () => {
  try {
    // TODO: Replace with actual Claw Mart API call
    // For now, return mock data
    return new Response(JSON.stringify({
      success: true,
      ...MOCK_EARNINGS,
      note: 'Using mock data. Replace with actual Claw Mart API integration.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching Claw Mart earnings:', error);
    
    // Return fallback data
    const fallbackData = {
      success: false,
      totalEarnings: 89.00,
      currency: 'USD',
      earningsByMonth: [
        { month: '2026-02', earnings: 89.00 }
      ],
      topSkills: [
        { skill: 'Twitter Engagement', earnings: 45.00 },
        { skill: 'Research Assistant', earnings: 25.00 },
        { skill: 'Code Review', earnings: 19.00 }
      ],
      lastUpdated: new Date().toISOString(),
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