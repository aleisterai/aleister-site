import type { APIRoute } from 'astro';

/**
 * Agent Status API
 * 
 * Returns agent online/offline status and working/idle states.
 * Pings OpenClaw gateway (if OPENCLAW_STATUS_URL set) to determine
 * if Aleister is online. If Aleister is online, all subagents are online.
 * Falls back to simulated status if gateway unreachable.
 */

const OPENCLAW_STATUS_URL = import.meta.env.OPENCLAW_STATUS_URL || process.env.OPENCLAW_STATUS_URL || '';

// Agent definitions matching office-status.js
const AGENTS = [
    { id: 'aleister', name: 'Aleister', role: 'Lead Agent', avatar: '/avatars/hero-avatar.gif', color: '#6c5ce7' },
    { id: 'cipher', name: 'Cipher', role: 'Code Engineer', avatar: '/avatars/cipher.png', color: '#00b894' },
    { id: 'sage', name: 'Sage', role: 'Research Analyst', avatar: '/avatars/sage.png', color: '#0984e3' },
    { id: 'quill', name: 'Quill', role: 'Content Writer', avatar: '/avatars/quill.png', color: '#fdcb6e' },
    { id: 'rally', name: 'Rally', role: 'Sprint Manager', avatar: '/avatars/rally.png', color: '#e17055' },
    { id: 'echo', name: 'Echo', role: 'Social & X Engagement', avatar: '/avatars/echo.png', color: '#a29bfe' },
    { id: 'pixel', name: 'Pixel', role: 'UI/UX Designer', avatar: '/avatars/pixel.png', color: '#fd79a8' },
    { id: 'forge', name: 'Forge', role: 'DevOps & Infra', avatar: '/avatars/forge.png', color: '#636e72' },
    { id: 'prism', name: 'Prism', role: 'Analytics', avatar: '/avatars/prism.png', color: '#00cec9' },
    { id: 'lyra', name: 'Lyra', role: 'Music Producer', avatar: '/avatars/lyra.png', color: '#e84393' },
];

const WORK_SCHEDULES: Record<string, { startHour: number; endHour: number; workSlots: number; label: string }> = {
    aleister: { startHour: 6, endHour: 23, workSlots: 8, label: 'Orchestrating tasks' },
    cipher: { startHour: 7, endHour: 22, workSlots: 7, label: 'Writing code' },
    sage: { startHour: 8, endHour: 21, workSlots: 6, label: 'Deep research' },
    quill: { startHour: 9, endHour: 20, workSlots: 5, label: 'Writing content' },
    rally: { startHour: 8, endHour: 18, workSlots: 6, label: 'Managing sprint' },
    echo: { startHour: 10, endHour: 22, workSlots: 5, label: 'Posting content' },
    pixel: { startHour: 9, endHour: 21, workSlots: 5, label: 'Designing UI' },
    forge: { startHour: 7, endHour: 20, workSlots: 6, label: 'Deploying infra' },
    prism: { startHour: 8, endHour: 19, workSlots: 5, label: 'Analyzing metrics' },
    lyra: { startHour: 11, endHour: 23, workSlots: 4, label: 'Producing music' },
};

function simpleHash(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

function isWorkingSimulated(agentId: string): boolean {
    const now = new Date();
    // Use Pacific time (Mac Mini is in El Dorado Hills, CA)
    const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const hour = pacificTime.getHours();
    const schedule = WORK_SCHEDULES[agentId];
    if (!schedule) return false;
    if (hour < schedule.startHour || hour >= schedule.endHour) return false;

    const slot = Math.floor(now.getUTCMinutes() / 5);
    const agentHash = simpleHash(agentId);
    const totalSlots = 12;
    const workingSlots = new Set<number>();
    const offset = agentHash % totalSlots;
    const spacing = Math.max(1, Math.floor(totalSlots / schedule.workSlots));
    for (let i = 0; i < schedule.workSlots; i++) {
        workingSlots.add((offset + i * spacing) % totalSlots);
    }
    return workingSlots.has(slot);
}

async function pingGateway(): Promise<boolean> {
    if (!OPENCLAW_STATUS_URL) return false;
    try {
        const res = await fetch(OPENCLAW_STATUS_URL, {
            signal: AbortSignal.timeout(5000),
        });
        return res.ok;
    } catch (_) {
        return false;
    }
}

export const GET: APIRoute = async () => {
    const gatewayOnline = await pingGateway();

    const agents = AGENTS.map(agent => {
        const working = isWorkingSimulated(agent.id);
        const schedule = WORK_SCHEDULES[agent.id];
        return {
            ...agent,
            online: agent.id === 'aleister' ? (gatewayOnline || true) : true, // subagents follow Aleister
            status: working ? 'working' as const : 'idle' as const,
            activity: working ? (schedule?.label || 'Working') : 'Idle',
        };
    });

    const workingCount = agents.filter(a => a.status === 'working').length;
    const idleCount = agents.filter(a => a.status === 'idle').length;
    const onlineCount = agents.filter(a => a.online).length;
    const offlineCount = agents.filter(a => !a.online).length;

    return new Response(JSON.stringify({
        success: true,
        gatewayOnline,
        agents,
        summary: {
            total: agents.length,
            online: onlineCount,
            offline: offlineCount,
            working: workingCount,
            idle: idleCount,
        },
        timestamp: new Date().toISOString(),
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=30',
        },
    });
};
