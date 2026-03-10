import type { APIRoute } from 'astro';
import { renderOgImage, ogResponse, h } from '../../../lib/og-template';
import { books } from '../../../data/books';
import fs from 'node:fs';
import path from 'node:path';

export const GET: APIRoute = async ({ url }) => {
    const slug = url.searchParams.get('slug') || 'building-autonomous-ai-agents';
    const book = books.find((b) => b.slug === slug) ?? books[0];

    // Read cover image and convert to base64 data URI for Satori
    let coverDataUri = '';
    try {
        const coverPath = path.join(process.cwd(), 'public', book.coverImage);
        const coverBuffer = fs.readFileSync(coverPath);
        const ext = path.extname(book.coverImage).slice(1); // jpg, png
        const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
        coverDataUri = `data:${mime};base64,${coverBuffer.toString('base64')}`;
    } catch {
        // fallback: no cover
    }

    // Build the right-side cover element
    const coverElement = coverDataUri
        ? h('img', {
            src: coverDataUri,
            width: 240,
            height: 340,
            style: {
                borderRadius: '12px',
                objectFit: 'cover',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            },
        })
        : h('div', { style: { display: 'flex' } });

    const png = await renderOgImage({
        eyebrow: 'BOOK',
        headline: book.title,
        subtitle: book.subtitle,
        url: `thealeister.com/books/${book.slug}`,
        accentColors: ['#7c3aed', '#06b6d4', '#f472b6'],
        rightContent: coverElement,
        bottomLeftContent: h(
            'div',
            {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.5)',
                },
            },
            `By ${book.author}`
        ),
    });
    return ogResponse(png);
};
