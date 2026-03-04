/**
 * Upload all downloads/*.zip to Vercel Blob Storage.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=vercel_blob_... node scripts/upload-to-blob.mjs
 *
 * Each file is uploaded with addRandomSuffix: false so the URL is deterministic:
 *   https://<store>.public.blob.vercel-storage.com/downloads/<slug>.zip
 */

import { put, list } from '@vercel/blob';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const DOWNLOADS_DIR = join(process.cwd(), 'downloads');

async function main() {
    const files = readdirSync(DOWNLOADS_DIR).filter(f => f.endsWith('.zip'));
    console.log(`Found ${files.length} zip files to upload\n`);

    for (const file of files) {
        const filePath = join(DOWNLOADS_DIR, file);
        const blobPath = `downloads/${file}`;
        const data = readFileSync(filePath);

        console.log(`Uploading ${file} (${(data.length / 1024).toFixed(0)} KB)...`);

        const blob = await put(blobPath, data, {
            access: 'private',
            addRandomSuffix: false,
            contentType: 'application/zip',
        });

        console.log(`  → ${blob.url}\n`);
    }

    console.log('Done! All files uploaded to Vercel Blob.');

    // List all blobs to confirm
    console.log('\n--- Blob listing ---');
    const { blobs } = await list({ prefix: 'downloads/' });
    for (const b of blobs) {
        console.log(`  ${b.pathname} (${(b.size / 1024).toFixed(0)} KB)`);
    }
}

main().catch(err => {
    console.error('Upload failed:', err);
    process.exit(1);
});
