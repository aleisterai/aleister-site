/**
 * office-status.js
 * Agent status engine — fetches LIVE data from OpenClaw status API
 * with automatic fallback to simulated scheduling when API is unavailable.
 *
 * The status API (office-status-api.js) runs on the Mac Mini and returns
 * only sanitized data: agent id, name, and working/idle status.
 */

window.OfficeStatus = (function () {
    'use strict';

    // ─── Config ────────────────────────────────────────────────────
    // The status API URL — set via data attribute on body, or falls back to defaults.
    // In production, this points to the Cloudflare Tunnel URL.
    // Set it in the page: <body data-status-api="https://your-tunnel.trycloudflare.com">
    const API_URL = document.body.getAttribute('data-status-api') || '';
    const POLL_INTERVAL = 15000; // Poll every 15 seconds
    const FETCH_TIMEOUT = 5000;  // 5s timeout

    // ─── Idle Activities ──────────────────────────────────────────
    const IDLE_ACTIVITIES = [
        { id: 'listening', label: 'Listening to music', location: 'desk', emoji: '🎧', weight: 20 },
        { id: 'reading', label: 'Doing research', location: 'desk', emoji: '📚', weight: 15 },
        { id: 'coffee_make', label: 'Making coffee', location: 'breakroom', emoji: '☕', weight: 10 },
        { id: 'coffee_drink', label: 'Drinking coffee', location: 'breakroom', emoji: '☕', weight: 12 },
        { id: 'snacking', label: 'Having a snack', location: 'breakroom', emoji: '🍕', weight: 10 },
        { id: 'sofa_chill', label: 'Chilling on the sofa', location: 'chill', emoji: '🛋️', weight: 12 },
        { id: 'sofa_nap', label: 'Taking a power nap', location: 'chill', emoji: '😴', weight: 5 },
        { id: 'roaming', label: 'Walking around', location: 'roaming', emoji: '🚶', weight: 8 },
        { id: 'training', label: 'Training / learning', location: 'desk', emoji: '🧠', weight: 10 },
        { id: 'chatting', label: 'Chatting with a friend', location: 'roaming', emoji: '💬', weight: 8 },
    ];

    const TOTAL_WEIGHT = IDLE_ACTIVITIES.reduce((sum, a) => sum + a.weight, 0);

    // ─── Simulated work schedules (fallback) ───────────────────────
    const WORK_SCHEDULES = {
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

    // ─── State ─────────────────────────────────────────────────────
    const agentStates = {};
    let lastUpdate = 0;
    let isLive = false; // True when connected to live API
    let liveStatuses = null; // Last live data from API
    const ACTIVITY_MIN_DURATION = 25000;
    const ACTIVITY_MAX_DURATION = 90000;

    // ─── Helpers ───────────────────────────────────────────────────
    function hash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    }

    function pickIdleActivity(agentId) {
        let roll = (hash(agentId + Date.now().toString().slice(-5)) % 1000) / 1000 * TOTAL_WEIGHT;
        for (const activity of IDLE_ACTIVITIES) {
            roll -= activity.weight;
            if (roll <= 0) return activity;
        }
        return IDLE_ACTIVITIES[0];
    }

    function getAnimState(activity) {
        switch (activity.id) {
            case 'listening': return 'listening';
            case 'reading':
            case 'training': return 'reading';
            case 'coffee_make':
            case 'coffee_drink': return 'coffee';
            case 'snacking': return 'snacking';
            case 'sofa_chill': return 'listening';
            case 'sofa_nap': return 'sleeping';
            case 'roaming':
            case 'chatting': return 'walking';
            default: return 'listening';
        }
    }

    // ─── Simulated work check (fallback) ───────────────────────────
    function shouldBeWorkingSimulated(agentId) {
        const now = new Date();
        const hour = now.getHours();
        const schedule = WORK_SCHEDULES[agentId];
        if (!schedule) return false;
        if (hour < schedule.startHour || hour >= schedule.endHour) return false;

        const slot = Math.floor(now.getMinutes() / 5);
        const agentHash = hash(agentId);
        const totalSlots = 12;
        const workingSlots = new Set();
        const offset = agentHash % totalSlots;
        const spacing = Math.max(1, Math.floor(totalSlots / schedule.workSlots));
        for (let i = 0; i < schedule.workSlots; i++) {
            workingSlots.add((offset + i * spacing) % totalSlots);
        }
        return workingSlots.has(slot);
    }

    // ─── Live API check ────────────────────────────────────────────
    function shouldBeWorkingLive(agentId) {
        if (!liveStatuses || !liveStatuses.agents) return null; // Unknown
        const agentData = liveStatuses.agents.find(a => a.id === agentId);
        if (!agentData) return null;
        return agentData.status === 'working';
    }

    // ─── Combined: live if available, simulated fallback ───────────
    function shouldBeWorking(agentId) {
        if (isLive) {
            const live = shouldBeWorkingLive(agentId);
            if (live !== null) return live;
        }
        return shouldBeWorkingSimulated(agentId);
    }

    // ─── Fetch live status from API ────────────────────────────────
    async function fetchLiveStatus() {
        if (!API_URL) return; // No API configured

        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

            const response = await fetch(API_URL + '/status', {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' },
            });
            clearTimeout(timer);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            if (data && data.agents && Array.isArray(data.agents)) {
                liveStatuses = data;
                isLive = true;

                // Force state refresh when we get live data
                for (const id in agentStates) agentStates[id].expiresAt = 0;

                // Update live badge
                const badge = document.getElementById('live-badge');
                if (badge && !badge.classList.contains('live-connected')) {
                    badge.classList.add('live-connected');
                    badge.title = `Live from OpenClaw · ${data.source || 'api'}`;
                }
            }
        } catch (err) {
            // API not available — continue with simulation
            isLive = false;
        }
    }

    // ─── Update states ──────────────────────────────────────────────
    function updateStates() {
        const now = Date.now();

        for (const agent of window.OfficeSprites.AGENTS) {
            const current = agentStates[agent.id];
            if (current && current.expiresAt > now) continue;

            const working = shouldBeWorking(agent.id);

            if (working) {
                const schedule = WORK_SCHEDULES[agent.id];
                agentStates[agent.id] = {
                    status: 'working',
                    activity: { id: 'typing', label: schedule ? schedule.label : 'Working', location: 'desk', emoji: '💻' },
                    animState: 'typing',
                    location: 'desk',
                    expiresAt: now + ACTIVITY_MIN_DURATION + Math.random() * (ACTIVITY_MAX_DURATION - ACTIVITY_MIN_DURATION),
                };
            } else {
                const activity = pickIdleActivity(agent.id);
                agentStates[agent.id] = {
                    status: 'idle',
                    activity,
                    animState: getAnimState(activity),
                    location: activity.location,
                    expiresAt: now + ACTIVITY_MIN_DURATION + Math.random() * (ACTIVITY_MAX_DURATION - ACTIVITY_MIN_DURATION),
                };
            }
        }
    }

    function getState(agentId) {
        if (!agentStates[agentId]) updateStates();
        return agentStates[agentId];
    }

    function getAllStates() {
        const now = Date.now();
        if (now - lastUpdate > POLL_INTERVAL) {
            updateStates();
            lastUpdate = now;
        }
        return agentStates;
    }

    function getWorkingCount() {
        getAllStates();
        let count = 0;
        for (const id in agentStates) {
            if (agentStates[id].status === 'working') count++;
        }
        return count;
    }

    function forceRefresh() {
        for (const id in agentStates) agentStates[id].expiresAt = 0;
        lastUpdate = 0;
        updateStates();
    }

    // ─── Init ──────────────────────────────────────────────────────
    updateStates();

    // Start live polling if API is configured
    if (API_URL) {
        fetchLiveStatus(); // Initial fetch
        setInterval(fetchLiveStatus, POLL_INTERVAL);
        console.log(`🏢 Office: polling live status from ${API_URL}`);
    } else {
        console.log('🏢 Office: using simulated status (no data-status-api configured)');
    }

    return {
        getState, getAllStates, getWorkingCount, forceRefresh,
        IDLE_ACTIVITIES, WORK_SCHEDULES,
        get isLive() { return isLive; },
    };
})();
