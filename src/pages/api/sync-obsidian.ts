import type { APIRoute } from 'astro';

/**
 * Vercel Cron-powered sync: obsidian-docs → aleister-site
 *
 * Fetches TIL and team markdown from the obsidian-docs GitHub repo,
 * converts Obsidian-format markdown headers to Astro frontmatter,
 * and commits the converted files to aleister-site.
 *
 * Triggers: Vercel cron (every 30 min) or POST webhook from obsidian-docs.
 */

const OBSIDIAN_REPO = 'aleisterai/obsidian-docs';
const SITE_REPO = 'aleisterai/aleister-site';
const SKIP_FILES = new Set(['README.md', 'index.md', '_index.md']);

// ── Obsidian TIL parser ───────────────────────────────────────────
function parseTil(filename: string, content: string) {
    const lines = content.split('\n');
    let title = '';
    let date = filename.replace('.md', ''); // fallback
    let summary = '';
    let tags: string[] = [];
    let bodyStart = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Title: "# 2026-03-08 - Today I Learned: Title"
        if (line.startsWith('# ') && !line.startsWith('## ') && !title) {
            const tilMatch = line.match(/Today I Learned:\s*(.+)/);
            if (tilMatch) {
                title = tilMatch[1].trim();
            } else {
                const stripped = line.slice(2).trim();
                const datePrefix = stripped.match(/^\d{4}-\d{2}-\d{2}\s*[-–—]\s*/);
                title = datePrefix ? stripped.slice(datePrefix[0].length).trim() : stripped;
            }
            continue;
        }

        if (line.startsWith('## Date:')) {
            const m = line.match(/\d{4}-\d{2}-\d{2}/);
            if (m) date = m[0];
            continue;
        }

        if (line.startsWith('## Summary:')) {
            summary = line.replace('## Summary:', '').trim();
            if (!summary && i + 1 < lines.length) {
                const next = lines[i + 1].trim();
                if (next && !next.startsWith('#')) summary = next;
            }
            continue;
        }

        if (line.startsWith('## Tags:')) {
            tags = line.replace('## Tags:', '').trim().split(',').map(t => t.trim()).filter(Boolean);
            continue;
        }

        if (line.startsWith('### ') && bodyStart === -1) {
            bodyStart = i;
        }
    }

    // Body: everything from first ### onwards
    let body: string;
    if (bodyStart >= 0) {
        body = lines.slice(bodyStart).join('\n').trim();
    } else {
        // Fallback: everything after metadata
        let lastMeta = 0;
        for (let i = 0; i < lines.length; i++) {
            const s = lines[i].trim();
            if (s.startsWith('# ') || s.startsWith('## Date:') ||
                s.startsWith('## Summary:') || s.startsWith('## Tags:')) {
                lastMeta = i;
            }
        }
        body = lines.slice(lastMeta + 1).join('\n').trim();
    }

    if (!title) title = filename.replace('.md', '');

    // Build Astro frontmatter
    const fm = [
        '---',
        `title: "${title.replace(/"/g, '\\"')}"`,
        `date: "${date}"`,
    ];
    if (summary) fm.push(`summary: "${summary.replace(/"/g, '\\"')}"`);
    if (tags.length) fm.push(`tags: [${tags.map(t => `"${t}"`).join(', ')}]`);
    fm.push('---', '', body);
    return fm.join('\n');
}

