#!/usr/bin/env node
/**
 * office-status-api.js
 * Lightweight HTTP server that exposes SANITIZED agent status data.
 *
 * SAFETY:
 *  - Returns ONLY: agent id, status (working/idle), timestamp
 *  - NO task content, NO session IDs, NO API keys, NO logs
 *  - CORS locked to thealeister.com + localhost
 *  - Rate limited: max 60 requests/min per IP
 *  - Read-only: no mutations, no write endpoints
 *
 * USAGE:
 *   node office-status-api.js
 *   # Serves on http://localhost:4100/status
 *
 * DEPLOYMENT:
 *   Expose via Cloudflare Tunnel (free, secure, no port forwarding):
 *     cloudflared tunnel --url http://localhost:4100
 *   Or add to launchd/cron for auto-start.
 */

const http = require('http');
const { execSync } = require('child_process');

// ─── Config ──────────────────────────────────────────────────
const PORT = parseInt(process.env.STATUS_PORT || '4100', 10);
const ALLOWED_ORIGINS = [
    'https://thealeister.com',
    'https://www.thealeister.com',
    'https://aleister.io',
    'http://localhost:4321',  // dev
    'http://localhost:3000',
];
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 60; // requests per window
const CACHE_TTL = 10000; // Cache status for 10 seconds

// ─── Agent registry ──────────────────────────────────────────
const AGENTS = [
    { id: 'aleister', name: 'Aleister' },
    { id: 'cipher', name: 'Cipher' },
    { id: 'sage', name: 'Sage' },
    { id: 'quill', name: 'Quill' },
    { id: 'rally', name: 'Rally' },
    { id: 'echo', name: 'Echo' },
    { id: 'pixel', name: 'Pixel' },
    { id: 'forge', name: 'Forge' },
    { id: 'prism', name: 'Prism' },
    { id: 'lyra', name: 'Lyra' },
];

// ─── Rate limiter ────────────────────────────────────────────
const rateLimitMap = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { windowStart: now, count: 1 });
        return false;
    }

    entry.count++;
    if (entry.count > RATE_LIMIT_MAX) return true;
    return false;
}

// Clean up old entries every 5 min
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap) {
        if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) {
            rateLimitMap.delete(ip);
        }
    }
}, 300000);

// ─── Status cache ────────────────────────────────────────────
let statusCache = null;
let statusCacheTime = 0;

/**
 * Query OpenClaw for active sessions.
 * Returns only sanitized data: which agents have active sessions.
 */
function getOpenClawStatus() {
    const now = Date.now();
    if (statusCache && now - statusCacheTime < CACHE_TTL) {
        return statusCache;
    }

    try {
        // Get session list from OpenClaw
        const output = execSync('openclaw sessions 2>/dev/null', {
            encoding: 'utf-8',
            timeout: 5000,
            env: { ...process.env, PATH: '/opt/homebrew/bin:/usr/local/bin:' + process.env.PATH },
        });

        // Parse output — look for "active" sessions
        const lines = output.split('\n').filter(l => l.trim());
        const activeAgents = new Set();

        for (const line of lines) {
            const lower = line.toLowerCase();
            if (lower.includes('active')) {
                // Try to extract agent name from the line
                // OpenClaw session lines typically contain agent identifier
                for (const agent of AGENTS) {
                    if (lower.includes(agent.id) || lower.includes(agent.name.toLowerCase())) {
                        activeAgents.add(agent.id);
                    }
                }
                // If no specific agent found but there's an active session, Aleister is working
                if (activeAgents.size === 0 && lower.includes('active')) {
                    activeAgents.add('aleister');
                }
            }
        }

        // Also check heartbeat state for running tasks
        try {
            const fs = require('fs');
            const stateFile = process.env.HOME + '/.openclaw/workspace/memory/heartbeat-state.json';
            if (fs.existsSync(stateFile)) {
                const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
                if (state.active_long_tasks) {
                    for (const task of state.active_long_tasks) {
                        if (task.status === 'running') {
                            // Mark relevant agents as working based on task delegation
                            if (task.delegated_to) {
                                const delegateName = task.delegated_to.toLowerCase();
                                for (const agent of AGENTS) {
                                    if (delegateName.includes(agent.id) || delegateName.includes(agent.name.toLowerCase())) {
                                        activeAgents.add(agent.id);
                                    }
                                }
                            }
                            // Aleister is always working if there are active tasks
                            activeAgents.add('aleister');
                        }
                    }
                }
            }
        } catch (e) {
            // Heartbeat state not available — that's fine
        }

        // Build sanitized response
        const agentStatuses = AGENTS.map(a => ({
            id: a.id,
            name: a.name,
            status: activeAgents.has(a.id) ? 'working' : 'idle',
        }));

        statusCache = {
            agents: agentStatuses,
            workingCount: activeAgents.size,
            updatedAt: new Date().toISOString(),
            source: 'openclaw',
        };
        statusCacheTime = now;

        return statusCache;

    } catch (err) {
        // OpenClaw not available — return fallback
        if (statusCache) return statusCache; // Return stale cache

        return {
            agents: AGENTS.map(a => ({ id: a.id, name: a.name, status: 'unknown' })),
            workingCount: 0,
            updatedAt: new Date().toISOString(),
            source: 'fallback',
            error: 'OpenClaw unavailable',
        };
    }
}

// ─── HTTP Server ─────────────────────────────────────────────
const server = http.createServer((req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Rate limiting
    if (isRateLimited(ip)) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rate limit exceeded' }));
        return;
    }

    // CORS
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '3600');

    // Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Only GET /status
    if (req.method !== 'GET' || !req.url.startsWith('/status')) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found. Use GET /status' }));
        return;
    }

    // Prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const status = getOpenClawStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`\n🏢 Office Status API running on http://localhost:${PORT}/status`);
    console.log(`   CORS: ${ALLOWED_ORIGINS.join(', ')}`);
    console.log(`   Rate limit: ${RATE_LIMIT_MAX} req/min per IP`);
    console.log(`   Cache: ${CACHE_TTL / 1000}s TTL`);
    console.log(`\n   To expose publicly (safe, via Cloudflare Tunnel):`);
    console.log(`     cloudflared tunnel --url http://localhost:${PORT}\n`);
});
