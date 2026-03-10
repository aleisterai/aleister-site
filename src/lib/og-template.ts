import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// ── Font cache ──
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

// ── Satori virtual DOM helper ──
export const h = (type: string, props: Record<string, any> = {}, ...children: any[]): any => ({
    type,
    props: {
        ...props,
        children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
    },
});

export function rgba(hex: string, alpha: number) {
    const [, r, g, b] = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex) ?? ['', '0', '0', '0'];
    return `rgba(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},${alpha})`;
}

// ── Shared OG template ──
export interface OgTemplateOptions {
    eyebrow: string;
    headline: string;
    subtitle: string;
    url: string;
    /** Override default gradient bar colors */
    accentColors?: [string, string, string];
    /** Extra Satori children to render at the bottom-left (e.g. avatar row) */
    bottomLeftContent?: any;
    /** Extra Satori children to render on the right side (e.g. cover image) */
    rightContent?: any;
}

export async function renderOgImage(opts: OgTemplateOptions): Promise<Uint8Array> {
    const {
        eyebrow,
        headline,
        subtitle,
        url,
        accentColors = ['#7c3aed', '#06b6d4', '#22c55e'],
        bottomLeftContent,
        rightContent,
    } = opts;

    const [interR, interB, interBk] = await loadFonts();

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
                background: `linear-gradient(to right, ${accentColors[0]}, ${accentColors[1]}, ${accentColors[2]})`,
            },
        }),
        // Subtle radial glow
        h('div', {
            style: {
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 80% 50%, ${rgba(accentColors[0], 0.08)} 0%, transparent 55%)`,
            },
        }),

        // Main layout — split into left text + optional right content
        h('div', {
            style: {
                display: 'flex', flexDirection: 'row',
                width: '100%', height: '100%',
                padding: '60px 72px',
            },
        },
            // Left column (text)
            h('div', {
                style: {
                    display: 'flex', flexDirection: 'column',
                    flex: rightContent ? '1' : '1',
                    justifyContent: 'space-between',
                    paddingRight: rightContent ? '40px' : '0',
                },
            },
                // Top: eyebrow + headline + subtitle
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
                    // Eyebrow badge
                    h('div', {
                        style: {
                            display: 'flex',
                            padding: '5px 14px',
                            borderRadius: '6px',
                            backgroundColor: rgba(accentColors[0], 0.15),
                            border: `1px solid ${rgba(accentColors[0], 0.35)}`,
                            color: '#a78bfa',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            width: 'fit-content',
                        },
                    }, eyebrow),

                    // Headline
                    h('div', {
                        style: {
                            display: 'flex',
                            fontSize: rightContent ? '52px' : '76px',
                            fontWeight: 900,
                            color: '#FFFFFF',
                            letterSpacing: '-0.03em',
                            lineHeight: '1.0',
                        },
                    }, headline),

                    // Subtitle
                    h('div', {
                        style: {
                            display: 'flex',
                            fontSize: rightContent ? '20px' : '24px',
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.45)',
                        },
                    }, subtitle),
                ),

                // Bottom: optional left content + URL
                h('div', {
                    style: {
                        display: 'flex', flexDirection: 'row',
                        alignItems: 'flex-end', justifyContent: 'space-between',
                    },
                },
                    bottomLeftContent ?? h('div', { style: { display: 'flex' } }),
                    // URL
                    h('div', {
                        style: {
                            display: 'flex',
                            fontSize: '18px',
                            color: 'rgba(255,255,255,0.22)',
                            fontWeight: 500,
                            letterSpacing: '0.02em',
                        },
                    }, url),
                ),
            ),

            // Right column (optional content, e.g. book cover)
            ...(rightContent
                ? [h('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '280px',
                        flexShrink: '0',
                    },
                }, rightContent)]
                : []),
        ),
    );

    const svg = await satori(tree, {
        width: 1200,
        height: 630,
        fonts: [
            { name: 'Inter', data: interR, weight: 400, style: 'normal' as const },
            { name: 'Inter', data: interB, weight: 700, style: 'normal' as const },
            { name: 'Inter', data: interBk, weight: 900, style: 'normal' as const },
        ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: 'width' as const, value: 1200 } });
    return new Uint8Array(resvg.render().asPng());
}

// ── Response helper ──
export function ogResponse(png: Uint8Array): Response {
    return new Response(Buffer.from(png), {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        },
    });
}
