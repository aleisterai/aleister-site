/**
 * office-renderer.js
 * Polished pixel office with outdoor landscaping: grass, paths, trees, lake, bushes.
 * The office sits in a landscaped campus.
 */

(function () {
    'use strict';

    const Sprites = window.OfficeSprites;
    const Status = window.OfficeStatus;

    // ─── Grid: larger world with office in center ────────────────
    const TILE = 36;
    const ISO_W = 60;
    const ISO_H = 30;
    const WORLD_COLS = 40;
    const WORLD_ROWS = 34;

    // Office building footprint (centered in world)
    const BLD = { x: 8, y: 6, w: 24, h: 18 };

    // Rooms inside the building
    const ROOMS = {
        aleister: { x: BLD.x, y: BLD.y, w: 6, h: 6, label: "Aleister's Office", icon: '👑' },
        workspace: { x: BLD.x + 7, y: BLD.y, w: 17, h: 9, label: 'Workspace', icon: '💻' },
        hallway: { x: BLD.x, y: BLD.y + 6, w: 24, h: 2, label: '', icon: '' },
        breakroom: { x: BLD.x, y: BLD.y + 8, w: 10, h: 10, label: 'Break Room', icon: '☕' },
        lounge: { x: BLD.x + 11, y: BLD.y + 8, w: 13, h: 10, label: 'Lounge', icon: '🎵' },
    };

    // Desks
    const DESKS = [
        { gx: BLD.x + 9, gy: BLD.y + 2, idx: 0 },
        { gx: BLD.x + 13, gy: BLD.y + 2, idx: 1 },
        { gx: BLD.x + 17, gy: BLD.y + 2, idx: 2 },
        { gx: BLD.x + 9, gy: BLD.y + 5, idx: 3 },
        { gx: BLD.x + 13, gy: BLD.y + 5, idx: 4 },
        { gx: BLD.x + 17, gy: BLD.y + 5, idx: 5 },
        { gx: BLD.x + 21, gy: BLD.y + 2, idx: 6 },
        { gx: BLD.x + 21, gy: BLD.y + 5, idx: 7 },
        { gx: BLD.x + 22, gy: BLD.y + 9, idx: 8 },
    ];
    const ALEISTER_DESK = { gx: BLD.x + 3, gy: BLD.y + 3 };

    // Indoor furniture
    const INDOOR = {
        // Break room — central dining area
        breakTable1: { gx: BLD.x + 4, gy: BLD.y + 13 },
        breakTable2: { gx: BLD.x + 7, gy: BLD.y + 13 },
        breakChairs: [
            { gx: BLD.x + 3, gy: BLD.y + 12 }, { gx: BLD.x + 5, gy: BLD.y + 12 },
            { gx: BLD.x + 4, gy: BLD.y + 14 },
            { gx: BLD.x + 6, gy: BLD.y + 12 }, { gx: BLD.x + 8, gy: BLD.y + 12 },
            { gx: BLD.x + 7, gy: BLD.y + 14 },
        ],
        // Kitchen is drawn as a single cohesive L-shape (see drawKitchenLayout)
        // Piano in lounge
        piano: { gx: BLD.x + 15, gy: BLD.y + 15 },
        sofa1: { gx: BLD.x + 13, gy: BLD.y + 12 },
        sofa2: { gx: BLD.x + 17, gy: BLD.y + 12 },
        sofa3: { gx: BLD.x + 15, gy: BLD.y + 16 },
        musicCorner: { gx: BLD.x + 22, gy: BLD.y + 12 },
        bookshelf: { gx: BLD.x + 22, gy: BLD.y + 15 },
        bookshelf2: { gx: BLD.x + 20, gy: BLD.y + 15 },
        loungeTable: { gx: BLD.x + 15, gy: BLD.y + 14 },
        whiteboard: { gx: BLD.x + 7, gy: BLD.y + 1 },
        whiteboard2: { gx: BLD.x + 4, gy: BLD.y + 1 },
        // New items
        printer: { gx: BLD.x + 23, gy: BLD.y + 4 },
        filingCabinets: [
            { gx: BLD.x + 23, gy: BLD.y + 2 },
            { gx: BLD.x + 23, gy: BLD.y + 3 },
        ],
        wallClock: { gx: BLD.x + 16, gy: BLD.y },
        tvScreen: { gx: BLD.x + 5, gy: BLD.y + 15 },
        coatRack: { gx: BLD.x + 6, gy: BLD.y + 6 },
        trashCans: [
            { gx: BLD.x + 11, gy: BLD.y + 1 },
            { gx: BLD.x + 19, gy: BLD.y + 1 },
            { gx: BLD.x + 9, gy: BLD.y + 9 },
        ],
        rug: { gx: BLD.x + 15, gy: BLD.y + 12, w: 6, h: 4 },
        pictureFrames: [
            { gx: BLD.x + 1, gy: BLD.y + 1 },
            { gx: BLD.x + 3, gy: BLD.y + 1 },
            { gx: BLD.x + 12, gy: BLD.y + 9 },
        ],
        acUnits: [
            { gx: BLD.x + 20, gy: BLD.y },
            { gx: BLD.x + 6, gy: BLD.y + 8 },
        ],
        ceilingLights: [
            { gx: BLD.x + 12, gy: BLD.y + 4 },
            { gx: BLD.x + 18, gy: BLD.y + 4 },
            { gx: BLD.x + 5, gy: BLD.y + 12 },
            { gx: BLD.x + 15, gy: BLD.y + 10 },
        ],
        // Wall art and decorations
        wallArt: [
            { gx: BLD.x + 2, gy: BLD.y + 2, type: 'logo' },
            { gx: BLD.x + 10, gy: BLD.y, type: 'poster' },
            { gx: BLD.x + 14, gy: BLD.y, type: 'chart' },
            { gx: BLD.x + 22, gy: BLD.y, type: 'poster' },
            { gx: BLD.x + 14, gy: BLD.y + 9, type: 'motivational' },
            { gx: BLD.x + 18, gy: BLD.y + 9, type: 'chart' },
            { gx: BLD.x + 3, gy: BLD.y + 15, type: 'poster' },
            { gx: BLD.x + 7, gy: BLD.y + 15, type: 'motivational' },
        ],
        sconces: [
            { gx: BLD.x, gy: BLD.y + 3 },
            { gx: BLD.x + 5, gy: BLD.y + 3 },
            { gx: BLD.x, gy: BLD.y + 12 },
            { gx: BLD.x, gy: BLD.y + 15 },
            { gx: BLD.x + 11, gy: BLD.y + 12 },
            { gx: BLD.x + 23, gy: BLD.y + 12 },
        ],
        serverRack: { gx: BLD.x + 21, gy: BLD.y + 9 },
        floorMats: [
            { gx: BLD.x + 11, gy: BLD.y + 7 },
            { gx: BLD.x + 12, gy: BLD.y + 7 },
            { gx: BLD.x + 13, gy: BLD.y + 7 },
        ],
        windowBlinds: [
            { gx: BLD.x, gy: BLD.y + 1 },
            { gx: BLD.x, gy: BLD.y + 2 },
            { gx: BLD.x + 8, gy: BLD.y },
            { gx: BLD.x + 12, gy: BLD.y },
            { gx: BLD.x + 18, gy: BLD.y },
        ],
        // Desk chairs (one per desk)
        deskChairs: [
            { gx: ALEISTER_DESK.gx, gy: ALEISTER_DESK.gy + 1 },
            { gx: BLD.x + 9, gy: BLD.y + 3 }, { gx: BLD.x + 13, gy: BLD.y + 3 },
            { gx: BLD.x + 17, gy: BLD.y + 3 }, { gx: BLD.x + 21, gy: BLD.y + 3 },
            { gx: BLD.x + 9, gy: BLD.y + 6 }, { gx: BLD.x + 13, gy: BLD.y + 6 },
            { gx: BLD.x + 17, gy: BLD.y + 6 }, { gx: BLD.x + 21, gy: BLD.y + 6 },
            { gx: BLD.x + 22, gy: BLD.y + 10 },
        ],
        // New furniture
        mirrors: [
            { gx: BLD.x + 9, gy: BLD.y + 8 },
            { gx: BLD.x + 2, gy: BLD.y + 4 },
        ],
        relaxChairs: [
            { gx: BLD.x + 12, gy: BLD.y + 14 },
            { gx: BLD.x + 18, gy: BLD.y + 14 },
            { gx: BLD.x + 14, gy: BLD.y + 16 },
            { gx: BLD.x + 16, gy: BLD.y + 16 },
        ],
        airFresheners: [
            { gx: BLD.x + 9, gy: BLD.y + 17 },
            { gx: BLD.x + 20, gy: BLD.y + 17 },
        ],
        lightStands: [
            { gx: BLD.x + 12, gy: BLD.y + 12 },
            { gx: BLD.x + 18, gy: BLD.y + 12 },
            { gx: BLD.x + 3, gy: BLD.y + 3 },
        ],
        printerTable: { gx: BLD.x + 23, gy: BLD.y + 5 },
        indoorPlants: [
            { gx: BLD.x, gy: BLD.y }, { gx: BLD.x + 5, gy: BLD.y },
            { gx: BLD.x + 23, gy: BLD.y }, { gx: BLD.x + 23, gy: BLD.y + 8 },
            { gx: BLD.x + 6, gy: BLD.y + 7 }, { gx: BLD.x, gy: BLD.y + 17 },
            { gx: BLD.x + 23, gy: BLD.y + 17 }, { gx: BLD.x + 10, gy: BLD.y + 8 },
            { gx: BLD.x, gy: BLD.y + 8 }, { gx: BLD.x + 5, gy: BLD.y + 5 },
            { gx: BLD.x, gy: BLD.y + 5 }, { gx: BLD.x + 11, gy: BLD.y + 17 },
            { gx: BLD.x + 18, gy: BLD.y + 17 },
        ],
    };

    // Parking lot (east side)
    const PARKING = { x: BLD.x + BLD.w + 3, y: BLD.y + 2, w: 6, h: 8 };
    const CARS = [
        { gx: PARKING.x + 1, gy: PARKING.y + 1, color: '#dc2626' },
        { gx: PARKING.x + 4, gy: PARKING.y + 1, color: '#2563eb' },
        { gx: PARKING.x + 1, gy: PARKING.y + 4, color: '#16a34a' },
        { gx: PARKING.x + 4, gy: PARKING.y + 4, color: '#9333ea' },
        { gx: PARKING.x + 1, gy: PARKING.y + 7, color: '#f59e0b' },
    ];

    // Outdoor benches & lamp posts
    const BENCHES = [
        { gx: BLD.x + 8, gy: BLD.y + BLD.h + 2 },
        { gx: BLD.x + 16, gy: BLD.y + BLD.h + 2 },
        { gx: 4, gy: 16 },
    ];
    const LAMPS = [
        { gx: BLD.x + 10, gy: BLD.y + BLD.h + 1 },
        { gx: BLD.x + 14, gy: BLD.y + BLD.h + 1 },
        { gx: PARKING.x, gy: PARKING.y },
        { gx: PARKING.x + 5, gy: PARKING.y },
    ];

    // ─── Outdoor landscape elements ──────────────────────────────
    // Walkpath from building entrance to parking/world edge
    const PATHS = [];
    // Main entrance path (south from building)
    for (let y = BLD.y + BLD.h; y < WORLD_ROWS - 2; y++) {
        PATHS.push({ gx: BLD.x + 11, gy: y });
        PATHS.push({ gx: BLD.x + 12, gy: y });
        PATHS.push({ gx: BLD.x + 13, gy: y });
    }
    // Side path (east)
    for (let x = BLD.x + BLD.w; x < WORLD_COLS - 3; x++) {
        PATHS.push({ gx: x, gy: BLD.y + 10 });
        PATHS.push({ gx: x, gy: BLD.y + 11 });
    }
    // Connecting path (west to entrance)
    for (let x = 2; x < BLD.x; x++) {
        PATHS.push({ gx: x, gy: BLD.y + 10 });
        PATHS.push({ gx: x, gy: BLD.y + 11 });
    }

    // Lake (southeast area)
    const LAKE = { cx: 35, cy: 28, rx: 4, ry: 3 };

    // Trees (larger outdoor trees)
    const TREES = [
        { gx: 2, gy: 2 }, { gx: 5, gy: 3 }, { gx: 3, gy: 9 },
        { gx: 1, gy: 14 }, { gx: 4, gy: 20 }, { gx: 2, gy: 26 },
        { gx: 6, gy: 30 },
        { gx: 36, gy: 3 }, { gx: 38, gy: 8 }, { gx: 37, gy: 14 },
        { gx: 35, gy: 20 },
        { gx: 10, gy: 28 }, { gx: 15, gy: 30 }, { gx: 25, gy: 29 },
        { gx: 30, gy: 31 },
        { gx: 20, gy: 2 }, { gx: 28, gy: 3 },
    ];

    // Bushes
    const BUSHES = [
        { gx: BLD.x - 1, gy: BLD.y }, { gx: BLD.x - 1, gy: BLD.y + 3 },
        { gx: BLD.x - 1, gy: BLD.y + 6 }, { gx: BLD.x - 1, gy: BLD.y + 9 },
        { gx: BLD.x - 1, gy: BLD.y + 12 }, { gx: BLD.x - 1, gy: BLD.y + 15 },
        { gx: BLD.x + BLD.w, gy: BLD.y }, { gx: BLD.x + BLD.w, gy: BLD.y + 4 },
        { gx: BLD.x + BLD.w, gy: BLD.y + 8 }, { gx: BLD.x + BLD.w, gy: BLD.y + 14 },
        { gx: BLD.x + BLD.w, gy: BLD.y + 17 },
        { gx: BLD.x + 3, gy: BLD.y + BLD.h }, { gx: BLD.x + 7, gy: BLD.y + BLD.h },
        { gx: BLD.x + 16, gy: BLD.y + BLD.h }, { gx: BLD.x + 20, gy: BLD.y + BLD.h },
        // Near lake
        { gx: 33, gy: 25 }, { gx: 37, gy: 26 }, { gx: 34, gy: 31 },
    ];

    // Flower patches
    const FLOWERS = [
        { gx: BLD.x + 4, gy: BLD.y - 2 }, { gx: BLD.x + 8, gy: BLD.y - 2 },
        { gx: BLD.x + 14, gy: BLD.y - 2 }, { gx: BLD.x + 20, gy: BLD.y - 2 },
        { gx: 12, gy: 28 }, { gx: 22, gy: 30 },
        { gx: BLD.x + 6, gy: BLD.y + BLD.h + 1 }, { gx: BLD.x + 18, gy: BLD.y + BLD.h + 1 },
    ];

    // ─── Path lookup set ─────────────────────────────────────────
    const pathSet = new Set();
    for (const p of PATHS) pathSet.add(`${p.gx},${p.gy}`);

    function isPath(gx, gy) { return pathSet.has(`${gx},${gy}`); }
    function isBuilding(gx, gy) { return gx >= BLD.x && gx < BLD.x + BLD.w && gy >= BLD.y && gy < BLD.y + BLD.h; }
    function isLake(gx, gy) {
        const dx = (gx - LAKE.cx) / LAKE.rx;
        const dy = (gy - LAKE.cy) / LAKE.ry;
        return dx * dx + dy * dy <= 1;
    }

    // ─── Camera ──────────────────────────────────────────────────
    const camera = {
        x: 0, y: 0, zoom: 0.85, targetZoom: 0.85,
        rotation: 0, targetRotation: 0,
        is3D: false, isoBlend: 0,
        isDragging: false, wasDragging: false,
        dragStartX: 0, dragStartY: 0, dragStartCamX: 0, dragStartCamY: 0,
        pinchStartDist: 0, pinchStartZoom: 0,
    };

    const canvas = document.getElementById('office-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, animFrame = 0, lastFrameTime = 0, frameCount = 0;

    function resize() {
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        if (camera.x === 0 && camera.y === 0) centerCamera();
    }

    function getWorldBounds() {
        // Project all 4 world corners to find actual screen-space bounds
        // temporarily remove camera offset to get raw projected coords
        const ox = camera.x, oy = camera.y;
        camera.x = 0; camera.y = 0;
        const corners = [
            gridToScreen(0, 0),
            gridToScreen(WORLD_COLS, 0),
            gridToScreen(0, WORLD_ROWS),
            gridToScreen(WORLD_COLS, WORLD_ROWS),
        ];
        camera.x = ox; camera.y = oy;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (const c of corners) {
            if (c.x < minX) minX = c.x;
            if (c.x > maxX) maxX = c.x;
            if (c.y < minY) minY = c.y;
            if (c.y > maxY) maxY = c.y;
        }
        return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
    }

    function getMinZoom() {
        // Save current zoom and compute bounds at zoom=1 to find scale
        const saved = camera.zoom;
        camera.zoom = 1;
        const b = getWorldBounds();
        camera.zoom = saved;
        return Math.max(W / b.w, H / b.h, 0.3);
    }

    function centerCamera() {
        const b = getWorldBounds();
        camera.x = W / 2 - (b.minX + b.w / 2);
        camera.y = H / 2 - (b.minY + b.h / 2);
    }

    function clampCamera() {
        const b = getWorldBounds();
        const worldW = b.w, worldH = b.h;
        if (worldW <= W) {
            camera.x = W / 2 - (b.minX + worldW / 2);
        } else {
            const minCX = W - (b.maxX);
            const maxCX = -(b.minX);
            camera.x = Math.max(minCX, Math.min(maxCX, camera.x));
        }
        if (worldH <= H) {
            camera.y = H / 2 - (b.minY + worldH / 2);
        } else {
            const minCY = H - (b.maxY);
            const maxCY = -(b.minY);
            camera.y = Math.max(minCY, Math.min(maxCY, camera.y));
        }
    }

    function gridToScreen(gx, gy) {
        const b = camera.isoBlend;
        // In 3D mode, rotate grid coordinates around the world center
        if (Math.abs(camera.rotation) > 0.1) {
            const cx = WORLD_COLS / 2, cy = WORLD_ROWS / 2;
            const dx = gx - cx, dy = gy - cy;
            const a = camera.rotation * Math.PI / 180;
            const cosA = Math.cos(a), sinA = Math.sin(a);
            gx = cx + dx * cosA - dy * sinA;
            gy = cy + dx * sinA + dy * cosA;
        }
        const fx = gx * TILE, fy = gy * TILE;
        const ix = (gx - gy) * (ISO_W / 2), iy = (gx + gy) * (ISO_H / 2);
        return {
            x: (fx * (1 - b) + ix * b) * camera.zoom + camera.x,
            y: (fy * (1 - b) + iy * b) * camera.zoom + camera.y,
        };
    }

    // ─── Time of day ──────────────────────────────────────────────
    const TOD_MODES = ['dawn', 'day', 'evening', 'night'];
    const TOD_ICONS = { dawn: '🌅', day: '☀️', evening: '🌇', night: '🌙' };
    const TOD_LABELS = { dawn: 'Dawn', day: 'Day', evening: 'Eve', night: 'Night' };
    let timeOfDay = (() => {
        const h = new Date().getHours();
        if (h >= 0 && h <= 6) return 'night';    // 12:01 AM – 6:00 AM
        if (h >= 7 && h <= 12) return 'dawn';     // 6:01 AM  – 12:00 PM
        if (h >= 13 && h <= 18) return 'day';     // 12:01 PM – 6:00 PM
        return 'evening';                          // 6:01 PM  – 12:00 AM
    })();

    // ─── Colors ──────────────────────────────────────────────────
    function C() {
        const t = timeOfDay;
        const d = t === 'night' || t === 'evening'; // legacy compat
        const palettes = {
            dawn: {
                d, bg: '#f8e8d8',
                grass1: '#8ab870', grass2: '#96c47a', grassDark: '#70a060',
                pathStone: '#d8c8a8', pathStone2: '#cec0a0', pathEdge: '#b8a888',
                lake1: '#80b8c8', lake2: '#90c8d8', lakeEdge: '#68a0b0', lakeShine: 'rgba(255,220,180,0.35)',
                treeTrunk: '#8a6828', treeLeaf1: '#40a050', treeLeaf2: '#50b060', treeLeaf3: '#68c870',
                bushGreen: '#48a050', bushLight: '#68c070',
                flowerPink: '#ff8ab0', flowerYellow: '#ffe860', flowerBlue: '#80b0ff', flowerWhite: '#fff0f0',
                bldWall: '#c8b0a0', bldWallHi: '#d8c0b0', bldRoof: '#a89888',
                floor1: '#f0e0d0', floor2: '#e8d8c8', aleisterFloor: '#e0e8f0', breakFloor: '#f8e0e8',
                loungeFloor: '#e0f0e0', hallFloor: '#e8e0d8',
                wall: '#c0a898', grid: 'rgba(120,80,40,0.04)', label: '#887060',
                deskTop: '#c8a060', deskLeg: '#a88050', chair: '#6a6ac0', coffee: '#908080',
                sofa: '#a078b8', shelf: '#b89060', counter: '#c8a060',
                nBlue: '#40b8e0', nPink: '#ff80c8', nGreen: '#50c870', nPurple: '#a060e0',
            },
            day: {
                d: false, bg: '#e8eef8',
                grass1: '#7cc47a', grass2: '#88d084', grassDark: '#60a060',
                pathStone: '#c8c4b8', pathStone2: '#b8b4a8', pathEdge: '#a8a498',
                lake1: '#5ab8e0', lake2: '#68c8ee', lakeEdge: '#48a8c4', lakeShine: 'rgba(255,255,255,0.3)',
                treeTrunk: '#8B6914', treeLeaf1: '#22a040', treeLeaf2: '#2cb050', treeLeaf3: '#44cc60',
                bushGreen: '#30a048', bushLight: '#50c868',
                flowerPink: '#ff6b9d', flowerYellow: '#ffe040', flowerBlue: '#60a0ff', flowerWhite: '#f0f0ff',
                bldWall: '#b0b4cc', bldWallHi: '#c0c4d8', bldRoof: '#8888aa',
                floor1: '#e0e2f0', floor2: '#d8dae8', aleisterFloor: '#d4e4f8', breakFloor: '#f4dce8',
                loungeFloor: '#d4f0dc', hallFloor: '#d8d8ec',
                wall: '#b8bcd4', grid: 'rgba(80,80,160,0.04)', label: '#6668aa',
                deskTop: '#d4a870', deskLeg: '#b89060', chair: '#6a6ad0', coffee: '#808098',
                sofa: '#9870c8', shelf: '#b89060', counter: '#d0a868',
                nBlue: '#00d4ff', nPink: '#ff6bda', nGreen: '#4ade80', nPurple: '#a855f7',
            },
            evening: {
                d: true, bg: '#1a1020',
                grass1: '#1a3818', grass2: '#204020', grassDark: '#142c10',
                pathStone: '#3a3028', pathStone2: '#302820', pathEdge: '#282018',
                lake1: '#183040', lake2: '#203848', lakeEdge: '#102030', lakeShine: 'rgba(255,160,80,0.15)',
                treeTrunk: '#5a3810', treeLeaf1: '#184820', treeLeaf2: '#1c5428', treeLeaf3: '#286830',
                bushGreen: '#184820', bushLight: '#207030',
                flowerPink: '#c04870', flowerYellow: '#c8a030', flowerBlue: '#4070b0', flowerWhite: '#b0b0c0',
                bldWall: '#2a2040', bldWallHi: '#342850', bldRoof: '#1a1430',
                floor1: '#1c1830', floor2: '#201c38', aleisterFloor: '#182038', breakFloor: '#281828',
                loungeFloor: '#142018', hallFloor: '#1c1a30',
                wall: '#2a2448', grid: 'rgba(100,80,140,0.05)', label: '#806888',
                deskTop: '#5a4020', deskLeg: '#4a3018', chair: '#4040a0', coffee: '#504050',
                sofa: '#583888', shelf: '#5a3818', counter: '#5a4020',
                nBlue: '#3090c0', nPink: '#c050a0', nGreen: '#38a860', nPurple: '#8040c0',
            },
            night: {
                d: true, bg: '#060810',
                grass1: '#0a2810', grass2: '#0c3214', grassDark: '#082008',
                pathStone: '#2a2a38', pathStone2: '#222230', pathEdge: '#1a1a28',
                lake1: '#0a2040', lake2: '#0d2850', lakeEdge: '#081830', lakeShine: 'rgba(100,200,255,0.15)',
                treeTrunk: '#3a2210', treeLeaf1: '#106820', treeLeaf2: '#0e5418', treeLeaf3: '#1a8830',
                bushGreen: '#0c4818', bushLight: '#149028',
                flowerPink: '#802050', flowerYellow: '#a08020', flowerBlue: '#305080', flowerWhite: '#808898',
                bldWall: '#1e1e3c', bldWallHi: '#282850', bldRoof: '#14142a',
                floor1: '#16162e', floor2: '#1a1a36', aleisterFloor: '#0e2040', breakFloor: '#301828',
                loungeFloor: '#0e2818', hallFloor: '#18182e',
                wall: '#222244', grid: 'rgba(100,100,200,0.04)', label: '#7070aa',
                deskTop: '#4a3a22', deskLeg: '#3a2a18', chair: '#3838a0', coffee: '#444466',
                sofa: '#6838a0', shelf: '#4a3218', counter: '#4a3220',
                nBlue: '#00d4ff', nPink: '#ff6bda', nGreen: '#4ade80', nPurple: '#a855f7',
            },
        };
        return palettes[t] || palettes.day;
    }

    // ─── Draw tile ───────────────────────────────────────────────
    function drawTile(gx, gy, fill, stroke) {
        const p = gridToScreen(gx, gy);
        const b = camera.isoBlend;
        const hw = ((TILE / 2) * (1 - b) + (ISO_W / 2) * b) * camera.zoom;
        const hh = ((TILE / 2) * (1 - b) + (ISO_H / 2) * b) * camera.zoom;
        ctx.beginPath();
        if (b < 0.05) ctx.rect(p.x - hw, p.y - hh, hw * 2, hh * 2);
        else { ctx.moveTo(p.x, p.y - hh); ctx.lineTo(p.x + hw, p.y); ctx.lineTo(p.x, p.y + hh); ctx.lineTo(p.x - hw, p.y); }
        ctx.closePath();
        ctx.fillStyle = fill; ctx.fill();
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.5; ctx.stroke(); }
    }

    // ─── Draw landscape elements ─────────────────────────────────
    function drawTree(gx, gy, time, c) {
        const p = gridToScreen(gx, gy);
        const z = camera.zoom;
        const sway = Math.sin(time * 0.001 + gx * 0.5 + gy * 0.3) * 1.5 * z;
        // Trunk
        ctx.fillStyle = c.treeTrunk;
        ctx.fillRect(p.x - 2 * z, p.y - 8 * z, 4 * z, 12 * z);
        ctx.fillStyle = Sprites.darken(c.treeTrunk, 0.2);
        ctx.fillRect(p.x - 2 * z, p.y - 8 * z, 1.5 * z, 12 * z);
        // Foliage layers (bottom to top)
        const layers = [
            { y: -14, r: 12, color: c.treeLeaf1 },
            { y: -20, r: 10, color: c.treeLeaf2 },
            { y: -25, r: 7, color: c.treeLeaf3 },
        ];
        for (const l of layers) {
            ctx.fillStyle = l.color;
            ctx.beginPath();
            ctx.arc(p.x + sway, p.y + l.y * z, l.r * z, 0, Math.PI * 2);
            ctx.fill();
            // Highlight
            ctx.fillStyle = Sprites.lighten(l.color, 0.2);
            ctx.beginPath();
            ctx.arc(p.x + sway - 2 * z, p.y + (l.y - 2) * z, l.r * z * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        // Shadow on ground
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 3 * z, 10 * z, 4 * z, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawBush(gx, gy, time, c) {
        const p = gridToScreen(gx, gy);
        const z = camera.zoom;
        const sw = Math.sin(time * 0.0012 + gx) * z;
        ctx.fillStyle = c.bushGreen;
        ctx.beginPath();
        ctx.arc(p.x + sw, p.y - 5 * z, 9 * z, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.bushLight;
        ctx.beginPath();
        ctx.arc(p.x + sw + 4 * z, p.y - 7 * z, 6 * z, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x + sw - 3 * z, p.y - 8 * z, 5 * z, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawFlowerPatch(gx, gy, time, c) {
        const p = gridToScreen(gx, gy);
        const z = camera.zoom;
        const flowerColors = [c.flowerPink, c.flowerYellow, c.flowerBlue, c.flowerWhite];
        // Small cluster of flowers
        for (let i = 0; i < 5; i++) {
            const fx = p.x + (i - 2) * 3 * z + Math.sin(i * 1.7) * 2 * z;
            const fy = p.y + Math.cos(i * 2.3) * 3 * z;
            // Stem
            ctx.strokeStyle = '#2a8030';
            ctx.lineWidth = z;
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(fx, fy + 4 * z);
            ctx.stroke();
            // Petals
            ctx.fillStyle = flowerColors[i % flowerColors.length];
            ctx.beginPath();
            ctx.arc(fx, fy, 2 * z, 0, Math.PI * 2);
            ctx.fill();
            // Center
            ctx.fillStyle = '#ffe000';
            ctx.beginPath();
            ctx.arc(fx, fy, 0.8 * z, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawLake(time, c) {
        const z = camera.zoom;
        // Draw lake tiles
        for (let gy = LAKE.cy - LAKE.ry - 1; gy <= LAKE.cy + LAKE.ry + 1; gy++) {
            for (let gx = LAKE.cx - LAKE.rx - 1; gx <= LAKE.cx + LAKE.rx + 1; gx++) {
                if (!isLake(gx, gy)) continue;
                const dist = Math.sqrt(((gx - LAKE.cx) / LAKE.rx) ** 2 + ((gy - LAKE.cy) / LAKE.ry) ** 2);
                const color = dist > 0.7 ? c.lakeEdge : (gx + gy) % 2 === 0 ? c.lake1 : c.lake2;
                drawTile(gx, gy, color, null);
            }
        }
        // Shimmer/ripples
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 4; i++) {
            const p = gridToScreen(
                LAKE.cx + Math.sin(time * 0.001 + i * 1.5) * LAKE.rx * 0.5,
                LAKE.cy + Math.cos(time * 0.0008 + i * 2) * LAKE.ry * 0.4
            );
            ctx.fillStyle = c.lakeShine;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, 8 * z, 3 * z, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // ─── Isometric wall path helper ────────────────────────────────
    function drawIsoRect(x, y, w, h, strokeColor, lineW) {
        const tl = gridToScreen(x, y);
        const tr = gridToScreen(x + w, y);
        const br = gridToScreen(x + w, y + h);
        const bl = gridToScreen(x, y + h);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineW;
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y); ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y); ctx.lineTo(bl.x, bl.y);
        ctx.closePath(); ctx.stroke();
    }

    // ─── Building walls ──────────────────────────────────────────
    function drawBuildingShell(c) {
        const z = camera.zoom;
        // Building outline — follows isometric grid
        drawIsoRect(BLD.x, BLD.y, BLD.w, BLD.h, c.bldWall, 4 * z);

        // Room walls — also isometric
        for (const [key, room] of Object.entries(ROOMS)) {
            if (key === 'hallway') continue;
            drawIsoRect(room.x, room.y, room.w, room.h, c.wall, 2 * z);
            if (room.label) {
                const center = gridToScreen(room.x + room.w / 2, room.y + 1);
                ctx.font = `600 ${9 * z}px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillStyle = c.label;
                ctx.globalAlpha = 0.55;
                ctx.fillText(`${room.icon} ${room.label}`, center.x, center.y);
                ctx.globalAlpha = 1;
                ctx.textAlign = 'start';
            }
        }
        // Doors — drawn as gaps in the wall with door frames
        const doorPositions = [
            { gx: BLD.x + 4, gy: BLD.y + 8 },  // break room to hallway
            { gx: BLD.x + 12, gy: BLD.y + 8 }, // lounge to hallway
            { gx: BLD.x + 5, gy: BLD.y + 6 },  // aleister's office to hallway
        ];
        for (const d of doorPositions) {
            const dp = gridToScreen(d.gx, d.gy);
            ctx.fillStyle = c.d ? '#554422' : '#8B6914';
            ctx.fillRect(dp.x - 8 * z, dp.y - 18 * z, 16 * z, 20 * z);
            ctx.fillStyle = c.d ? '#443311' : '#a07828';
            ctx.fillRect(dp.x - 6 * z, dp.y - 16 * z, 12 * z, 16 * z);
            ctx.fillStyle = '#daa520';
            ctx.beginPath(); ctx.arc(dp.x + 3 * z, dp.y - 8 * z, 1.2 * z, 0, Math.PI * 2); ctx.fill();
        }
        // Building sign
        const entrP = gridToScreen(BLD.x + BLD.w / 2, BLD.y + BLD.h + 1);
        ctx.font = `bold ${10 * z}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = c.nBlue;
        ctx.globalAlpha = 0.7;
        ctx.fillText('ALEISTER HQ', entrP.x, entrP.y);
        ctx.globalAlpha = 1;
        ctx.textAlign = 'start';
    }

    // ─── Extra furniture draw functions ───────────────────────────
    function drawWhiteboard(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#f0f0f8';
        ctx.beginPath(); ctx.roundRect(p.x - 16 * z, p.y - 28 * z, 32 * z, 22 * z, 3 * z); ctx.fill();
        ctx.strokeStyle = '#888'; ctx.lineWidth = 2 * z; ctx.stroke();
        // Marker doodles
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.5 * z;
        ctx.beginPath(); ctx.moveTo(p.x - 10 * z, p.y - 20 * z); ctx.lineTo(p.x - 4 * z, p.y - 14 * z); ctx.lineTo(p.x + 2 * z, p.y - 22 * z); ctx.stroke();
        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath(); ctx.moveTo(p.x + 4 * z, p.y - 18 * z); ctx.lineTo(p.x + 12 * z, p.y - 12 * z); ctx.stroke();
        // Stand
        ctx.fillStyle = '#666';
        ctx.fillRect(p.x - 2 * z, p.y - 6 * z, 4 * z, 8 * z);
        ctx.fillRect(p.x - 8 * z, p.y + 2 * z, 16 * z, 2 * z);
    }

    function drawWaterCooler(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#d0d8e8';
        ctx.beginPath(); ctx.roundRect(p.x - 6 * z, p.y - 22 * z, 12 * z, 24 * z, 2 * z); ctx.fill();
        // Water jug
        ctx.fillStyle = '#88ccff';
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.roundRect(p.x - 4 * z, p.y - 20 * z, 8 * z, 10 * z, 3 * z); ctx.fill();
        ctx.globalAlpha = 1;
        // Tap
        ctx.fillStyle = '#999';
        ctx.fillRect(p.x + 3 * z, p.y - 8 * z, 4 * z, 2 * z);
        // Cup
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(p.x + 4 * z, p.y - 6 * z, 3 * z, 4 * z);
    }

    function drawCar(gx, gy, color, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 6 * z, 16 * z, 5 * z, 0, 0, Math.PI * 2); ctx.fill();
        // Car body
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.roundRect(p.x - 15 * z, p.y - 8 * z, 30 * z, 16 * z, 4 * z); ctx.fill();
        // Roof
        ctx.fillStyle = Sprites.darken(color, 0.15);
        ctx.beginPath(); ctx.roundRect(p.x - 9 * z, p.y - 14 * z, 18 * z, 9 * z, 3 * z); ctx.fill();
        // Windows
        ctx.fillStyle = '#aaddff';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(p.x - 7 * z, p.y - 12 * z, 6 * z, 5 * z);
        ctx.fillRect(p.x + 1 * z, p.y - 12 * z, 6 * z, 5 * z);
        ctx.globalAlpha = 1;
        // Headlights
        ctx.fillStyle = '#ffe066'; ctx.beginPath(); ctx.arc(p.x - 13 * z, p.y - 2 * z, 1.5 * z, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 13 * z, p.y - 2 * z, 1.5 * z, 0, Math.PI * 2); ctx.fill();
        // Wheels
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(p.x - 9 * z, p.y + 7 * z, 3.5 * z, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 9 * z, p.y + 7 * z, 3.5 * z, 0, Math.PI * 2); ctx.fill();
        // Hubcaps
        ctx.fillStyle = '#666';
        ctx.beginPath(); ctx.arc(p.x - 9 * z, p.y + 7 * z, 1.5 * z, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 9 * z, p.y + 7 * z, 1.5 * z, 0, Math.PI * 2); ctx.fill();
    }

    function drawBench(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        // Seat slats
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(p.x - 15 * z, p.y - 2 * z, 30 * z, 3 * z);
        ctx.fillRect(p.x - 15 * z, p.y + 1.5 * z, 30 * z, 2.5 * z);
        // Backrest
        ctx.fillStyle = '#7a5a10';
        ctx.fillRect(p.x - 14 * z, p.y - 6 * z, 28 * z, 3 * z);
        // Cast iron legs
        ctx.fillStyle = '#444';
        ctx.fillRect(p.x - 13 * z, p.y + 4 * z, 3 * z, 6 * z);
        ctx.fillRect(p.x + 10 * z, p.y + 4 * z, 3 * z, 6 * z);
    }

    function drawLampPost(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#555';
        ctx.fillRect(p.x - 1 * z, p.y - 22 * z, 2 * z, 24 * z);
        // Lamp head
        ctx.fillStyle = '#888';
        ctx.beginPath(); ctx.roundRect(p.x - 5 * z, p.y - 24 * z, 10 * z, 4 * z, 2 * z); ctx.fill();
        // Glow
        ctx.fillStyle = c.d ? 'rgba(255,220,100,0.08)' : 'rgba(255,220,100,0.04)';
        ctx.beginPath(); ctx.arc(p.x, p.y - 20 * z, 14 * z, 0, Math.PI * 2); ctx.fill();
    }

    // ─── New furniture draw functions ─────────────────────────────
    function drawPrinter(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#444458' : '#d0d0dc';
        ctx.beginPath(); ctx.roundRect(p.x - 10 * z, p.y - 12 * z, 20 * z, 14 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#333345' : '#bbbbc8';
        ctx.fillRect(p.x - 8 * z, p.y - 14 * z, 16 * z, 4 * z);
        ctx.fillStyle = '#1a1a28';
        ctx.fillRect(p.x - 6 * z, p.y - 10 * z, 12 * z, 3 * z);
        ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(p.x + 6 * z, p.y - 5 * z, 1.5 * z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f5f0e8';
        ctx.fillRect(p.x - 4 * z, p.y - 2 * z, 8 * z, 3 * z);
    }

    function drawFilingCabinet(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#3a3a50' : '#a0a0b0';
        ctx.beginPath(); ctx.roundRect(p.x - 8 * z, p.y - 20 * z, 16 * z, 22 * z, 2 * z); ctx.fill();
        ctx.strokeStyle = c.d ? '#555' : '#888'; ctx.lineWidth = z * 0.8;
        for (let i = 0; i < 3; i++) {
            const dy = p.y - 17 * z + i * 7 * z;
            ctx.strokeRect(p.x - 6 * z, dy, 12 * z, 5 * z);
            ctx.fillStyle = '#888'; ctx.beginPath(); ctx.arc(p.x, dy + 2.5 * z, 1 * z, 0, Math.PI * 2); ctx.fill();
        }
    }

    function drawWallClock(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#222238' : '#f0f0f0';
        ctx.beginPath(); ctx.arc(p.x, p.y - 6 * z, 8 * z, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = c.d ? '#555' : '#999'; ctx.lineWidth = 1.5 * z; ctx.stroke();
        ctx.fillStyle = c.d ? '#888' : '#333';
        for (let i = 0; i < 12; i++) {
            const a = i * Math.PI / 6;
            ctx.beginPath(); ctx.arc(p.x + Math.sin(a) * 6 * z, p.y - 6 * z - Math.cos(a) * 6 * z, 0.6 * z, 0, Math.PI * 2); ctx.fill();
        }
        const t = (time / 1000) % 60;
        const ha = (t / 60) * Math.PI * 2 - Math.PI / 2;
        const ma = ((t * 12) % 60 / 60) * Math.PI * 2 - Math.PI / 2;
        ctx.strokeStyle = c.d ? '#aaa' : '#333'; ctx.lineWidth = 1.5 * z;
        ctx.beginPath(); ctx.moveTo(p.x, p.y - 6 * z); ctx.lineTo(p.x + Math.cos(ha) * 4 * z, p.y - 6 * z + Math.sin(ha) * 4 * z); ctx.stroke();
        ctx.lineWidth = z;
        ctx.beginPath(); ctx.moveTo(p.x, p.y - 6 * z); ctx.lineTo(p.x + Math.cos(ma) * 5.5 * z, p.y - 6 * z + Math.sin(ma) * 5.5 * z); ctx.stroke();
    }

    function drawTVScreen(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.roundRect(p.x - 18 * z, p.y - 22 * z, 36 * z, 22 * z, 3 * z); ctx.fill();
        const g = ctx.createLinearGradient(p.x - 16 * z, p.y - 20 * z, p.x + 16 * z, p.y - 2 * z);
        g.addColorStop(0, '#1a3868'); g.addColorStop(0.5, '#2a5898'); g.addColorStop(1, '#1a3060');
        ctx.fillStyle = g; ctx.globalAlpha = 0.7;
        ctx.fillRect(p.x - 16 * z, p.y - 20 * z, 32 * z, 18 * z); ctx.globalAlpha = 1;
        ctx.font = `bold ${5 * z}px Inter, sans-serif`; ctx.textAlign = 'center';
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.6;
        ctx.fillText('📊 Dashboard', p.x, p.y - 10 * z); ctx.globalAlpha = 1; ctx.textAlign = 'start';
        ctx.fillStyle = '#333';
        ctx.fillRect(p.x - 2 * z, p.y, 4 * z, 3 * z);
        ctx.fillRect(p.x - 6 * z, p.y + 3 * z, 12 * z, 1.5 * z);
    }

    function drawCoatRack(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#666';
        ctx.fillRect(p.x - 1 * z, p.y - 24 * z, 2 * z, 26 * z);
        ctx.fillRect(p.x - 8 * z, p.y + 2 * z, 16 * z, 2 * z);
        for (const dx of [-6, -2, 2, 6]) {
            ctx.fillRect(p.x + dx * z - 0.5 * z, p.y - 24 * z, 1 * z, 4 * z);
        }
        ctx.fillStyle = '#3a5580';
        ctx.beginPath(); ctx.roundRect(p.x - 5 * z, p.y - 20 * z, 4 * z, 10 * z, 1 * z); ctx.fill();
        ctx.fillStyle = '#884422';
        ctx.beginPath(); ctx.roundRect(p.x + 2 * z, p.y - 18 * z, 4 * z, 8 * z, 1 * z); ctx.fill();
    }

    function drawTrashCan(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#3a3a4a' : '#888';
        ctx.beginPath(); ctx.roundRect(p.x - 4 * z, p.y - 8 * z, 8 * z, 10 * z, 1.5 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#444458' : '#999';
        ctx.fillRect(p.x - 5 * z, p.y - 9 * z, 10 * z, 2 * z);
    }

    function drawRug(gx, gy, w, h, c) {
        const z = camera.zoom;
        for (let dy = 0; dy < h; dy++) {
            for (let dx = 0; dx < w; dx++) {
                const p = gridToScreen(gx + dx, gy + dy);
                const b = camera.isoBlend;
                const hw = ((TILE / 2) * (1 - b) + (ISO_W / 2) * b) * z;
                const hh = ((TILE / 2) * (1 - b) + (ISO_H / 2) * b) * z;
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = (dx + dy) % 2 === 0 ? '#a855f7' : '#7c3aed';
                ctx.beginPath();
                if (b < 0.05) ctx.rect(p.x - hw, p.y - hh, hw * 2, hh * 2);
                else { ctx.moveTo(p.x, p.y - hh); ctx.lineTo(p.x + hw, p.y); ctx.lineTo(p.x, p.y + hh); ctx.lineTo(p.x - hw, p.y); }
                ctx.closePath(); ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
    }

    function drawPictureFrame(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(p.x - 6 * z, p.y - 12 * z, 12 * z, 10 * z);
        const colors = ['#2563eb', '#dc2626', '#059669'];
        ctx.fillStyle = colors[(gx * 7 + gy * 3) % colors.length];
        ctx.globalAlpha = 0.5;
        ctx.fillRect(p.x - 5 * z, p.y - 11 * z, 10 * z, 8 * z);
        ctx.globalAlpha = 1;
    }

    function drawACUnit(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#3a3a50' : '#e0e0e8';
        ctx.beginPath(); ctx.roundRect(p.x - 12 * z, p.y - 6 * z, 24 * z, 8 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#2a2a40' : '#ccc';
        for (let i = 0; i < 5; i++) ctx.fillRect(p.x - 10 * z + i * 4.5 * z, p.y - 4 * z, 3 * z, 4 * z);
        if (Math.sin(time * 0.003) > 0) {
            ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(p.x + 9 * z, p.y - 4 * z, 1.2 * z, 0, Math.PI * 2); ctx.fill();
        }
    }

    function drawCeilingLight(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? 'rgba(255,240,180,0.06)' : 'rgba(255,240,180,0.04)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 16 * z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c.d ? '#888' : '#ddd';
        ctx.beginPath(); ctx.roundRect(p.x - 4 * z, p.y - 2 * z, 8 * z, 3 * z, 1.5 * z); ctx.fill();
    }

    function drawWallArt(gx, gy, type, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        if (type === 'logo') {
            // Company logo wall piece
            ctx.fillStyle = c.d ? '#1a1a30' : '#f8f8ff';
            ctx.beginPath(); ctx.roundRect(p.x - 14 * z, p.y - 16 * z, 28 * z, 18 * z, 3 * z); ctx.fill();
            ctx.strokeStyle = c.nBlue; ctx.lineWidth = 2 * z; ctx.stroke();
            ctx.font = `bold ${7 * z}px Inter, sans-serif`; ctx.textAlign = 'center';
            ctx.fillStyle = c.nBlue; ctx.fillText('A', p.x - 2 * z, p.y - 4 * z);
            ctx.fillStyle = c.nPink; ctx.fillText('I', p.x + 5 * z, p.y - 4 * z);
            ctx.font = `${4 * z}px Inter, sans-serif`;
            ctx.fillStyle = c.d ? '#888' : '#666'; ctx.fillText('ALEISTER', p.x, p.y - 12 * z);
            ctx.textAlign = 'start';
        } else if (type === 'poster') {
            ctx.fillStyle = c.d ? '#1a2840' : '#e8f0ff';
            ctx.beginPath(); ctx.roundRect(p.x - 10 * z, p.y - 14 * z, 20 * z, 14 * z, 2 * z); ctx.fill();
            ctx.strokeStyle = c.d ? '#334' : '#bbc'; ctx.lineWidth = z; ctx.stroke();
            // Abstract art shapes
            const hue = (gx * 37 + gy * 53) % 360;
            ctx.fillStyle = `hsl(${hue}, 60%, ${c.d ? 40 : 65}%)`; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(p.x - 3 * z, p.y - 8 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = `hsl(${(hue + 120) % 360}, 60%, ${c.d ? 45 : 60}%)`;
            ctx.beginPath(); ctx.arc(p.x + 4 * z, p.y - 6 * z, 3 * z, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
        } else if (type === 'chart') {
            ctx.fillStyle = c.d ? '#1a1a30' : '#fff';
            ctx.beginPath(); ctx.roundRect(p.x - 10 * z, p.y - 14 * z, 20 * z, 14 * z, 2 * z); ctx.fill();
            ctx.strokeStyle = c.d ? '#334' : '#ccc'; ctx.lineWidth = z; ctx.stroke();
            // Bar chart
            const barColors = [c.nBlue, c.nGreen, c.nPink, c.nPurple];
            for (let i = 0; i < 4; i++) {
                const bh = (3 + ((gx * 7 + i * 11) % 7)) * z;
                ctx.fillStyle = barColors[i]; ctx.globalAlpha = 0.7;
                ctx.fillRect(p.x - 8 * z + i * 4.5 * z, p.y - 3 * z - bh, 3 * z, bh);
            }
            ctx.globalAlpha = 1;
        } else if (type === 'motivational') {
            ctx.fillStyle = c.d ? '#281828' : '#fff8f0';
            ctx.beginPath(); ctx.roundRect(p.x - 12 * z, p.y - 14 * z, 24 * z, 14 * z, 2 * z); ctx.fill();
            ctx.strokeStyle = c.d ? '#443' : '#ddc'; ctx.lineWidth = z; ctx.stroke();
            ctx.font = `bold ${4 * z}px Inter, sans-serif`; ctx.textAlign = 'center';
            ctx.fillStyle = c.d ? '#a88' : '#664';
            const quotes = ['✨ SHIP IT', '🚀 DREAM BIG', '💪 HUSTLE', '🔥 BUILD'];
            ctx.fillText(quotes[(gx + gy) % quotes.length], p.x, p.y - 6 * z);
            ctx.textAlign = 'start';
        }
    }

    function drawSconce(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#8B6914';
        ctx.beginPath(); ctx.roundRect(p.x - 3 * z, p.y - 10 * z, 6 * z, 8 * z, 1.5 * z); ctx.fill();
        // Warm glow
        const glow = 0.04 + Math.sin(time * 0.002 + gx) * 0.02;
        ctx.fillStyle = `rgba(255,200,80,${glow})`;
        ctx.beginPath(); ctx.arc(p.x, p.y - 8 * z, 10 * z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffcc44'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y - 10 * z, 2 * z, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawServerRack(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#1a1a2a' : '#333';
        ctx.beginPath(); ctx.roundRect(p.x - 10 * z, p.y - 28 * z, 20 * z, 30 * z, 2 * z); ctx.fill();
        // Rack units
        for (let i = 0; i < 5; i++) {
            const uy = p.y - 25 * z + i * 5.5 * z;
            ctx.fillStyle = c.d ? '#222238' : '#444';
            ctx.fillRect(p.x - 8 * z, uy, 16 * z, 4 * z);
            // Blinking LEDs
            for (let j = 0; j < 3; j++) {
                const on = Math.sin(time * 0.005 + i * 1.3 + j * 2.1) > 0;
                ctx.fillStyle = on ? '#4ade80' : '#333';
                ctx.beginPath(); ctx.arc(p.x - 5 * z + j * 3 * z, uy + 2 * z, 0.8 * z, 0, Math.PI * 2); ctx.fill();
            }
            // Vent lines
            ctx.fillStyle = c.d ? '#2a2a40' : '#555';
            for (let v = 0; v < 3; v++) ctx.fillRect(p.x + 2 * z + v * 2 * z, uy + 0.5 * z, 0.8 * z, 3 * z);
        }
    }

    function drawFloorMat(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        const b = camera.isoBlend;
        const hw = ((TILE / 2) * (1 - b) + (ISO_W / 2) * b) * z;
        const hh = ((TILE / 2) * (1 - b) + (ISO_H / 2) * b) * z;
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#666';
        ctx.beginPath();
        if (b < 0.05) ctx.rect(p.x - hw, p.y - hh, hw * 2, hh * 2);
        else { ctx.moveTo(p.x, p.y - hh); ctx.lineTo(p.x + hw, p.y); ctx.lineTo(p.x, p.y + hh); ctx.lineTo(p.x - hw, p.y); }
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawWindowBlind(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#2a3048' : '#dde4f0';
        ctx.fillRect(p.x - 8 * z, p.y - 14 * z, 16 * z, 16 * z);
        // Blind slats
        ctx.strokeStyle = c.d ? '#3a4058' : '#c8d0e0'; ctx.lineWidth = 0.6 * z;
        for (let i = 0; i < 8; i++) {
            const sy = p.y - 13 * z + i * 1.8 * z;
            ctx.beginPath(); ctx.moveTo(p.x - 7 * z, sy); ctx.lineTo(p.x + 7 * z, sy); ctx.stroke();
        }
        // Light through blinds
        ctx.fillStyle = c.d ? 'rgba(80,120,200,0.04)' : 'rgba(200,220,255,0.15)';
        ctx.fillRect(p.x - 7 * z, p.y - 12 * z, 14 * z, 14 * z);
    }

    function drawDeskChair(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        // Star base (wheels)
        ctx.fillStyle = '#555';
        for (let i = 0; i < 5; i++) {
            const a = i * Math.PI * 2 / 5 - Math.PI / 2;
            ctx.fillRect(p.x + Math.cos(a) * 7 * z - 0.7 * z, p.y + Math.sin(a) * 7 * z + 5 * z, 1.4 * z, 2.5 * z);
        }
        // Seat
        ctx.fillStyle = c.d ? '#2a2a60' : '#4a4ab0';
        ctx.beginPath(); ctx.arc(p.x, p.y, 9 * z, 0, Math.PI * 2); ctx.fill();
        // Backrest
        ctx.fillStyle = c.d ? '#222250' : '#3a3a90';
        ctx.beginPath(); ctx.roundRect(p.x - 7 * z, p.y - 14 * z, 14 * z, 14 * z, 4 * z); ctx.fill();
        // Arm rests
        ctx.fillStyle = '#444';
        ctx.fillRect(p.x - 10 * z, p.y - 4 * z, 3 * z, 1.5 * z);
        ctx.fillRect(p.x + 7 * z, p.y - 4 * z, 3 * z, 1.5 * z);
    }

    function drawRefrigerator(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#c0c0d0' : '#e8e8f0';
        ctx.beginPath(); ctx.roundRect(p.x - 8 * z, p.y - 28 * z, 16 * z, 30 * z, 2 * z); ctx.fill();
        // Door line
        ctx.strokeStyle = c.d ? '#aaa' : '#ccc'; ctx.lineWidth = z;
        ctx.beginPath(); ctx.moveTo(p.x - 7 * z, p.y - 10 * z); ctx.lineTo(p.x + 7 * z, p.y - 10 * z); ctx.stroke();
        // Handle
        ctx.fillStyle = '#888';
        ctx.fillRect(p.x + 5 * z, p.y - 22 * z, 1.5 * z, 8 * z);
        ctx.fillRect(p.x + 5 * z, p.y - 6 * z, 1.5 * z, 6 * z);
        // Brand dot
        ctx.fillStyle = c.nBlue; ctx.beginPath(); ctx.arc(p.x, p.y - 25 * z, 1.5 * z, 0, Math.PI * 2); ctx.fill();
    }

    function drawMirror(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#666';
        ctx.fillRect(p.x - 8 * z, p.y - 16 * z, 16 * z, 14 * z);
        // Reflection
        const g = ctx.createLinearGradient(p.x - 6 * z, p.y - 14 * z, p.x + 6 * z, p.y - 4 * z);
        g.addColorStop(0, c.d ? '#2a3050' : '#c0d0f0');
        g.addColorStop(0.5, c.d ? '#3a4060' : '#d0e0ff');
        g.addColorStop(1, c.d ? '#2a3050' : '#b8c8e8');
        ctx.fillStyle = g;
        ctx.fillRect(p.x - 7 * z, p.y - 15 * z, 14 * z, 12 * z);
        // Shine
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.moveTo(p.x - 5 * z, p.y - 14 * z); ctx.lineTo(p.x - 2 * z, p.y - 14 * z); ctx.lineTo(p.x - 6 * z, p.y - 8 * z); ctx.closePath(); ctx.fill();
    }

    function drawRelaxChair(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        // Beanbag body — large
        ctx.fillStyle = c.d ? '#4a2060' : '#b880e0';
        ctx.beginPath(); ctx.ellipse(p.x, p.y - 2 * z, 14 * z, 10 * z, 0, 0, Math.PI * 2); ctx.fill();
        // Backrest cushion
        ctx.fillStyle = c.d ? '#5a3070' : '#c890f0';
        ctx.beginPath(); ctx.ellipse(p.x - 2 * z, p.y - 8 * z, 10 * z, 7 * z, -0.2, 0, Math.PI * 2); ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.ellipse(p.x - 4 * z, p.y - 11 * z, 4 * z, 3 * z, 0, 0, Math.PI * 2); ctx.fill();
    }

    function drawAirFreshener(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#334' : '#eee';
        ctx.beginPath(); ctx.roundRect(p.x - 3 * z, p.y - 10 * z, 6 * z, 12 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.nGreen; ctx.globalAlpha = 0.5;
        ctx.fillRect(p.x - 2 * z, p.y - 8 * z, 4 * z, 4 * z); ctx.globalAlpha = 1;
        // Mist particles
        for (let i = 0; i < 3; i++) {
            const my = p.y - 12 * z - ((time * 0.008 + i * 6) % (10 * z));
            const mx = p.x + Math.sin(time * 0.003 + i * 2) * 3 * z;
            ctx.fillStyle = 'rgba(180,255,200,0.08)';
            ctx.beginPath(); ctx.arc(mx, my, (1.5 + i * 0.5) * z, 0, Math.PI * 2); ctx.fill();
        }
    }

    function drawLightStand(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = '#555';
        ctx.fillRect(p.x - 1 * z, p.y - 26 * z, 2 * z, 28 * z);
        ctx.fillRect(p.x - 5 * z, p.y + 2 * z, 10 * z, 2 * z);
        // Lamp shade
        ctx.fillStyle = c.d ? '#aa8844' : '#f0d888';
        ctx.beginPath();
        ctx.moveTo(p.x - 6 * z, p.y - 24 * z); ctx.lineTo(p.x + 6 * z, p.y - 24 * z);
        ctx.lineTo(p.x + 4 * z, p.y - 30 * z); ctx.lineTo(p.x - 4 * z, p.y - 30 * z);
        ctx.closePath(); ctx.fill();
        // Warm glow
        ctx.fillStyle = c.d ? 'rgba(255,200,100,0.06)' : 'rgba(255,220,150,0.03)';
        ctx.beginPath(); ctx.arc(p.x, p.y - 24 * z, 14 * z, 0, Math.PI * 2); ctx.fill();
    }

    function drawUtilityTable(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.deskTop;
        ctx.beginPath(); ctx.roundRect(p.x - 10 * z, p.y - 4 * z, 20 * z, 8 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.deskLeg;
        ctx.fillRect(p.x - 8 * z, p.y + 4 * z, 2 * z, 5 * z);
        ctx.fillRect(p.x + 6 * z, p.y + 4 * z, 2 * z, 5 * z);
    }

    // ─── Day/Night Sky ──────────────────────────────────────────
    function drawSky(c, time) {
        const t = timeOfDay;
        if (t === 'night') {
            ctx.fillStyle = 'rgba(200,220,255,0.6)';
            for (let i = 0; i < 20; i++) {
                const sx = (i * 137 + 42) % W, sy = (i * 89 + 17) % (H * 0.2);
                const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.001 + i * 0.7));
                ctx.globalAlpha = tw; ctx.fillRect(sx, sy, 2, 2);
            }
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#e0e8ff'; ctx.beginPath(); ctx.arc(W * 0.85, H * 0.06, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(200,220,255,0.04)'; ctx.beginPath(); ctx.arc(W * 0.85, H * 0.06, 30, 0, Math.PI * 2); ctx.fill();
        } else if (t === 'dawn') {
            const g = ctx.createLinearGradient(0, 0, 0, H * 0.15);
            g.addColorStop(0, 'rgba(255,180,100,0.18)'); g.addColorStop(0.5, 'rgba(255,140,60,0.12)'); g.addColorStop(1, 'rgba(255,200,150,0.04)');
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * 0.15);
            ctx.fillStyle = 'rgba(255,160,60,0.3)'; ctx.beginPath(); ctx.arc(W * 0.2, H * 0.1, 20, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,200,100,0.1)'; ctx.beginPath(); ctx.arc(W * 0.2, H * 0.1, 40, 0, Math.PI * 2); ctx.fill();
        } else if (t === 'evening') {
            const g = ctx.createLinearGradient(0, 0, 0, H * 0.2);
            g.addColorStop(0, 'rgba(80,20,80,0.2)'); g.addColorStop(0.4, 'rgba(180,80,40,0.15)'); g.addColorStop(1, 'rgba(255,120,40,0.06)');
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * 0.2);
            ctx.fillStyle = 'rgba(255,100,40,0.25)'; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.12, 18, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,80,20,0.08)'; ctx.beginPath(); ctx.arc(W * 0.8, H * 0.12, 40, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(200,200,255,0.3)';
            for (let i = 0; i < 6; i++) ctx.fillRect((i * 173 + 50) % W, (i * 61 + 10) % (H * 0.1), 1.5, 1.5);
        } else {
            ctx.fillStyle = 'rgba(255,220,100,0.1)'; ctx.beginPath(); ctx.arc(W * 0.75, H * 0.05, 22, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,240,200,0.05)'; ctx.beginPath(); ctx.arc(W * 0.75, H * 0.05, 44, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.18)';
            const cx1 = (W * 0.3 + time * 0.005) % (W + 100) - 50;
            const cx2 = (W * 0.7 + time * 0.003) % (W + 100) - 50;
            for (const cx of [cx1, cx2]) {
                ctx.beginPath(); ctx.arc(cx, H * 0.06, 18, 0, Math.PI * 2); ctx.fill();
                ctx.arc(cx + 14, H * 0.06 + 2, 14, 0, Math.PI * 2); ctx.fill();
                ctx.arc(cx - 12, H * 0.06 + 3, 12, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    // ─── Kitchen layout (best-practice L-shape) ─────────────────
    function drawKitchenLayout(time, c) {
        const z = camera.zoom;
        const rx = BLD.x, ry = BLD.y + 8; // break room top-left
        const ts = TILE * z; // tile size in pixels

        // --- TOP WALL: counter flush against top edge (runs x=1..9 at y=ry) ---
        for (let x = 1; x < 10; x++) {
            const p = gridToScreen(rx + x, ry);
            // Counter sits against top wall — offset upward
            const cw = ts * 0.46, ch = ts * 0.25;
            ctx.fillStyle = c.d ? '#3a3a50' : '#7a7a90';
            ctx.fillRect(p.x - cw, p.y - ch * 2, cw * 2, ch * 2);
            // Cabinet front (below counter)
            ctx.fillStyle = c.d ? '#2a2a3a' : '#c0a878';
            ctx.fillRect(p.x - cw, p.y, cw * 2, ch);
            // Knob
            ctx.fillStyle = '#aa8';
            ctx.beginPath(); ctx.arc(p.x, p.y + ch * 0.4, 0.8 * z, 0, Math.PI * 2); ctx.fill();
        }
        // Upper cabinets (above counter on top wall)
        for (let x = 2; x < 9; x++) {
            const p = gridToScreen(rx + x, ry);
            ctx.fillStyle = c.d ? '#2a2a3a' : '#b09060';
            const cw = ts * 0.42;
            ctx.beginPath(); ctx.roundRect(p.x - cw, p.y - ts * 0.65, cw * 2, ts * 0.18, 2 * z); ctx.fill();
        }

        // --- LEFT WALL: counter flush against left edge (runs y=ry..ry+4 at x=rx) ---
        for (let y = 0; y < 5; y++) {
            const p = gridToScreen(rx, ry + y);
            const cw = ts * 0.25, ch = ts * 0.46;
            ctx.fillStyle = c.d ? '#3a3a50' : '#7a7a90';
            ctx.fillRect(p.x - cw * 2, p.y - ch, cw * 2, ch * 2);
            // Cabinet front (right side of counter)
            ctx.fillStyle = c.d ? '#2a2a3a' : '#c0a878';
            ctx.fillRect(p.x, p.y - ch, cw, ch * 2);
        }

        // --- APPLIANCES ON TOP WALL (left to right) ---
        // Fridge (rx+0)
        const pF = gridToScreen(rx, ry);
        ctx.fillStyle = c.d ? '#b0b0c0' : '#dde0e8';
        ctx.beginPath(); ctx.roundRect(pF.x - 10 * z, pF.y - 22 * z, 20 * z, 24 * z, 2 * z); ctx.fill();
        ctx.strokeStyle = c.d ? '#999' : '#bbb'; ctx.lineWidth = z * 0.6;
        ctx.beginPath(); ctx.moveTo(pF.x - 8 * z, pF.y - 6 * z); ctx.lineTo(pF.x + 8 * z, pF.y - 6 * z); ctx.stroke();
        ctx.fillStyle = '#888'; ctx.fillRect(pF.x + 6 * z, pF.y - 18 * z, 1.5 * z, 8 * z);

        // Sink (rx+3)
        const pS = gridToScreen(rx + 3, ry);
        ctx.fillStyle = c.d ? '#2a2a3a' : '#777';
        ctx.beginPath(); ctx.roundRect(pS.x - 7 * z, pS.y - 6 * z, 14 * z, 8 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#3a4060' : '#90b0d0';
        ctx.beginPath(); ctx.roundRect(pS.x - 5 * z, pS.y - 5 * z, 10 * z, 5 * z, 1 * z); ctx.fill();
        ctx.fillStyle = '#999'; ctx.fillRect(pS.x - 0.5 * z, pS.y - 11 * z, 1 * z, 6 * z);
        ctx.fillRect(pS.x - 2 * z, pS.y - 11 * z, 4 * z, 1 * z);

        // Coffee machine (rx+5)
        const pC = gridToScreen(rx + 5, ry);
        ctx.fillStyle = c.d ? '#222' : '#333';
        ctx.beginPath(); ctx.roundRect(pC.x - 5 * z, pC.y - 14 * z, 10 * z, 14 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.nBlue; ctx.beginPath(); ctx.arc(pC.x, pC.y - 10 * z, 2 * z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f5e6c8'; ctx.fillRect(pC.x - 2 * z, pC.y - 3 * z, 4 * z, 3 * z);
        if (Math.sin(time * 0.003) > 0) {
            ctx.fillStyle = 'rgba(200,200,200,0.15)';
            ctx.beginPath(); ctx.arc(pC.x, pC.y - 16 * z, 3 * z, 0, Math.PI * 2); ctx.fill();
        }

        // Microwave (rx+7)
        const pM = gridToScreen(rx + 7, ry);
        ctx.fillStyle = c.d ? '#333345' : '#aaa';
        ctx.beginPath(); ctx.roundRect(pM.x - 8 * z, pM.y - 10 * z, 16 * z, 10 * z, 1 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#111' : '#222';
        ctx.fillRect(pM.x - 6 * z, pM.y - 8 * z, 9 * z, 6 * z);
        if (Math.sin(time * 0.002) > 0.5) {
            ctx.fillStyle = 'rgba(255,200,50,0.12)'; ctx.fillRect(pM.x - 5 * z, pM.y - 7 * z, 7 * z, 4 * z);
        }
        ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(pM.x + 5 * z, pM.y - 5 * z, 0.8 * z, 0, Math.PI * 2); ctx.fill();

        // Toaster (rx+9)
        const pT = gridToScreen(rx + 9, ry);
        ctx.fillStyle = c.d ? '#555' : '#c0c0c8';
        ctx.beginPath(); ctx.roundRect(pT.x - 5 * z, pT.y - 8 * z, 10 * z, 7 * z, 1.5 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#333' : '#888';
        ctx.fillRect(pT.x - 3 * z, pT.y - 9 * z, 2.5 * z, 2 * z);
        ctx.fillRect(pT.x + 0.5 * z, pT.y - 9 * z, 2.5 * z, 2 * z);

        // --- APPLIANCES ON LEFT WALL (shifted flush-left) ---
        // Water cooler (rx, ry+1)
        const pW = gridToScreen(rx, ry + 1);
        const lOff = -6 * z; // flush-left offset
        ctx.fillStyle = c.d ? '#d0d0e0' : '#e0e0f0';
        ctx.beginPath(); ctx.roundRect(pW.x + lOff - 5 * z, pW.y - 18 * z, 10 * z, 18 * z, 2 * z); ctx.fill();
        ctx.fillStyle = '#8ab8e8'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.roundRect(pW.x + lOff - 3 * z, pW.y - 16 * z, 6 * z, 6 * z, 4 * z); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#4ade80'; ctx.fillRect(pW.x + lOff - 4 * z, pW.y - 8 * z, 3 * z, 2 * z);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(pW.x + lOff + 1 * z, pW.y - 8 * z, 3 * z, 2 * z);

        // Dishwasher (rx, ry+3)
        const pD = gridToScreen(rx, ry + 3);
        ctx.fillStyle = c.d ? '#bbb' : '#dde';
        ctx.beginPath(); ctx.roundRect(pD.x + lOff - 5 * z, pD.y - 8 * z, 12 * z, 12 * z, 1 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#333' : '#aaa'; ctx.fillRect(pD.x + lOff - 3 * z, pD.y - 6 * z, 8 * z, 1.5 * z);
        ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(pD.x + lOff + 2 * z, pD.y - 5 * z, 0.8 * z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#888'; ctx.fillRect(pD.x + lOff - 2 * z, pD.y - 2 * z, 6 * z, 1 * z);
    }

    function drawPiano(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#1a1a28' : '#2a1a0a';
        ctx.beginPath(); ctx.roundRect(p.x - 20 * z, p.y - 18 * z, 40 * z, 20 * z, 3 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#222238' : '#3a2a1a';
        ctx.fillRect(p.x - 18 * z, p.y - 20 * z, 36 * z, 4 * z);
        ctx.fillStyle = '#f0f0f0';
        for (let i = 0; i < 14; i++) ctx.fillRect(p.x - 17 * z + i * 2.4 * z, p.y - 10 * z, 2 * z, 10 * z);
        ctx.fillStyle = '#111';
        for (const i of [1, 2, 4, 5, 6, 8, 9, 11, 12, 13]) ctx.fillRect(p.x - 17 * z + i * 2.4 * z - 0.6 * z, p.y - 10 * z, 1.6 * z, 6 * z);
        ctx.font = `${6 * z}px sans-serif`;
        for (let i = 0; i < 2; i++) {
            const ny = p.y - 22 * z - ((time * 0.01 + i * 15) % (16 * z));
            const nx = p.x - 8 * z + i * 16 * z + Math.sin(time * 0.003 + i) * 4 * z;
            ctx.fillStyle = `rgba(200,150,255,${Math.max(0, 0.4 - ((time * 0.01 + i * 15) % (16 * z)) / (40 * z))})`;
            ctx.fillText(['♪', '♫'][i], nx, ny);
        }
        ctx.fillStyle = c.d ? '#111' : '#1a1008';
        ctx.fillRect(p.x - 18 * z, p.y + 2 * z, 3 * z, 6 * z);
        ctx.fillRect(p.x + 15 * z, p.y + 2 * z, 3 * z, 6 * z);
    }
    function drawDesk(gx, gy, agentColor, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        // Desk surface — big
        ctx.fillStyle = c.deskTop;
        ctx.beginPath(); ctx.roundRect(p.x - 25 * z, p.y - 8 * z, 50 * z, 18 * z, 4 * z); ctx.fill();
        // Front edge bevel
        ctx.fillStyle = Sprites.darken(c.deskTop, 0.12);
        ctx.fillRect(p.x - 25 * z, p.y + 8 * z, 50 * z, 4 * z);
        // Legs
        ctx.fillStyle = c.deskLeg;
        ctx.fillRect(p.x - 22 * z, p.y + 12 * z, 4 * z, 8 * z);
        ctx.fillRect(p.x + 18 * z, p.y + 12 * z, 4 * z, 8 * z);
        // Monitor — large
        const mw = 24 * z, mh = 16 * z;
        ctx.fillStyle = '#0a0a14';
        ctx.beginPath(); ctx.roundRect(p.x - mw / 2 - 2, p.y - 26 * z, mw + 4, mh + 4, 3 * z); ctx.fill();
        const sg = ctx.createLinearGradient(p.x, p.y - 26 * z, p.x, p.y - 10 * z);
        sg.addColorStop(0, agentColor || c.nBlue);
        sg.addColorStop(1, Sprites.darken(agentColor || c.nBlue, 0.5));
        ctx.fillStyle = sg; ctx.globalAlpha = 0.65;
        ctx.fillRect(p.x - mw / 2, p.y - 26 * z, mw, mh);
        ctx.globalAlpha = 1;
        // Monitor stand
        ctx.fillStyle = '#333';
        ctx.fillRect(p.x - 2.5 * z, p.y - 10 * z, 5 * z, 4 * z);
        ctx.fillRect(p.x - 7 * z, p.y - 6 * z, 14 * z, 2 * z);
        // Keyboard
        ctx.fillStyle = '#3a3a48';
        ctx.beginPath(); ctx.roundRect(p.x - 10 * z, p.y - 2 * z, 20 * z, 6 * z, 1.5 * z); ctx.fill();
        // Key rows
        ctx.fillStyle = '#555'; ctx.globalAlpha = 0.4;
        for (let r = 0; r < 3; r++) ctx.fillRect(p.x - 8 * z, p.y - 0.5 * z + r * 1.8 * z, 16 * z, 0.8 * z);
        ctx.globalAlpha = 1;
        // Mouse
        ctx.fillStyle = '#444';
        ctx.beginPath(); ctx.ellipse(p.x + 17 * z, p.y + 2 * z, 3 * z, 4 * z, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#666';
        ctx.beginPath(); ctx.ellipse(p.x + 17 * z, p.y + 0.5 * z, 1 * z, 1.5 * z, 0, 0, Math.PI * 2); ctx.fill();
        // Coffee mug
        ctx.fillStyle = '#f5f0e8';
        ctx.fillRect(p.x - 20 * z, p.y - 4 * z, 4 * z, 5 * z);
        ctx.fillStyle = '#6b3a1f';
        ctx.fillRect(p.x - 19.5 * z, p.y - 3.5 * z, 3 * z, 2 * z);
    }

    function drawPlant(gx, gy, time) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        const sw = Math.sin(time * 0.0015 + gx) * 1.5 * z;
        // Pot — bigger
        ctx.fillStyle = '#c0592e';
        ctx.beginPath(); ctx.roundRect(p.x - 7 * z, p.y - 2 * z, 14 * z, 10 * z, 3 * z); ctx.fill();
        ctx.fillStyle = '#d4693e';
        ctx.fillRect(p.x - 8 * z, p.y - 3 * z, 16 * z, 3 * z);
        // Soil
        ctx.fillStyle = '#5a3a20';
        ctx.beginPath(); ctx.ellipse(p.x, p.y - 2 * z, 6 * z, 2 * z, 0, 0, Math.PI * 2); ctx.fill();
        // Leaves — bigger
        ['#10b981', '#34d399', '#6ee7b7', '#059669'].forEach((g, i) => {
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x + sw * (0.4 + i * 0.25) + (i - 1.5) * 3 * z, p.y - (8 + i * 5) * z, (8 - i * 1.2) * z, 0, Math.PI * 2); ctx.fill();
        });
    }

    function drawCoffeeMachine(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.coffee;
        ctx.beginPath(); ctx.roundRect(p.x - 7 * z, p.y - 18 * z, 14 * z, 20 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.nGreen; ctx.globalAlpha = 0.7;
        ctx.font = `bold ${5 * z}px monospace`; ctx.textAlign = 'center';
        ctx.fillText('☕', p.x, p.y - 9 * z); ctx.globalAlpha = 1; ctx.textAlign = 'start';
        for (let i = 0; i < 2; i++) {
            const sx = p.x + Math.sin(time * 0.003 + i) * z;
            const sy = p.y - 20 * z - (time * 0.01 + i * 4) % (8 * z);
            ctx.fillStyle = c.d ? 'rgba(160,160,220,0.12)' : 'rgba(100,100,160,0.1)';
            ctx.beginPath(); ctx.arc(sx, sy, (1 + i * 0.5) * z, 0, Math.PI * 2); ctx.fill();
        }
    }

    function drawSofa(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        const sc = c.sofa, sd = Sprites.darken(sc, 0.25);
        // Base (seat) — big
        ctx.fillStyle = sd;
        ctx.beginPath(); ctx.roundRect(p.x - 22 * z, p.y - 2 * z, 44 * z, 14 * z, 4 * z); ctx.fill();
        // Cushions
        ctx.fillStyle = sc;
        ctx.beginPath(); ctx.roundRect(p.x - 20 * z, p.y - 8 * z, 18 * z, 10 * z, 4 * z); ctx.fill();
        ctx.beginPath(); ctx.roundRect(p.x + 2 * z, p.y - 8 * z, 18 * z, 10 * z, 4 * z); ctx.fill();
        // Backrest
        ctx.fillStyle = sd;
        ctx.beginPath(); ctx.roundRect(p.x - 22 * z, p.y - 18 * z, 44 * z, 12 * z, 4 * z); ctx.fill();
        // Armrests
        ctx.fillStyle = Sprites.darken(sc, 0.35);
        ctx.beginPath(); ctx.roundRect(p.x - 24 * z, p.y - 14 * z, 5 * z, 18 * z, 3 * z); ctx.fill();
        ctx.beginPath(); ctx.roundRect(p.x + 19 * z, p.y - 14 * z, 5 * z, 18 * z, 3 * z); ctx.fill();
        // Throw pillows
        ctx.fillStyle = c.nPink; ctx.beginPath(); ctx.arc(p.x - 10 * z, p.y - 10 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = c.nBlue; ctx.beginPath(); ctx.arc(p.x + 10 * z, p.y - 10 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
    }

    function drawSnackCounter(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.counter;
        ctx.beginPath(); ctx.roundRect(p.x - 10 * z, p.y - 5 * z, 20 * z, 8 * z, 2 * z); ctx.fill();
        ctx.font = `${7 * z}px sans-serif`; ctx.textAlign = 'center';
        ctx.fillText('🍕🍩🍎', p.x, p.y + 1 * z); ctx.textAlign = 'start';
    }

    function drawBookshelf(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.shelf;
        ctx.beginPath(); ctx.roundRect(p.x - 8 * z, p.y - 22 * z, 16 * z, 24 * z, 2 * z); ctx.fill();
        const bc = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
        for (let s = 0; s < 3; s++) {
            ctx.fillStyle = Sprites.darken(c.shelf, 0.15);
            ctx.fillRect(p.x - 7 * z, p.y - 5 * z - s * 7 * z, 14 * z, 1 * z);
            for (let b = 0; b < 4; b++) {
                ctx.fillStyle = bc[(s * 4 + b) % bc.length];
                ctx.fillRect(p.x - 6 * z + b * 3.2 * z, p.y - 10 * z - s * 7 * z, 2 * z, 5 * z);
            }
        }
    }

    function drawMusicCorner(gx, gy, time, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        ctx.fillStyle = c.d ? '#222240' : '#555';
        ctx.beginPath(); ctx.roundRect(p.x - 6 * z, p.y - 15 * z, 12 * z, 16 * z, 2 * z); ctx.fill();
        ctx.fillStyle = c.d ? '#333355' : '#777';
        ctx.beginPath(); ctx.arc(p.x, p.y - 7 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
        const pulse = (Math.sin(time * 0.004) + 1) * 0.5;
        ctx.strokeStyle = c.nPink; ctx.globalAlpha = 0.3 + pulse * 0.4; ctx.lineWidth = 1.5 * z;
        ctx.beginPath(); ctx.arc(p.x, p.y - 7 * z, 5 * z, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
    }

    function drawChair(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        // Seat
        ctx.fillStyle = c.chair;
        ctx.beginPath(); ctx.arc(p.x, p.y + z, 7 * z, 0, Math.PI * 2); ctx.fill();
        // Backrest
        ctx.fillStyle = Sprites.darken(c.chair, 0.15);
        ctx.beginPath(); ctx.roundRect(p.x - 5 * z, p.y - 8 * z, 10 * z, 9 * z, 3 * z); ctx.fill();
        // Legs
        ctx.fillStyle = '#666';
        ctx.fillRect(p.x - 5 * z, p.y + 6 * z, 1.5 * z, 3 * z);
        ctx.fillRect(p.x + 3.5 * z, p.y + 6 * z, 1.5 * z, 3 * z);
    }

    function drawBreakTable(gx, gy, c) {
        const p = gridToScreen(gx, gy); const z = camera.zoom;
        // Table top — large
        ctx.fillStyle = c.deskTop;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16 * z, 0, Math.PI * 2); ctx.fill();
        // Edge ring
        ctx.strokeStyle = c.deskLeg; ctx.lineWidth = 2 * z; ctx.stroke();
        // Central leg shadow
        ctx.fillStyle = Sprites.darken(c.deskTop, 0.1);
        ctx.beginPath(); ctx.arc(p.x, p.y, 4 * z, 0, Math.PI * 2); ctx.fill();
        // Placemats
        ctx.fillStyle = 'rgba(200,180,150,0.2)';
        ctx.beginPath(); ctx.arc(p.x - 8 * z, p.y - 3 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x + 8 * z, p.y - 3 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y + 8 * z, 4 * z, 0, Math.PI * 2); ctx.fill();
    }

    // ─── Agent positions (grid-space for zoom stability) ────────
    const agentPositions = [];
    const agentGridPos = {};  // stores { gx, gy } in grid coords

    function getAgentTargetGrid(agent, state) {
        let gx, gy;
        if (state.location === 'desk') {
            if (agent.isMain) { gx = ALEISTER_DESK.gx; gy = ALEISTER_DESK.gy; }
            else {
                const idx = Sprites.AGENTS.indexOf(agent) - 1;
                const d = DESKS[idx];
                if (d) { gx = d.gx; gy = d.gy; } else { gx = BLD.x + 10; gy = BLD.y + 4; }
            }
        } else if (state.location === 'breakroom') {
            const h = agent.id.charCodeAt(0) % 4;
            gx = ROOMS.breakroom.x + 2 + (h % 3) * 2;
            gy = ROOMS.breakroom.y + 3 + Math.floor(h / 3) * 2;
        } else if (state.location === 'chill') {
            const h = agent.id.charCodeAt(0) % 5;
            gx = ROOMS.lounge.x + 2 + (h % 4) * 3;
            gy = ROOMS.lounge.y + 2 + Math.floor(h / 4) * 3;
        } else {
            const t = Date.now() * 0.00012 + agent.id.charCodeAt(0);
            gx = ROOMS.hallway.x + 2 + (Math.sin(t) + 1) * 0.5 * (ROOMS.hallway.w - 4);
            gy = ROOMS.hallway.y + (Math.cos(t * 0.7) + 1) * 0.5;
        }
        return { gx, gy };
    }

    function lerpAgents() {
        const states = Status.getAllStates();
        for (const agent of Sprites.AGENTS) {
            const state = states[agent.id];
            if (!state) continue;
            const t = getAgentTargetGrid(agent, state);
            const cur = agentGridPos[agent.id] || { gx: t.gx, gy: t.gy };
            cur.gx += (t.gx - cur.gx) * 0.012;
            cur.gy += (t.gy - cur.gy) * 0.012;
            agentGridPos[agent.id] = cur;
        }
    }

    // ─── Main render ─────────────────────────────────────────────
    function render(time) {
        lastFrameTime = time; frameCount++;
        animFrame = Math.floor(time / Sprites.FRAME_DURATION);
        const c = C();

        const mz = getMinZoom();
        camera.targetZoom = Math.max(mz, camera.targetZoom);
        camera.zoom += (camera.targetZoom - camera.zoom) * 0.1;
        camera.isoBlend += ((camera.is3D ? 1 : 0) - camera.isoBlend) * 0.12;
        if (camera.is3D) camera.rotation += (camera.targetRotation - camera.rotation) * 0.08;
        else { camera.rotation += (0 - camera.rotation) * 0.08; camera.targetRotation = 0; }

        clampCamera();

        lerpAgents();
        ctx.fillStyle = c.bg; ctx.fillRect(0, 0, W, H);
        drawSky(c, time);
        ctx.save();

        // 1. Ground tiles
        for (let gy = 0; gy < WORLD_ROWS; gy++) {
            for (let gx = 0; gx < WORLD_COLS; gx++) {
                if (isBuilding(gx, gy)) {
                    let fc = (gx + gy) % 2 === 0 ? c.floor1 : c.floor2;
                    if (inR(gx, gy, ROOMS.aleister)) fc = c.aleisterFloor;
                    else if (inR(gx, gy, ROOMS.breakroom)) fc = c.breakFloor;
                    else if (inR(gx, gy, ROOMS.lounge)) fc = c.loungeFloor;
                    else if (inR(gx, gy, ROOMS.hallway)) fc = c.hallFloor;
                    drawTile(gx, gy, fc, c.grid);
                } else if (isLake(gx, gy)) {
                    // drawn separately
                } else if (gx >= PARKING.x && gx < PARKING.x + PARKING.w && gy >= PARKING.y && gy < PARKING.y + PARKING.h) {
                    drawTile(gx, gy, (gx + gy) % 2 === 0 ? c.pathStone : c.pathStone2, c.pathEdge);
                } else if (isPath(gx, gy)) {
                    drawTile(gx, gy, (gx + gy) % 2 === 0 ? c.pathStone : c.pathStone2, c.pathEdge);
                } else {
                    drawTile(gx, gy, (gx + gy) % 2 === 0 ? c.grass1 : c.grass2, null);
                }
            }
        }

        // 2. Lake
        drawLake(time, c);

        // 3. Building shell + room walls
        drawBuildingShell(c);

        // 4. Outdoor elements
        for (const fl of FLOWERS) drawFlowerPatch(fl.gx, fl.gy, time, c);
        for (const bush of BUSHES) drawBush(bush.gx, bush.gy, time, c);

        // 4b. Parking lot cars
        for (const car of CARS) drawCar(car.gx, car.gy, car.color, c);
        // Parking sign
        const pkSign = gridToScreen(PARKING.x + PARKING.w / 2, PARKING.y - 0.5);
        ctx.font = `600 ${8 * camera.zoom}px Inter, sans-serif`; ctx.textAlign = 'center';
        ctx.fillStyle = c.label; ctx.globalAlpha = 0.5;
        ctx.fillText('🅿️ Parking', pkSign.x, pkSign.y); ctx.globalAlpha = 1; ctx.textAlign = 'start';
        // Benches & lamps
        for (const b of BENCHES) drawBench(b.gx, b.gy, c);
        for (const l of LAMPS) drawLampPost(l.gx, l.gy, time, c);

        // 5. Indoor furniture
        INDOOR.indoorPlants.forEach(pl => drawPlant(pl.gx, pl.gy, time));
        // Kitchen (L-shaped counter + integrated appliances)
        drawKitchenLayout(time, c);
        drawBreakTable(INDOOR.breakTable1.gx, INDOOR.breakTable1.gy, c);
        drawBreakTable(INDOOR.breakTable2.gx, INDOOR.breakTable2.gy, c);
        INDOOR.breakChairs.forEach(ch => drawChair(ch.gx, ch.gy, c));
        drawPiano(INDOOR.piano.gx, INDOOR.piano.gy, time, c);
        drawSofa(INDOOR.sofa1.gx, INDOOR.sofa1.gy, c);
        drawSofa(INDOOR.sofa2.gx, INDOOR.sofa2.gy, c);
        drawSofa(INDOOR.sofa3.gx, INDOOR.sofa3.gy, c);
        drawMusicCorner(INDOOR.musicCorner.gx, INDOOR.musicCorner.gy, time, c);
        drawBookshelf(INDOOR.bookshelf.gx, INDOOR.bookshelf.gy, c);
        drawBookshelf(INDOOR.bookshelf2.gx, INDOOR.bookshelf2.gy, c);
        drawSnackCounter(INDOOR.loungeTable.gx, INDOOR.loungeTable.gy, c);
        drawWhiteboard(INDOOR.whiteboard.gx, INDOOR.whiteboard.gy, c);
        drawWhiteboard(INDOOR.whiteboard2.gx, INDOOR.whiteboard2.gy, c);
        // New furniture
        drawPrinter(INDOOR.printer.gx, INDOOR.printer.gy, c);
        INDOOR.filingCabinets.forEach(f => drawFilingCabinet(f.gx, f.gy, c));
        drawWallClock(INDOOR.wallClock.gx, INDOOR.wallClock.gy, time, c);
        drawTVScreen(INDOOR.tvScreen.gx, INDOOR.tvScreen.gy, time, c);
        drawCoatRack(INDOOR.coatRack.gx, INDOOR.coatRack.gy, c);
        INDOOR.trashCans.forEach(t => drawTrashCan(t.gx, t.gy, c));
        drawRug(INDOOR.rug.gx, INDOOR.rug.gy, INDOOR.rug.w, INDOOR.rug.h, c);
        INDOOR.pictureFrames.forEach(f => drawPictureFrame(f.gx, f.gy, c));
        INDOOR.acUnits.forEach(a => drawACUnit(a.gx, a.gy, time, c));
        INDOOR.ceilingLights.forEach(l => drawCeilingLight(l.gx, l.gy, c));
        // Wall art and decorations
        INDOOR.wallArt.forEach(w => drawWallArt(w.gx, w.gy, w.type, time, c));
        INDOOR.sconces.forEach(s => drawSconce(s.gx, s.gy, time, c));
        drawServerRack(INDOOR.serverRack.gx, INDOOR.serverRack.gy, time, c);
        INDOOR.floorMats.forEach(m => drawFloorMat(m.gx, m.gy, c));
        INDOOR.windowBlinds.forEach(w => drawWindowBlind(w.gx, w.gy, c));
        // Desk chairs, extra furniture
        INDOOR.deskChairs.forEach(ch => drawDeskChair(ch.gx, ch.gy, c));
        INDOOR.mirrors.forEach(m => drawMirror(m.gx, m.gy, time, c));
        INDOOR.relaxChairs.forEach(rc => drawRelaxChair(rc.gx, rc.gy, c));
        INDOOR.airFresheners.forEach(af => drawAirFreshener(af.gx, af.gy, time, c));
        INDOOR.lightStands.forEach(ls => drawLightStand(ls.gx, ls.gy, time, c));
        drawUtilityTable(INDOOR.printerTable.gx, INDOOR.printerTable.gy, c);

        // 6. Desks
        drawDesk(ALEISTER_DESK.gx, ALEISTER_DESK.gy, '#00d4ff', c);
        for (const d of DESKS) {
            const ag = Sprites.AGENTS[d.idx + 1];
            drawDesk(d.gx, d.gy, ag ? ag.color : '#666', c);
        }

        // 7. Trees (drawn after building so they layer on top at edges)
        for (const tree of TREES) drawTree(tree.gx, tree.gy, time, c);

        // 8. Agents
        const states = Status.getAllStates();
        const sorted = [...Sprites.AGENTS].sort((a, b) => {
            const ga = agentGridPos[a.id], gb = agentGridPos[b.id];
            return (ga ? ga.gy : 0) - (gb ? gb.gy : 0);
        });
        agentPositions.length = 0;
        const agH = 32 * camera.zoom;

        for (const agent of sorted) {
            const state = states[agent.id]; if (!state) continue;
            const gp = agentGridPos[agent.id]; if (!gp) continue;
            const pos = gridToScreen(gp.gx, gp.gy);
            const frame = animFrame % 4;
            const isW = state.status === 'working';
            if (isW) {
                const glP = 0.12 + Math.sin(time * 0.004) * 0.06;
                const gr = 20 * camera.zoom;
                const gg = ctx.createRadialGradient(pos.x, pos.y + 2, 2, pos.x, pos.y + 2, gr);
                gg.addColorStop(0, `rgba(74,222,128,${glP + 0.08})`);
                gg.addColorStop(0.6, `rgba(74,222,128,${glP})`);
                gg.addColorStop(1, 'transparent');
                ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(pos.x, pos.y + 2, gr, 0, Math.PI * 2); ctx.fill();
            }
            Sprites.drawAgent(ctx, pos.x, pos.y, camera.zoom, agent, state.animState || 'listening', frame, time);
            // Name label — well above sprite
            Sprites.drawNameLabel(ctx, pos.x, pos.y - agH - 4, agent.name, agent.color);
            // Status pill badge — above name
            const badgeY = pos.y - agH - 16;
            const badgeText = isW ? '⚡ WORKING' : (state.activity?.label ? state.activity.emoji + ' ' + state.activity.label : '😴 IDLE');
            ctx.font = `bold ${5.5 * camera.zoom}px Inter, sans-serif`; ctx.textAlign = 'center';
            const tw = ctx.measureText(badgeText).width;
            const bw = tw + 8 * camera.zoom, bh = 10 * camera.zoom;
            ctx.fillStyle = isW ? 'rgba(34,197,94,0.85)' : 'rgba(245,158,11,0.7)';
            ctx.beginPath(); ctx.roundRect(pos.x - bw / 2, badgeY - bh / 2, bw, bh, bh / 2); ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.fillText(badgeText, pos.x, badgeY + 2 * camera.zoom);
            ctx.textAlign = 'start';
            agentPositions.push({ agent, state, x: pos.x, y: pos.y - agH / 2, w: 40 * camera.zoom, h: agH + 30 });
        }

        ctx.restore();
        if (frameCount % 60 === 0) { const el = document.getElementById('active-count'); if (el) el.textContent = Status.getWorkingCount(); }
        requestAnimationFrame(render);
    }

    function inR(gx, gy, r) { return gx >= r.x && gx < r.x + r.w && gy >= r.y && gy < r.y + r.h; }

    // ─── Input ───────────────────────────────────────────────────
    canvas.addEventListener('wheel', e => { e.preventDefault(); camera.targetZoom = Math.max(getMinZoom(), Math.min(3, camera.targetZoom + (e.deltaY > 0 ? -0.1 : 0.1))); clampCamera(); }, { passive: false });
    canvas.addEventListener('mousedown', e => { if (e.button === 0) { camera.isDragging = true; camera.wasDragging = false; camera.dragStartX = e.clientX; camera.dragStartY = e.clientY; camera.dragStartCamX = camera.x; camera.dragStartCamY = camera.y; } });
    window.addEventListener('mousemove', e => { if (camera.isDragging) { const dx = e.clientX - camera.dragStartX, dy = e.clientY - camera.dragStartY; if (Math.abs(dx) > 3 || Math.abs(dy) > 3) camera.wasDragging = true; camera.x = camera.dragStartCamX + dx; camera.y = camera.dragStartCamY + dy; clampCamera(); } });
    window.addEventListener('mouseup', () => { camera.isDragging = false; });
    let touches = [];
    canvas.addEventListener('touchstart', e => { e.preventDefault(); touches = [...e.touches]; if (touches.length === 1) { camera.isDragging = true; camera.wasDragging = false; camera.dragStartX = touches[0].clientX; camera.dragStartY = touches[0].clientY; camera.dragStartCamX = camera.x; camera.dragStartCamY = camera.y; } else if (touches.length === 2) { camera.isDragging = false; camera.pinchStartDist = Math.hypot(touches[1].clientX - touches[0].clientX, touches[1].clientY - touches[0].clientY); camera.pinchStartZoom = camera.targetZoom; } }, { passive: false });
    canvas.addEventListener('touchmove', e => { e.preventDefault(); const nt = [...e.touches]; if (nt.length === 1 && camera.isDragging) { const dx = nt[0].clientX - camera.dragStartX, dy = nt[0].clientY - camera.dragStartY; if (Math.abs(dx) > 3 || Math.abs(dy) > 3) camera.wasDragging = true; camera.x = camera.dragStartCamX + dx; camera.y = camera.dragStartCamY + dy; clampCamera(); } else if (nt.length === 2) { const dist = Math.hypot(nt[1].clientX - nt[0].clientX, nt[1].clientY - nt[0].clientY); camera.targetZoom = Math.max(getMinZoom(), Math.min(3, camera.pinchStartZoom * (dist / camera.pinchStartDist))); } }, { passive: false });
    canvas.addEventListener('touchend', () => { camera.isDragging = false; });
    canvas.addEventListener('click', e => { if (camera.wasDragging) return; const r = canvas.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top; for (const ap of agentPositions) { if (mx > ap.x - ap.w / 2 && mx < ap.x + ap.w / 2 && my > ap.y - ap.h / 2 && my < ap.y + ap.h / 2) { showPanel(ap.agent, ap.state); return; } } hidePanel(); });

    // ─── Panel ───────────────────────────────────────────────────
    function showPanel(agent, state) {
        const p = document.getElementById('agent-panel');
        document.getElementById('panel-avatar').innerHTML = `<img src="${agent.avatar}" alt="${agent.name}" onerror="this.style.display='none'"/>`;
        document.getElementById('panel-avatar').style.borderColor = agent.color;
        const n = document.getElementById('panel-name'); n.textContent = agent.name; n.style.color = agent.color;
        document.getElementById('panel-role').textContent = agent.isMain ? 'Orchestrator · AI Lead' : agent.role;
        const s = document.getElementById('panel-status');
        s.textContent = `${state.activity?.emoji || '⚡'} ${state.activity?.label || state.status}`;
        s.className = 'office-agent-panel__status ' + state.status;
        document.getElementById('panel-traits').innerHTML = (agent.traits || []).map(t =>
            `<span class="office-agent-panel__trait" style="background:${agent.color}22;color:${agent.color};border:1px solid ${agent.color}33">${t}</span>`
        ).join('');
        p.classList.add('visible');
    }
    function hidePanel() { document.getElementById('agent-panel').classList.remove('visible'); }

    // ─── Toolbar ─────────────────────────────────────────────────
    document.getElementById('btn-zoom-in').addEventListener('click', () => { camera.targetZoom = Math.min(3, camera.targetZoom + 0.2); });
    document.getElementById('btn-zoom-out').addEventListener('click', () => { camera.targetZoom = Math.max(getMinZoom(), camera.targetZoom - 0.2); });
    document.getElementById('btn-rotate-left').addEventListener('click', () => { if (camera.is3D) camera.targetRotation -= 15; });
    document.getElementById('btn-rotate-right').addEventListener('click', () => { if (camera.is3D) camera.targetRotation += 15; });
    document.getElementById('btn-view-toggle').addEventListener('click', () => {
        camera.is3D = !camera.is3D;
        document.getElementById('view-label').textContent = camera.is3D ? '3D' : '2D';
        document.getElementById('btn-view-toggle').classList.toggle('active', camera.is3D);
        setTimeout(centerCamera, 50);
    });
    document.getElementById('btn-reset').addEventListener('click', () => { camera.targetZoom = 0.85; camera.targetRotation = 0; centerCamera(); });
    // Time-of-day cycle
    document.getElementById('btn-tod-cycle').addEventListener('click', () => {
        const idx = (TOD_MODES.indexOf(timeOfDay) + 1) % TOD_MODES.length;
        timeOfDay = TOD_MODES[idx];
        document.getElementById('tod-icon').textContent = TOD_ICONS[timeOfDay];
        document.getElementById('tod-label').textContent = TOD_LABELS[timeOfDay];
    });
    document.getElementById('panel-close').addEventListener('click', hidePanel);

    // ─── Init ────────────────────────────────────────────────────
    document.getElementById('view-label').textContent = '2D';
    document.getElementById('btn-view-toggle').classList.remove('active');
    document.getElementById('tod-icon').textContent = TOD_ICONS[timeOfDay];
    document.getElementById('tod-label').textContent = TOD_LABELS[timeOfDay];
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(render);
})();
