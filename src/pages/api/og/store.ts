import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { storeItems } from '../../../data/store';

// Font cache
let _interRegular: ArrayBuffer | null = null;
let _interBold: ArrayBuffer | null = null;
let _interBlack: ArrayBuffer | null = null;

async function loadFonts() {
    const base = 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files';
    const [r, b, bk] = await Promise.all([
        _interRegular ?? fetch(`${base}/inter-latin-400-normal.woff`).then(x => x.arrayBuffer()),
        _interBold ?? fetch(`${base}/inter-latin-700-normal.woff`).then(x => x.arrayBuffer()),
        _interBlack ?? fetch(`${base}/inter-latin-900-normal.woff`).then(x => x.arrayBuffer()),
    ]);
    _interRegular = r; _interBold = b; _interBlack = bk;
    return [r, b, bk] as const;
}

const h = (type: string, props: Record<string, any> = {}, ...children: any[]): any => ({
    type,
    props: {
        ...props,
        children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
    },
});

function rgba(hex: string, alpha: number) {
    const [, r, g, b] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex) ?? ['', '0', '0', '0'];
    return `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},${alpha})`;
}

async function fetchAvatarDataUrl(avatarPath: string): Promise<string | null> {
    try {
        const res = await fetch(`https://thealeister.com${avatarPath}`, { signal: AbortSignal.timeout(4000) });
        if (!res.ok) return null;
        const buf = await res.arrayBuffer();
        const ext = avatarPath.endsWith('.gif') ? 'gif' : 'png';
        return `data:image/${ext};base64,${Buffer.from(buf).toString('base64')}`;
    } catch { return null; }
}

export const GET: APIRoute = async () => {
    const personas = storeItems.filter(i => i.type === 'persona' && i.category === 'Persona');
    const subagents = storeItems.filter(i => i.category === 'Sub-Agent');
    const skills = storeItems.filter(i => i.type === 'skill');

    // Fetch 3 avatars to show as a preview row
    const previewAgents = ['cipher', 'sage', 'rally', 'pixel', 'lyra'];
    const agentColors = ['#f97316', '#06b6d4', '#22c55e', '#e5a030', '#e84393'];

    const [[interR, interB, interBk], ...avatarResults] = await Promise.all([
        loadFonts(),
        ...previewAgents.map(slug => {
            const item = storeItems.find(i => i.slug === slug);
            return item?.avatar ? fetchAvatarDataUrl(item.avatar) : Promise.resolve(null);
        }),
    ]);

    const avatars = avatarResults as (string | null)[];

    const tree = h('div', {
        style: {
            display: 'flex', width: '100%', height: '100%',
            backgroundColor: '#0d0d12',
            fontFamily: 'Inter',
            position: 'relative',
            overflow: 'hidden',
        },
    },
        // Top color bar
        h('div', {
            style: {
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(to right, #7c3aed, #06b6d4, #22c55e)',
            },
        }),
        // Subtle dot-grid overlay using a diagonal stripe gradient
        h('div', {
            style: {
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 80% 50%, rgba(124,58,237,0.08) 0%, transparent 55%)',
            },
        }),

        // Main layout
        h('div', {
            style: {
                display: 'flex', flexDirection: 'column',
                width: '100%', height: '100%',
                padding: '60px 72px',
                justifyContent: 'space-between',
            },
        },
            // Top section: eyebrow + headline
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
                h('div', {
                    style: {
                        display: 'flex',
                        padding: '5px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(124,58,237,0.15)',
                        border: '1px solid rgba(124,58,237,0.35)',
                        color: '#a78bfa',
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        width: 'fit-content',
                    },
                }, 'BUILT BY ALEISTER'),

                h('div', {
                    style: {
                        display: 'flex',
                        fontSize: '76px',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        letterSpacing: '-0.03em',
                        lineHeight: '1.0',
                    },
                }, 'Personas & Skills'),

                h('div', {
                    style: {
                        display: 'flex',
                        fontSize: '24px',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.45)',
                    },
                }, `${subagents.length} sub-agents · ${personas.length} persona · ${skills.length} skills`),
            ),

            // Bottom section: avatar row + url
            h('div', {
                style: {
                    display: 'flex', flexDirection: 'row',
                    alignItems: 'flex-end', justifyContent: 'space-between',
                },
            },
                // Avatar row
                h('div', { style: { display: 'flex', flexDirection: 'row', gap: '-16px' } },
                    ...previewAgents.slice(0, 5).map((_, i) =>
                        avatars[i]
                            ? h('div', {
                                key: String(i),
                                style: {
                                    display: 'flex',
                                    width: '72px', height: '72px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: `2px solid ${rgba(agentColors[i], 0.6)}`,
                                    marginLeft: i > 0 ? '-16px' : '0',
                                },
                            },
                                h('img', {
                                    src: avatars[i],
                                    style: { width: '100%', height: '100%', objectFit: 'cover' },
                                }),
                            )
                            : h('div', {
                                key: String(i),
                                style: {
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '72px', height: '72px',
                                    borderRadius: '50%',
                                    backgroundColor: rgba(agentColors[i], 0.2),
                                    border: `2px solid ${rgba(agentColors[i], 0.5)}`,
                                    marginLeft: i > 0 ? '-16px' : '0',
                                    color: agentColors[i],
                                    fontSize: '28px', fontWeight: 900,
                                },
                            }, previewAgents[i].charAt(0).toUpperCase()),
                    ),
                ),

                // URL
                h('div', {
                    style: {
                        display: 'flex',
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.22)',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                    },
                }, 'thealeister.com/store'),
            ),
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