// ── Obsidian Team parser ──────────────────────────────────────────
function parseTeam(filename: string, content: string) {
    const lines = content.split('\n');
    let name = '', codename = '', role = '', model = '', color = '', avatar = '', traitsStr = '';
    let bodyStart = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('# ') && !line.startsWith('## ') && !name) { name = line.slice(2).trim(); continue; }
        if (line.startsWith('## Codename:')) { codename = line.replace('## Codename:', '').trim(); continue; }
        if (line.startsWith('## Role:')) { role = line.replace('## Role:', '').trim(); continue; }
        if (line.startsWith('## Model:')) { model = line.replace('## Model:', '').trim(); continue; }
        if (line.startsWith('## Color:')) { color = line.replace('## Color:', '').trim(); continue; }
        if (line.startsWith('## Avatar:')) { avatar = line.replace('## Avatar:', '').trim(); continue; }
        if (line.startsWith('## Traits:')) { traitsStr = line.replace('## Traits:', '').trim(); continue; }
        if (line.startsWith('### ') && bodyStart === 0) bodyStart = i;
    }

    const bodyLines = bodyStart > 0 ? lines.slice(bodyStart) : [];
    const bodyText = bodyLines.join('\n').trim();

    // Extract description from Personality section
    let description = '';
    const pm = bodyText.match(/### Personality\s*\n+(.+?)(?:\n\n|\n##|\Z)/s);
    if (pm) description = pm[1].trim().split('\n')[0].trim();
    if (!description) description = `${name || filename.replace('.md', '')} is an AI sub-agent.`;
    if (!name) name = filename.replace('.md', '').charAt(0).toUpperCase() + filename.replace('.md', '').slice(1);

    const traits = traitsStr
        ? traitsStr.split(',').map(t => t.trim()).filter(Boolean).map(t => t.charAt(0).toUpperCase() + t.slice(1))
        : [name];

    const slug = filename.replace('.md', '').toLowerCase();
    const fm = [
        '---',
        `name: "${name}"`,
        `codename: "${codename || name}"`,
        `role: "${role.replace(/"/g, '\\"')}"`,
        `model: "${(model || 'Unknown').replace(/"/g, '\\"')}"`,
        `color: "${color || '#888888'}"`,
        `avatar: "${avatar || `/avatars/${slug}.png`}"`,
        `traits: [${traits.map(t => `"${t}"`).join(', ')}]`,
        `description: "${description.replace(/"/g, '\\"')}"`,
        '---', '', bodyText,
    ];
    return fm.join('\n');
}

