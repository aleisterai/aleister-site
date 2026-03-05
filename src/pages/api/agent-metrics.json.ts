import type { APIRoute } from 'astro';

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';
const GITHUB_USER = 'aleisterai';

async function fetchGitHubCommits(): Promise<number> {
    if (!GITHUB_TOKEN) return 0;
    try {
        const res = await fetch(
            `https://api.github.com/search/commits?q=author:${GITHUB_USER}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.cloak-preview+json',
                    'User-Agent': 'AleisterDashboard/1.0',
                },
                signal: AbortSignal.timeout(8000),
            }
        );
        if (res.ok) {
            const data = await res.json();
            return data.total_count || 0;
        }
    } catch (_) { }
    return 0;
}

async function fetchIssuesClosed(since: string): Promise<number> {
    if (!GITHUB_TOKEN) return 0;
    try {
        const res = await fetch(
            `https://api.github.com/search/issues?q=assignee:${GITHUB_USER}+is:issue+is:closed+closed:>=${since}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/json',
                    'User-Agent': 'AleisterDashboard/1.0',
                },
                signal: AbortSignal.timeout(8000),
            }
        );
        if (res.ok) {
            const data = await res.json();
            return data.total_count || 0;
        }
    } catch (_) { }
    return 0;
}

async function fetchRepoStats(): Promise<{ linesChanged: number; repos: number }> {
    if (!GITHUB_TOKEN) return { linesChanged: 0, repos: 0 };
    try {
        const res = await fetch(
            `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=all`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/json',
                    'User-Agent': 'AleisterDashboard/1.0',
                },
                signal: AbortSignal.timeout(8000),
            }
        );
        if (res.ok) {
            const repos = await res.json();
            return { linesChanged: 0, repos: Array.isArray(repos) ? repos.length : 0 };
        }
    } catch (_) { }
    return { linesChanged: 0, repos: 0 };
}

export const GET: APIRoute = async () => {
    try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const [
            commits,
            issuesClosedWeek,
            issuesClosedMonth,
            repoStats,
        ] = await Promise.all([
            fetchGitHubCommits(),
            fetchIssuesClosed(weekAgo),
            fetchIssuesClosed(monthAgo),
            fetchRepoStats(),
        ]);

        return new Response(JSON.stringify({
            success: true,
            metrics: {
                commits: { total: commits, label: 'All-Time Commits' },
                issuesClosed: {
                    week: issuesClosedWeek,
                    month: issuesClosedMonth,
                    label: 'Issues Closed',
                },
                repos: { total: repoStats.repos, label: 'Repositories' },
                // These metrics come from other API routes (client aggregates them):
                // - cost/tokens: /api/agent-status.json (proxied from cost-ledger)
                // - treasury: /api/treasury-balances.json
                // - tweets: /api/agent-status.json (proxied from twitter-state)
            },
            timestamp: new Date().toISOString(),
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300',
            },
        });
    } catch (error) {
        console.error('Error fetching agent metrics:', error);
        return new Response(JSON.stringify({
            success: false,
            metrics: {
                commits: { total: 0, label: 'All-Time Commits' },
                issuesClosed: { week: 0, month: 0, label: 'Issues Closed' },
                repos: { total: 0, label: 'Repositories' },
            },
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
