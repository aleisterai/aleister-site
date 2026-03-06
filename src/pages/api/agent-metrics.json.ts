import type { APIRoute } from 'astro';

const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';
const GITHUB_USER = 'aleisterai';

// All repos that should be counted for commit metrics
const TRACKED_REPOS = [
    'aleisterai/aleister-site',
    'aleisterai/aleister-md',
    'aleisterai/aleister-agent',
    'aleisterai/obsidian-docs',
    'FundlyHub/fundlyhub',
];

const GH_HEADERS = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/json',
    'User-Agent': 'AleisterDashboard/1.0',
};

async function fetchRepoCommitCount(repo: string): Promise<number> {
    // Use the contributors endpoint — sums all contributors' commit counts
    try {
        const res = await fetch(
            `https://api.github.com/repos/${repo}/contributors?per_page=100&anon=true`,
            { headers: GH_HEADERS, signal: AbortSignal.timeout(8000) }
        );
        if (res.ok) {
            const contributors = await res.json();
            if (Array.isArray(contributors)) {
                return contributors.reduce((sum: number, c: any) => sum + (c.contributions || 0), 0);
            }
        }
    } catch (_) { }
    return 0;
}

async function fetchGitHubCommits(): Promise<number> {
    if (!GITHUB_TOKEN) return 0;
    const counts = await Promise.all(TRACKED_REPOS.map(fetchRepoCommitCount));
    return counts.reduce((a, b) => a + b, 0);
}

async function fetchIssuesClosed(since: string): Promise<number> {
    if (!GITHUB_TOKEN) return 0;
    try {
        const res = await fetch(
            `https://api.github.com/search/issues?q=assignee:${GITHUB_USER}+is:issue+is:closed+closed:>=${since}`,
            {
                headers: GH_HEADERS,
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

async function fetchAllClosedIssues(): Promise<number> {
    if (!GITHUB_TOKEN) return 0;
    // Single search query across all repos (avoids rate-limit hit from 5 separate calls)
    const repoQuery = TRACKED_REPOS.map(r => `repo:${r}`).join('+');
    try {
        const res = await fetch(
            `https://api.github.com/search/issues?q=is:issue+is:closed+${repoQuery}`,
            { headers: GH_HEADERS, signal: AbortSignal.timeout(8000) }
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
                headers: GH_HEADERS,
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
            allClosedIssues,
            repoStats,
        ] = await Promise.all([
            fetchGitHubCommits(),
            fetchIssuesClosed(weekAgo),
            fetchIssuesClosed(monthAgo),
            fetchAllClosedIssues(),
            fetchRepoStats(),
        ]);

        return new Response(JSON.stringify({
            success: true,
            metrics: {
                commits: { total: commits, label: 'All-Time Commits' },
                issuesClosed: {
                    week: issuesClosedWeek,
                    month: issuesClosedMonth,
                    allTime: allClosedIssues,
                    label: 'Issues Closed',
                },
                repos: { total: repoStats.repos, label: 'Repositories' },
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
