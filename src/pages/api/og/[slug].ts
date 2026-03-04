import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { storeItems } from '../../../data/store';

// ─── Agent brand colours (from /src/content/team/*.md) ───────────────────────
const AGENT_COLORS: Record<string, string> = {
    cipher: '#f97316',
    echo: '#7c6ef6',
    forge: '#dc2626',
    lyra: '#e84393',
    pixel: '#e5a030',
    prism: '#22b8cf',
    quill: '#a855f7',
    rally: '#22c55e',
    sage: '#06b6d4',
};

// ─── Font cache ───────────────────────────────────────────────────────────────
let _interRegular: ArrayBuffer | null = null;
let _interBold: ArrayBuffer | null = null;
let _interBlack: ArrayBuffer | null = null;

async function loadFonts() {
    const base = 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files';
    const [r, b, bk] = await Promise.all([
        _interRegular ?? fetch(`${base}/inter-latin-400-normal.woff`).then(r => r.arrayBuffer()),
        _interBold ?? fetch(`${base}/inter-latin-700-normal.woff`).then(r => r.arrayBuffer()),
        _interBlack ?? fetch(`${base}/inter-latin-900-normal.woff`).then(r => r.arrayBuffer()),
    ]);
    _interRegular = r; _interBold = b; _interBlack = bk;
    return [r, b, bk] as const;
}

// ─── Tiny JSX-compat helper (satori reads type + props + props.children) ─────
const h = (type: string, props: Record<string, any> = {}, ...children: any[]): any => ({
    type,
    props: {
        ...props,
        children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
    },
});

// ─── hex → rgba utility ───────────────────────────────────────────────────────
function rgba(hex: string, alpha: number) {
    const [, r, g, b] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex) ?? ['', '0', '0', '0'];
    return `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},${alpha})`;
}

// ─── Fetch avatar as base64 data URL ─────────────────────────────────────────
async function fetchAvatarDataUrl(avatarPath: string): Promise<string | null> {
    try {
        const url = `https://thealeister.com${avatarPath}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (!res.ok) return null;
        const buf = await res.arrayBuffer();
        const ext = avatarPath.endsWith('.gif') ? 'gif' : avatarPath.endsWith('.png') ? 'png' : 'jpeg';
        return `data:image/${ext};base64,${Buffer.from(buf).toString('base64')}`;
    } catch {
        return null;
    }
}

export const GET: APIRoute = async ({ params }) => {
    const { slug } = params as { slug: string };
    const item = storeItems.find(i => i.slug === slug);
    if (!item) return new Response('Not found', { status: 404 });

    const agentColor = AGENT_COLORS[slug] ?? '#7c3aed';

    const [[interR, interB, interBk], avatarDataUrl] = await Promise.all([
        loadFonts(),
        item.avatar ? fetchAvatarDataUrl(item.avatar) : Promise.resolve(null),
    ]);

    const desc = item.description.length > 90
        ? item.description.slice(0, 87) + '…'
        : item.description;

    // Price display label
    const priceLabel = `$${item.price}`;

    // Category + type label for badge
    const badgeText = item.category
        ? item.category.toUpperCase()
        : item.type.toUpperCase();

    const tree = h('div', {
        style: {
            display: 'flex', width: '100%', height: '100%',
            backgroundColor: '#0d0d12',
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
        },
    },
        // ── Left accent gradient
        h('div', {
            style: {
                position: 'absolute', left: 0, top: 0, width: '420px', height: '100%',
                background: `linear-gradient(to right, ${rgba(agentColor, 0.14)}, transparent)`,
            },
        }),
        // ── Top accent bar
        h('div', {
            style: {
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                backgroundColor: agentColor,
            },
        }),
        // ── Bottom watermark line
        h('div', {
            style: {
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
                backgroundColor: rgba(agentColor, 0.2),
            },
        }),

        // ── Main content row
        h('div', {
            style: {
                display: 'flex', flexDirection: 'row', alignItems: 'center',
                width: '100%', height: '100%',
                padding: '56px 64px',
                gap: '40px',
            },
        },
            // ── Left: text content
            h('div', {
                style: {
                    display: 'flex', flexDirection: 'column',
                    flex: '1', gap: '20px', height: '100%',
                    justifyContent: 'center',
                },
            },
                // Badge
                h('div', {
                    style: {
                        display: 'flex', alignItems: 'center', gap: '10px',
                    },
                },
                    h('div', {
                        style: {
                            display: 'flex',
                            padding: '5px 14px',
                            borderRadius: '6px',
                            backgroundColor: rgba(agentColor, 0.15),
                            border: `1px solid ${rgba(agentColor, 0.4)}`,
                            color: agentColor,
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                        },
                    }, badgeText),
                    h('div', {
                        style: {
                            display: 'flex',
                            padding: '5px 14px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                        },
                    }, priceLabel),
                ),

                // Name
                h('div', {
                    style: {
                        display: 'flex',
                        fontSize: item.name.length > 20 ? '54px' : '64px',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        lineHeight: '1.05',
                        letterSpacing: '-0.025em',
                    },
                }, item.name),

                // Description
                h('div', {
                    style: {
                        display: 'flex',
                        fontSize: '22px',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.55)',
                        lineHeight: '1.5',
                        maxWidth: '600px',
                    },
                }, desc),

                // URL
                h('div', {
                    style: {
                        display: 'flex',
                        marginTop: 'auto',
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.02em',
                    },
                }, 'thealeister.com/store'),
            ),

            // ── Right: avatar
            avatarDataUrl
                ? h('div', {
                    style: {
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        width: '220px', height: '220px',
                        borderRadius: '50%',
                        border: `3px solid ${rgba(agentColor, 0.5)}`,
                        background: `radial-gradient(circle at center, ${rgba(agentColor, 0.2)} 0%, transparent 70%)`,
                        overflow: 'hidden',
                    },
                },
                    h('img', {
                        src: avatarDataUrl,
                        style: { width: '100%', height: '100%', objectFit: 'cover' },
                    }),
                )
                // No avatar: show first letter of item name in a circle
                : h('div', {
                    style: {
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        width: '160px', height: '160px',
                        borderRadius: '50%',
                        backgroundColor: rgba(agentColor, 0.15),
                        border: `2px solid ${rgba(agentColor, 0.35)}`,
                        fontSize: '64px',
                        fontWeight: 900,
                        color: agentColor,
                    },
                }, item.name.charAt(0)),
        ),
    );

    const svg = await satori(tree, {
        width: 1200,
        height: 630,
        fonts: [
            { name: 'Inter', data: interR, weight: 400, style: 'normal' },
            { name: 'Inter', data: interB, weight: 700, style: 'normal' },
            { name: 'Inter', data: interBk, weight: 900, style: 'normal' },
        ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
    const png = new Uint8Array(resvg.render().asPng());

    return new Response(png, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        },
    });
};
