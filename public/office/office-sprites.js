/**
 * office-sprites.js
 * Game-quality pixel-art sprites with dark outlines, multi-level shading,
 * and saturated colors. Based on pixel art best practices:
 * - 1px dark outlines for character pop
 * - 4-color shading per element (highlight, base, shadow, outline)
 * - 16×20 pixel characters at dynamic scale
 * - Clear silhouettes readable at any zoom
 */

window.OfficeSprites = (function () {
    'use strict';

    const AGENTS = [
        { id: 'aleister', name: 'Aleister', role: 'Orchestrator', color: '#00d4ff', shirt: '#0099cc', shirtHi: '#33e0ff', shirtSh: '#006688', hair: '#1a1a3a', hairHi: '#2a2a55', avatar: '/avatars/aleister.png', traits: ['strategic', 'autonomous', 'leader'], isMain: true },
        { id: 'cipher', name: 'Cipher', role: 'Full-stack Dev', color: '#f97316', shirt: '#e06610', shirtHi: '#ffaa44', shirtSh: '#aa4400', hair: '#2a1a0a', hairHi: '#3a2a18', avatar: '/avatars/cipher.png', traits: ['dedicated', 'antisocial'] },
        { id: 'sage', name: 'Sage', role: 'Researcher', color: '#06b6d4', shirt: '#0899b0', shirtHi: '#22ddf8', shirtSh: '#066678', hair: '#f5f0e0', hairHi: '#fff8ee', avatar: '/avatars/sage.png', traits: ['wise', 'caring', 'humble'] },
        { id: 'quill', name: 'Quill', role: 'Writer', color: '#a855f7', shirt: '#8a3ad0', shirtHi: '#c488ff', shirtSh: '#5a1a90', hair: '#3a1a4a', hairHi: '#5a2a6a', avatar: '/avatars/quill.png', traits: ['romancer', 'dreamer', 'calm'] },
        { id: 'rally', name: 'Rally', role: 'Scrum Master', color: '#22c55e', shirt: '#1aa04c', shirtHi: '#55f088', shirtSh: '#0a7030', hair: '#1a0a00', hairHi: '#2a1a10', avatar: '/avatars/rally.png', traits: ['observant', 'resilient'] },
        { id: 'echo', name: 'Echo', role: 'Social Media', color: '#7c6ef6', shirt: '#6055dd', shirtHi: '#a499ff', shirtSh: '#3a30aa', hair: '#ff6bda', hairHi: '#ff99e8', avatar: '/avatars/echo.png', traits: ['creative', 'curious', 'social'] },
        { id: 'pixel', name: 'Pixel', role: 'Designer', color: '#e5a030', shirt: '#cc8820', shirtHi: '#ffcc55', shirtSh: '#886010', hair: '#ff4444', hairHi: '#ff7777', avatar: '/avatars/pixel.png', traits: ['creative', 'collaborative', 'perfectionist'] },
        { id: 'forge', name: 'Forge', role: 'DevOps', color: '#dc2626', shirt: '#bb1a1a', shirtHi: '#ff5555', shirtSh: '#881010', hair: '#222', hairHi: '#444', avatar: '/avatars/forge.png', traits: ['nerd', 'lazy', 'analytical'] },
        { id: 'prism', name: 'Prism', role: 'Analytics', color: '#22b8cf', shirt: '#1a99aa', shirtHi: '#44ddee', shirtSh: '#0a6670', hair: '#0a3060', hairHi: '#1a4480', avatar: '/avatars/prism.png', traits: ['strategic', 'adaptable'] },
        { id: 'lyra', name: 'Lyra', role: 'Music Producer', color: '#e84393', shirt: '#cc2a78', shirtHi: '#ff77bb', shirtSh: '#881a50', hair: '#ffe066', hairHi: '#fff099', avatar: '/avatars/lyra.png', traits: ['upbeat', 'visionary', 'musician'] },
    ];

    const FRAME_DURATION = 280;

    function hexToRgb(hex) { return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) }; }
    function darken(hex, f) { const { r, g, b } = hexToRgb(hex); const m = 1 - f; return `rgb(${~~(r * m)},${~~(g * m)},${~~(b * m)})`; }
    function lighten(hex, f) { const { r, g, b } = hexToRgb(hex); return `rgb(${Math.min(255, ~~(r + (255 - r) * f))},${Math.min(255, ~~(g + (255 - g) * f))},${Math.min(255, ~~(b + (255 - b) * f))})`; }

    // ─── Pixel helper ──────────────────────────────────────────────
    function px(ctx, x, y, s, c) { ctx.fillStyle = c; ctx.fillRect(~~x, ~~y, s, s); }

    // ─── Color constants ───────────────────────────────────────────
    const OL = '#0a0a12'; // outline
    const SKIN = '#ffcc99';
    const SKIN_HI = '#ffe4c4';
    const SKIN_SH = '#d4a060';
    const EYE = '#111';
    const EYE_WHITE = '#fff';
    const MOUTH = '#c44';
    const BLUSH = '#ff9999';
    const PANTS = '#2a3050';
    const PANTS_HI = '#3a4068';
    const PANTS_SH = '#1a2038';
    const SHOE = '#1a1a22';
    const SHOE_HI = '#2a2a38';
    const BELT = '#444';
    const BUCKLE = '#cc9900';

    // ─── Draw pixel-art character (16 wide × 20 tall) ──────────────
    function drawCharBody(ctx, cx, cy, s, a) {
        // cx, cy = center bottom of character
        const x0 = cx - 8 * s;
        const y0 = cy - 20 * s;
        const P = (col, row, c) => px(ctx, x0 + col * s, y0 + row * s, s, c);

        // ─── ROW 0-1: Hair top ───
        P(5, 0, OL); P(6, 0, a.hairHi); P(7, 0, a.hairHi); P(8, 0, a.hair); P(9, 0, a.hair); P(10, 0, OL);
        P(4, 1, OL); P(5, 1, a.hairHi); P(6, 1, a.hair); P(7, 1, a.hair); P(8, 1, a.hair); P(9, 1, a.hair); P(10, 1, a.hair); P(11, 1, OL);

        // ─── ROW 2: Hair + forehead ───
        P(3, 2, OL); P(4, 2, a.hair); P(5, 2, a.hairHi); P(6, 2, SKIN_HI); P(7, 2, SKIN_HI); P(8, 2, SKIN); P(9, 2, SKIN); P(10, 2, a.hair); P(11, 2, a.hair); P(12, 2, OL);

        // ─── ROW 3: Eyes ───
        P(3, 3, OL); P(4, 3, a.hair); P(5, 3, SKIN); P(6, 3, EYE_WHITE); P(7, 3, EYE); P(8, 3, SKIN); P(9, 3, EYE_WHITE); P(10, 3, EYE); P(11, 3, SKIN); P(12, 3, OL);

        // ─── ROW 4: Cheeks + nose ───
        P(3, 4, OL); P(4, 4, SKIN_SH); P(5, 4, BLUSH); P(6, 4, SKIN); P(7, 4, SKIN); P(8, 4, SKIN_SH); P(9, 4, SKIN); P(10, 4, BLUSH); P(11, 4, SKIN); P(12, 4, OL);

        // ─── ROW 5: Mouth ───
        P(4, 5, OL); P(5, 5, SKIN); P(6, 5, SKIN); P(7, 5, MOUTH); P(8, 5, MOUTH); P(9, 5, SKIN); P(10, 5, SKIN); P(11, 5, OL);

        // ─── ROW 6: Chin ───
        P(5, 6, OL); P(6, 6, SKIN_SH); P(7, 6, SKIN); P(8, 6, SKIN); P(9, 6, SKIN_SH); P(10, 6, OL);

        // ─── ROW 7: Neck ───
        P(6, 7, OL); P(7, 7, SKIN_SH); P(8, 7, SKIN); P(9, 7, OL);

        // ─── ROW 8: Shoulders + collar ───
        P(3, 8, OL); P(4, 8, a.shirtHi); P(5, 8, a.shirtHi); P(6, 8, a.shirt); P(7, 8, a.shirtHi); P(8, 8, a.shirtHi); P(9, 8, a.shirt); P(10, 8, a.shirtHi); P(11, 8, a.shirtHi); P(12, 8, OL);

        // ─── ROW 9-10: Arms + torso ───
        // Row 9
        P(2, 9, OL); P(3, 9, a.shirt); P(4, 9, a.shirtHi); P(5, 9, a.shirt); P(6, 9, a.shirt); P(7, 9, a.shirt); P(8, 9, a.shirt); P(9, 9, a.shirt); P(10, 9, a.shirt); P(11, 9, a.shirtSh); P(12, 9, a.shirt); P(13, 9, OL);
        // Row 10
        P(2, 10, OL); P(3, 10, a.shirtSh); P(4, 10, a.shirt); P(5, 10, a.shirt); P(6, 10, a.shirtSh); P(7, 10, a.shirt); P(8, 10, a.shirt); P(9, 10, a.shirtSh); P(10, 10, a.shirt); P(11, 10, a.shirtSh); P(12, 10, a.shirtSh); P(13, 10, OL);

        // ─── ROW 11: Hands + lower shirt ───
        P(2, 11, OL); P(3, 11, SKIN); P(4, 11, OL); P(5, 11, a.shirtSh); P(6, 11, a.shirt); P(7, 11, a.shirtSh); P(8, 11, a.shirtSh); P(9, 11, a.shirt); P(10, 11, a.shirtSh); P(11, 11, OL); P(12, 11, SKIN); P(13, 11, OL);

        // ─── ROW 12: Belt ───
        P(5, 12, OL); P(6, 12, BELT); P(7, 12, BUCKLE); P(8, 12, BUCKLE); P(9, 12, BELT); P(10, 12, OL);

        // ─── ROW 13-16: Pants ───
        for (let r = 13; r <= 16; r++) {
            P(4, r, OL);
            P(5, r, r < 15 ? PANTS_HI : PANTS);
            P(6, r, PANTS);
            P(7, r, r === 13 || r === 14 ? OL : PANTS_SH); // gap between legs at bottom
            P(8, r, r === 13 || r === 14 ? OL : PANTS_SH);
            P(9, r, PANTS);
            P(10, r, r < 15 ? PANTS_HI : PANTS);
            P(11, r, OL);
        }
        // Leg separation
        P(7, 15, OL); P(8, 15, OL);
        P(7, 16, OL); P(8, 16, OL);

        // ─── ROW 17: Lower legs ───
        P(4, 17, OL); P(5, 17, PANTS_SH); P(6, 17, PANTS_SH); P(7, 17, OL);
        P(8, 17, OL); P(9, 17, PANTS_SH); P(10, 17, PANTS_SH); P(11, 17, OL);

        // ─── ROW 18-19: Shoes ───
        P(3, 18, OL); P(4, 18, SHOE_HI); P(5, 18, SHOE); P(6, 18, SHOE); P(7, 18, OL);
        P(8, 18, OL); P(9, 18, SHOE_HI); P(10, 18, SHOE); P(11, 18, SHOE); P(12, 18, OL);
        P(3, 19, OL); P(4, 19, OL); P(5, 19, OL); P(6, 19, OL);
        P(9, 19, OL); P(10, 19, OL); P(11, 19, OL); P(12, 19, OL);
    }

    // ─── Draw agent with state ────────────────────────────────────
    function drawAgent(ctx, x, y, zoom, agent, animState, frame, time) {
        const s = Math.max(1.5, Math.round(zoom * 2.5));

        ctx.save();

        // Shadow beneath character
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(x, y + 2, 8 * s, 3 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw base character
        drawCharBody(ctx, x, y, s, agent);

        // State overlays
        switch (animState) {
            case 'typing': overlayTyping(ctx, x, y, s, frame, time, agent); break;
            case 'listening': overlayListening(ctx, x, y, s, frame, time); break;
            case 'coffee': overlayCoffee(ctx, x, y, s, frame, time); break;
            case 'reading': overlayReading(ctx, x, y, s, frame, time); break;
            case 'sleeping': overlaySleeping(ctx, x, y, s, frame, time); break;
            case 'walking': overlayWalking(ctx, x, y, s, frame, time); break;
            case 'snacking': overlaySnacking(ctx, x, y, s, frame, time); break;
        }

        ctx.restore();
    }

    // ── TYPING ──
    function overlayTyping(ctx, x, y, s, frame, time, agent) {
        // Hands moving
        const y0 = y - 20 * s;
        const x0 = x - 8 * s;
        const hOff = frame % 2 === 0 ? 0 : s;
        px(ctx, x0 + 2 * s, y0 + 11 * s + hOff, s, SKIN);
        px(ctx, x0 + 12 * s, y0 + 11 * s - hOff, s, SKIN);

        // Code floating up
        ctx.font = `bold ${Math.max(9, 5 * s)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        const syms = ['{...}', '</>', 'fn()', '[ ]', '0x', '::'];
        const sym = syms[Math.floor(time / 700) % syms.length];
        ctx.fillStyle = agent.color;
        ctx.globalAlpha = 0.55 + Math.sin(time * 0.005) * 0.2;
        ctx.fillText(sym, x, y - 22 * s + Math.sin(time * 0.003) * 2 * s);
        ctx.globalAlpha = 1;
        ctx.textAlign = 'start';
    }

    // ── LISTENING ──
    function overlayListening(ctx, x, y, s, frame, time) {
        const y0 = y - 20 * s;
        // Headband
        ctx.strokeStyle = '#222';
        ctx.lineWidth = Math.max(2, s * 1.2);
        ctx.beginPath();
        ctx.arc(x, y0 + 1.5 * s, 7 * s, Math.PI * 0.78, Math.PI * 0.22);
        ctx.stroke();
        // Left ear cup
        ctx.fillStyle = '#333';
        ctx.fillRect(x - 9 * s, y0 + 2 * s, 2.5 * s, 4 * s);
        ctx.fillStyle = '#e84393';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x - 8.5 * s, y0 + 2.8 * s, 1.5 * s, 2.5 * s);
        ctx.globalAlpha = 1;
        // Right ear cup
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 6.5 * s, y0 + 2 * s, 2.5 * s, 4 * s);
        ctx.fillStyle = '#e84393';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(x + 7 * s, y0 + 2.8 * s, 1.5 * s, 2.5 * s);
        ctx.globalAlpha = 1;

        // ♪ notes — big, bright, animated
        ctx.font = `bold ${Math.max(12, 6 * s)}px sans-serif`;
        ctx.textAlign = 'center';
        for (let i = 0; i < 3; i++) {
            const angle = time * 0.002 + i * 2.1;
            const nx = x + Math.sin(angle) * (10 + i * 3) * s;
            const ny = y0 - (3 + i * 5) * s + Math.sin(time * 0.003 + i) * 2 * s;
            ctx.fillStyle = `hsla(${320 + i * 20}, 80%, 65%, ${0.5 + Math.sin(time * 0.004 + i * 1.3) * 0.3})`;
            ctx.fillText(['♪', '♫', '♬'][i], nx, ny);
        }
        ctx.textAlign = 'start';
    }

    // ── COFFEE ──
    function overlayCoffee(ctx, x, y, s, frame, time) {
        const y0 = y - 20 * s;
        // Extended arm
        px(ctx, x + 8 * s, y0 + 9 * s, s, SKIN);
        px(ctx, x + 9 * s, y0 + 9 * s, s, SKIN);
        // Cup body
        ctx.fillStyle = '#f8f8f0';
        ctx.fillRect(x + 9.5 * s, y0 + 7 * s, 3.5 * s, 4 * s);
        ctx.fillStyle = OL;
        ctx.strokeStyle = OL;
        ctx.lineWidth = Math.max(1, s * 0.3);
        ctx.strokeRect(x + 9.5 * s, y0 + 7 * s, 3.5 * s, 4 * s);
        // Coffee inside
        ctx.fillStyle = '#6b3a1f';
        ctx.fillRect(x + 10 * s, y0 + 7.5 * s, 2.5 * s, 1.5 * s);
        // Handle
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = Math.max(1, s * 0.6);
        ctx.beginPath();
        ctx.arc(x + 13 * s, y0 + 9 * s, 1.5 * s, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        // Steam
        for (let i = 0; i < 3; i++) {
            const sx = x + 11 * s + Math.sin(time * 0.004 + i * 1.5) * s;
            const sy = y0 + (5 - i * 2.5) * s - (time * 0.008 + i * 3) % (6 * s);
            ctx.fillStyle = `rgba(200,200,240,${0.25 - i * 0.06})`;
            ctx.beginPath(); ctx.arc(sx, sy, (1 + i * 0.4) * s, 0, Math.PI * 2); ctx.fill();
        }
    }

    // ── READING ──
    function overlayReading(ctx, x, y, s, frame, time) {
        const y0 = y - 20 * s;
        // Hands forward
        px(ctx, x - 5 * s, y0 + 10 * s, s, SKIN);
        px(ctx, x + 5 * s, y0 + 10 * s, s, SKIN);
        // Book cover
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(x - 5 * s, y0 + 9 * s, 10 * s, 6 * s);
        ctx.strokeStyle = OL;
        ctx.lineWidth = Math.max(1, s * 0.4);
        ctx.strokeRect(x - 5 * s, y0 + 9 * s, 10 * s, 6 * s);
        // Spine
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(x - 0.4 * s, y0 + 9 * s, 0.8 * s, 6 * s);
        // Pages
        ctx.fillStyle = '#fef9e7';
        ctx.fillRect(x - 4 * s, y0 + 9.8 * s, 3.5 * s, 4.5 * s);
        ctx.fillRect(x + 0.5 * s, y0 + 9.8 * s, 3.5 * s, 4.5 * s);
        // Text lines on pages
        ctx.fillStyle = '#ccc';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x - 3.5 * s, y0 + (10.5 + i * 1.2) * s, 2.5 * s, 0.4 * s);
            ctx.fillRect(x + 1 * s, y0 + (10.5 + i * 1.2) * s, 2.5 * s, 0.4 * s);
        }
        // Floating icon
        ctx.font = `${Math.max(10, 5 * s)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.6;
        ctx.fillText(Math.floor(time / 3000) % 2 === 0 ? '📚' : '🧠', x, y0 - 2 * s + Math.sin(time * 0.003) * s);
        ctx.globalAlpha = 1;
        ctx.textAlign = 'start';
    }

    // ── SLEEPING ──
    function overlaySleeping(ctx, x, y, s, frame, time) {
        const y0 = y - 20 * s;
        // Close eyes (overwrite)
        px(ctx, x - 8 * s + 6 * s, y0 + 3 * s, s, SKIN);
        px(ctx, x - 8 * s + 7 * s, y0 + 3 * s, s, SKIN);
        px(ctx, x - 8 * s + 9 * s, y0 + 3 * s, s, SKIN);
        px(ctx, x - 8 * s + 10 * s, y0 + 3 * s, s, SKIN);
        // Eye lines
        ctx.strokeStyle = '#666';
        ctx.lineWidth = Math.max(1, s * 0.5);
        ctx.beginPath();
        ctx.moveTo(x - 2.5 * s, y0 + 3.5 * s); ctx.lineTo(x - 0.5 * s, y0 + 3.5 * s); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 1 * s, y0 + 3.5 * s); ctx.lineTo(x + 3 * s, y0 + 3.5 * s); ctx.stroke();

        // ZZZ — bold, cascading
        ctx.textAlign = 'center';
        const zData = [
            { size: 6, x: 4, y: -2, alpha: 0.8 },
            { size: 8, x: 7, y: -6, alpha: 0.6 },
            { size: 11, x: 10, y: -11, alpha: 0.4 },
        ];
        for (const z of zData) {
            ctx.font = `bold ${z.size * s}px "Inter", sans-serif`;
            ctx.fillStyle = `rgba(120,120,200,${z.alpha})`;
            const zy = y0 + z.y * s + Math.sin(time * 0.002 + z.x) * s;
            ctx.fillText('Z', x + z.x * s, zy);
        }
        ctx.textAlign = 'start';
    }

    // ── WALKING ──
    function overlayWalking(ctx, x, y, s, frame, time) {
        // Alternate legs (overwrite shoe rows)
        const y0 = y - 20 * s;
        const x0 = x - 8 * s;
        if (frame % 2 === 0) {
            px(ctx, x0 + 4 * s, y0 + 18 * s, s * 2, SHOE_HI);
            px(ctx, x0 + 9 * s, y0 + 17 * s, s * 2, SHOE);
        } else {
            px(ctx, x0 + 4 * s, y0 + 17 * s, s * 2, SHOE);
            px(ctx, x0 + 9 * s, y0 + 18 * s, s * 2, SHOE_HI);
        }
        // Speed lines
        ctx.strokeStyle = 'rgba(140,140,220,0.25)';
        ctx.lineWidth = Math.max(1, s * 0.5);
        for (let i = 0; i < 3; i++) {
            const ly = y - (2 + i * 5) * s;
            ctx.beginPath();
            ctx.moveTo(x - 10 * s, ly);
            ctx.lineTo(x - (14 + i * 2) * s, ly);
            ctx.stroke();
        }
    }

    // ── SNACKING ──
    function overlaySnacking(ctx, x, y, s, frame, time) {
        const y0 = y - 20 * s;
        px(ctx, x - 8 * s + 2 * s, y0 + 9 * s, s, SKIN);
        ctx.font = `${Math.max(10, 5 * s)}px sans-serif`;
        ctx.textAlign = 'center';
        const foods = ['🍕', '🍩', '🍎', '🌮', '🧁'];
        ctx.fillText(foods[Math.floor(time / 2500) % foods.length], x - 9 * s, y0 + 9 * s);
        if (frame % 3 === 0) {
            ctx.font = `bold ${Math.max(7, 3 * s)}px sans-serif`;
            ctx.fillStyle = 'rgba(255,220,80,0.6)';
            ctx.fillText('nom!', x + 9 * s, y0 + 4 * s);
        }
        ctx.textAlign = 'start';
    }

    // ─── Status dot ────────────────────────────────────────────────
    function drawStatusDot(ctx, x, y, status, time) {
        const pulse = Math.sin(time * 0.005) * 0.3 + 0.7;
        let c;
        switch (status) {
            case 'working': c = `rgba(74,222,128,${pulse})`; break;
            case 'idle': c = `rgba(250,204,21,${pulse})`; break;
            default: c = 'rgba(160,160,184,0.5)';
        }
        const g = ctx.createRadialGradient(x, y, 1, x, y, 8);
        g.addColorStop(0, c); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
    }

    // ─── Name label ────────────────────────────────────────────────
    function drawNameLabel(ctx, x, y, name, color) {
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        const m = ctx.measureText(name);
        const pw = m.width + 10, ph = 16;
        ctx.fillStyle = 'rgba(8,8,18,0.85)';
        ctx.beginPath(); ctx.roundRect(x - pw / 2, y - ph / 2, pw, ph, 6); ctx.fill();
        ctx.strokeStyle = color + '66'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = color;
        ctx.fillText(name, x, y + 4);
        ctx.textAlign = 'start';
    }

    return { AGENTS, FRAME_DURATION, drawAgent, drawStatusDot, drawNameLabel, hexToRgb, darken, lighten };
})();