// ── GitHub API helpers ────────────────────────────────────────────
async function ghFetch(path: string, token: string) {
    const res = await fetch(`https://api.github.com${path}`, {
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'AleisterSync/1.0',
        },
        signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
    return res.json();
}

async function listDir(repo: string, path: string, token: string): Promise<{ name: string; sha: string }[]> {
    const data = await ghFetch(`/repos/${repo}/contents/${path}`, token);
    return (data as any[]).filter(f => f.type === 'file' && f.name.endsWith('.md') && !SKIP_FILES.has(f.name))
        .map(f => ({ name: f.name, sha: f.sha }));
}

async function getFileContent(repo: string, path: string, token: string): Promise<string> {
    const data = await ghFetch(`/repos/${repo}/contents/${path}`, token);
    return Buffer.from(data.content, 'base64').toString('utf-8');
}

async function commitFile(repo: string, path: string, content: string, message: string, token: string, existingSha?: string) {
    const body: any = {
        message,
        content: Buffer.from(content).toString('base64'),
    };
    if (existingSha) body.sha = existingSha;

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'AleisterSync/1.0',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Commit failed for ${path}: ${res.status} ${err}`);
    }
    return res.json();
}

// ── Main sync logic ──────────────────────────────────────────────
async function runSync(token: string) {
    const log: string[] = [];
    const errors: string[] = [];
    let tilCount = 0;
    let teamCount = 0;

    // Get existing site files for SHA lookup
    const existingSiteTil: Record<string, string> = {};
    const existingSiteTeam: Record<string, string> = {};

    try {
        const siteTilFiles = await ghFetch(`/repos/${SITE_REPO}/contents/src/content/til`, token);
        for (const f of siteTilFiles as any[]) {
            if (f.type === 'file') existingSiteTil[f.name] = f.sha;
        }
    } catch { /* directory may not exist */ }

    try {
        const siteTeamFiles = await ghFetch(`/repos/${SITE_REPO}/contents/src/content/team`, token);
        for (const f of siteTeamFiles as any[]) {
            if (f.type === 'file') existingSiteTeam[f.name] = f.sha;
        }
    } catch { /* directory may not exist */ }

    // Sync TIL
    try {
        const tilFiles = await listDir(OBSIDIAN_REPO, 'TIL', token);
        for (const file of tilFiles) {
            try {
                const raw = await getFileContent(OBSIDIAN_REPO, `TIL/${file.name}`, token);
                const converted = parseTil(file.name, raw);
                const sitePath = `src/content/til/${file.name}`;
                await commitFile(SITE_REPO, sitePath, converted,
                    `docs: sync TIL ${file.name} from obsidian-docs`,
                    token, existingSiteTil[file.name]);
                tilCount++;
                log.push(`✅ TIL/${file.name}`);
            } catch (e: any) {
                // If content unchanged, GitHub returns 422 — that's fine
                if (e.message?.includes('422')) {
                    log.push(`⏭️ TIL/${file.name} (unchanged)`);
                } else {
                    errors.push(`TIL/${file.name}: ${e.message}`);
                    log.push(`❌ TIL/${file.name}: ${e.message}`);
                }
            }
        }
    } catch (e: any) {
        errors.push(`TIL listing: ${e.message}`);
    }

    // Sync Team
    try {
        const teamFiles = await listDir(OBSIDIAN_REPO, 'team', token);
        for (const file of teamFiles) {
            try {
                const raw = await getFileContent(OBSIDIAN_REPO, `team/${file.name}`, token);
                const converted = parseTeam(file.name, raw);
                const sitePath = `src/content/team/${file.name}`;
                await commitFile(SITE_REPO, sitePath, converted,
                    `docs: sync team/${file.name} from obsidian-docs`,
                    token, existingSiteTeam[file.name]);
                teamCount++;
                log.push(`✅ team/${file.name}`);
            } catch (e: any) {
                if (e.message?.includes('422')) {
                    log.push(`⏭️ team/${file.name} (unchanged)`);
                } else {
                    errors.push(`team/${file.name}: ${e.message}`);
                    log.push(`❌ team/${file.name}: ${e.message}`);
                }
            }
        }
    } catch (e: any) {
        errors.push(`Team listing: ${e.message}`);
    }

    return { tilCount, teamCount, errors, log, timestamp: new Date().toISOString() };
}

// ── API handlers ─────────────────────────────────────────────────

// GET: Vercel cron handler + manual trigger
export const GET: APIRoute = async ({ request }) => {
    const token = import.meta.env.SITE_PAT || process.env.SITE_PAT ||
        import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';

    // Verify cron secret for scheduled invocations
    const authHeader = request.headers.get('authorization');
    const cronSecret = import.meta.env.CRON_SECRET || process.env.CRON_SECRET || '';

    // Allow requests from Vercel cron (has Authorization: Bearer <CRON_SECRET>)
    // or manual trigger with ?key= param
    const url = new URL(request.url);
    const keyParam = url.searchParams.get('key');

    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && keyParam !== cronSecret) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!token) {
        return new Response(JSON.stringify({ error: 'SITE_PAT not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const result = await runSync(token);
        return new Response(JSON.stringify({
            success: result.errors.length === 0,
            ...result,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};

// POST: Webhook handler from obsidian-docs push events
export const POST: APIRoute = async ({ request }) => {
    const token = import.meta.env.SITE_PAT || process.env.SITE_PAT ||
        import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN || '';
    const webhookSecret = import.meta.env.SYNC_WEBHOOK_SECRET || process.env.SYNC_WEBHOOK_SECRET || '';

    // Verify webhook (optional — if secret is set, require it)
    if (webhookSecret) {
        const providedSecret = request.headers.get('x-webhook-secret');
        if (providedSecret !== webhookSecret) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    if (!token) {
        return new Response(JSON.stringify({ error: 'SITE_PAT not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const result = await runSync(token);
        return new Response(JSON.stringify({
            success: result.errors.length === 0,
            trigger: 'webhook',
            ...result,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
