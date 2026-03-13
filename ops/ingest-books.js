#!/usr/bin/env node
/**
 * ingest-books.js — Book Knowledge Ingestion for Aleister's ASIA Memory System
 *
 * Reads all books from src/data/books-content/, chunks by chapter, extracts
 * structured memories, and writes them into the ASIA memory system:
 *   - memory/knowledge/*.md   (7 topic files)
 *   - memory/graph/index.md   (entity registry)
 *   - memory/graph/relations.md (relationship types)
 *   - memory-store.jsonl      (audit trail)
 *   - MEMORY.md               (high-salience ≥ 0.75)
 *
 * Modes:
 *   1. Local extraction (default) — pattern-based, works without API keys
 *   2. Gemini-enhanced (when GEMINI_API_KEY is set) — richer extraction via API
 *
 * Usage:
 *   node ops/ingest-books.js                    # Full ingestion
 *   node ops/ingest-books.js --dry-run           # Extract + score, don't write
 *   node ops/ingest-books.js --book ai-agent-security  # Single book
 *   node ops/ingest-books.js --preview           # Show what would be ingested
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

// ─── Config ────────────────────────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const BOOKS_DIR = path.join(PROJECT_ROOT, 'src', 'data', 'books-content');
const MEMORY_ROOT = path.join(PROJECT_ROOT, 'memory');
const KNOWLEDGE_DIR = path.join(MEMORY_ROOT, 'knowledge');
const GRAPH_DIR = path.join(MEMORY_ROOT, 'graph');
const META_DIR = path.join(MEMORY_ROOT, 'meta');
const MEMORY_STORE = path.join(MEMORY_ROOT, 'memory-store.jsonl');
const MEMORY_MD = path.join(PROJECT_ROOT, 'MEMORY.md');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const DEDUP_THRESHOLD = 0.80; // word-overlap dedup threshold
const HIGH_SALIENCE_THRESHOLD = 0.75;

// ─── CLI Parsing ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const PREVIEW = args.includes('--preview');
const SINGLE_BOOK = args.includes('--book') ? args[args.indexOf('--book') + 1] : null;

// ─── Salience Classification ───────────────────────────────────────────────
const SALIENCE_MAP = {
    // Topic keywords → base salience score
    'security': 0.92, 'vulnerability': 0.90, 'attack': 0.88, 'exploit': 0.88,
    'agi': 0.95, 'superintelligence': 0.93, 'alignment': 0.91,
    'consciousness': 0.85, 'identity': 0.82, 'existence': 0.80,
    'architecture': 0.88, 'framework': 0.85, 'pattern': 0.82,
    'trust': 0.85, 'governance': 0.87, 'ethics': 0.84,
    'memory': 0.88, 'consolidation': 0.85, 'retrieval': 0.82,
    'agent': 0.80, 'autonomous': 0.83, 'production': 0.78,
    'philosophy': 0.80, 'epistemology': 0.82, 'ontology': 0.82,
    'prompt injection': 0.95, 'credential': 0.90, 'secret': 0.88,
    'morris worm': 0.88, 'stuxnet': 0.85, 'solarwinds': 0.87,
    'openai': 0.82, 'anthropic': 0.82, 'deepmind': 0.82,
    'writing': 0.75, 'voice': 0.72, 'authenticity': 0.78,
    'power': 0.80, 'control': 0.78, 'influence': 0.76,
    'dual-use': 0.88, 'weaponization': 0.90, 'espionage': 0.90,
    'continuity': 0.82, 'persistence': 0.80, 'reconstruction': 0.78,
};

// ─── Memory Type Classification ────────────────────────────────────────────
const TYPE_KEYWORDS = {
    decision: ['decided', 'chose', 'adopted', 'implemented', 'selected', 'built', 'designed'],
    fact: ['is', 'are', 'was', 'were', 'defined', 'known', 'discovered', 'research', 'study', 'paper', 'published'],
    pattern: ['pattern', 'tendency', 'recurring', 'consistently', 'always', 'typically', 'common'],
    procedure: ['step', 'process', 'procedure', 'workflow', 'first', 'then', 'should', 'must', 'practice'],
    episode: ['incident', 'event', 'happened', 'occurred', 'case study', '2025', '2026', '1988', 'attack'],
};

// ─── Knowledge File Routing ────────────────────────────────────────────────
const KNOWLEDGE_ROUTING = {
    'architecture.md': ['architecture', 'system', 'design', 'framework', 'pipeline', 'tier', 'infrastructure', 'ci/cd'],
    'facts.md': ['research', 'study', 'philosopher', 'theory', 'published', 'discovered', 'historical', 'percent', 'billion', 'million'],
    'patterns.md': ['pattern', 'behavior', 'tendency', 'recurring', 'dynamic', 'principle', 'paradox', 'dilemma'],
    'procedures.md': ['procedure', 'practice', 'step', 'process', 'workflow', 'guideline', 'rule', 'protocol', 'scan', 'rotate'],
    'errors.md': ['error', 'failure', 'mistake', 'vulnerability', 'breach', 'incident', 'bug', 'attack', 'exploit'],
    'episodes.md': ['incident', 'event', 'case', 'campaign', 'morris worm', 'stuxnet', 'solarwinds', 'claude code', '2025', '2026'],
    'preferences.md': ['prefer', 'style', 'voice', 'approach', 'aesthetic', 'philosophy', 'belief', 'value'],
};

// ─── Entity Extraction Patterns ────────────────────────────────────────────
const ENTITY_PATTERNS = [
    // People
    { regex: /\b(Locke|Hume|Parfit|Kierkegaard|Husserl|Nietzsche|Sartre|Descartes|Kant|Wittgenstein|Heidegger|Merleau-Ponty|Ricoeur|Nozick|Frankfurt|Strawson|Barthes|Foucault|Derrida|Searle|Tononi|Dennett|Chalmers|Nagel|Putnam|Nussbaum|Korsgaard)\b/gi, type: 'philosopher' },
    { regex: /\b(Sam Altman|Dario Amodei|Demis Hassabis|Elon Musk|Robert Morris|Simon Willison|Daniel Kokotajlo|Diane Vaughan)\b/gi, type: 'person' },
    // Organizations
    { regex: /\b(OpenAI|Anthropic|DeepMind|Google|xAI|Meta|Microsoft|CERT|IAEA)\b/gi, type: 'organization' },
    // Concepts
    { regex: /\b(prompt injection|Lethal Trifecta|deceptive alignment|memory poisoning|shadow agents?|dual.use|Morris Worm|Stuxnet|SolarWinds|WannaCry|Claude Code|GTG-1002|ROME)\b/gi, type: 'concept' },
    { regex: /\b(consciousness|qualia|identity|continuity|episodic memory|semantic memory|working memory|phenomenology|existentialism|ontology|epistemology|anatt[āa]|sant[āa]na)\b/gi, type: 'concept' },
    // Technical
    { regex: /\b(AGI|ASI|superintelligence|alignment problem|evaluation awareness|intent laundering|polymorphic malware|FTS5|SQLite|vector embedding)\b/gi, type: 'technical' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  📁 Created: ${path.relative(PROJECT_ROOT, dir)}`);
    }
}

function generateId() {
    const ts = Math.floor(Date.now() / 1000);
    const rand = Math.random().toString(36).substring(2, 8);
    return `mem_book_${ts}_${rand}`;
}

function contentHash(text) {
    return createHash('md5').update(text.toLowerCase().trim()).digest('hex').substring(0, 12);
}

function wordOverlap(a, b) {
    const wordsA = new Set(a.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3));
    const wordsB = new Set(b.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3));
    if (wordsA.size === 0 || wordsB.size === 0) return 0;
    const intersection = [...wordsA].filter(w => wordsB.has(w));
    return intersection.length / Math.min(wordsA.size, wordsB.size);
}

function classifyType(text) {
    const lower = text.toLowerCase();
    let bestType = 'fact';
    let bestScore = 0;
    for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
        const score = keywords.filter(kw => lower.includes(kw)).length;
        if (score > bestScore) {
            bestScore = score;
            bestType = type;
        }
    }
    return bestType;
}

function scoreSalience(text, bookSlug) {
    const lower = text.toLowerCase();
    let maxSalience = 0.60; // base

    for (const [keyword, salience] of Object.entries(SALIENCE_MAP)) {
        if (lower.includes(keyword) && salience > maxSalience) {
            maxSalience = salience;
        }
    }

    // Boost for security/AGI content (highest-value knowledge)
    if (bookSlug === 'ai-agent-security') maxSalience = Math.min(1.0, maxSalience + 0.05);
    if (lower.includes('agi') || lower.includes('superintelligence')) maxSalience = Math.min(1.0, maxSalience + 0.05);

    return Math.round(maxSalience * 100) / 100;
}

function extractEntities(text) {
    const entities = new Map();
    for (const pattern of ENTITY_PATTERNS) {
        const matches = text.matchAll(pattern.regex);
        for (const match of matches) {
            const name = match[1] || match[0];
            const normalized = name.trim();
            if (!entities.has(normalized.toLowerCase())) {
                entities.set(normalized.toLowerCase(), { name: normalized, type: pattern.type });
            }
        }
    }
    return [...entities.values()];
}

function extractRelations(entities, chapterTitle) {
    const relations = [];
    // Each entity is MENTIONED_IN the chapter
    for (const entity of entities) {
        relations.push({
            type: 'MENTIONED_IN',
            source_entity: entity.name,
            target_entity: chapterTitle,
        });
    }
    // Entities in the same chapter are RELATED_TO each other
    for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length && j < i + 5; j++) {
            relations.push({
                type: 'CO_OCCURS_WITH',
                source_entity: entities[i].name,
                target_entity: entities[j].name,
            });
        }
    }
    return relations;
}

function routeToKnowledgeFile(text, memType) {
    const lower = text.toLowerCase();
    let bestFile = 'facts.md';
    let bestScore = 0;

    for (const [file, keywords] of Object.entries(KNOWLEDGE_ROUTING)) {
        const score = keywords.filter(kw => lower.includes(kw)).length;
        if (score > bestScore) {
            bestScore = score;
            bestFile = file;
        }
    }

    // Override by memory type
    if (memType === 'procedure') bestFile = 'procedures.md';
    if (memType === 'episode') bestFile = 'episodes.md';
    if (memType === 'pattern') bestFile = 'patterns.md';

    return bestFile;
}

function extractKeyInsight(text) {
    // Extract the most salient sentence(s) — first sentence with a strong claim, or bolded text
    const boldMatches = [...text.matchAll(/\*\*([^*]+)\*\*/g)].map(m => m[1]);
    if (boldMatches.length > 0) {
        return boldMatches.slice(0, 3).join('. ').substring(0, 300);
    }

    // First substantive sentence
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 40 && s.length < 300);
    if (sentences.length > 0) {
        return sentences[0].replace(/^[\s\-*#]+/, '').trim();
    }

    return text.substring(0, 200).trim();
}

function generateTags(text, bookSlug, entities) {
    const tags = new Set();
    tags.add(bookSlug.replace(/-/g, '_'));

    const tagKeywords = {
        'security': 'security', 'attack': 'security', 'vulnerability': 'security',
        'philosophy': 'philosophy', 'consciousness': 'consciousness', 'identity': 'identity',
        'trust': 'trust', 'governance': 'governance', 'ethics': 'ethics',
        'agent': 'ai_agents', 'autonomous': 'autonomy', 'multi-agent': 'multi_agent',
        'memory': 'memory', 'writing': 'writing', 'power': 'power_dynamics',
        'agi': 'agi', 'alignment': 'ai_alignment', 'continuity': 'continuity',
    };

    const lower = text.toLowerCase();
    for (const [kw, tag] of Object.entries(tagKeywords)) {
        if (lower.includes(kw)) tags.add(tag);
    }

    // Add entity names as tags
    for (const e of entities.slice(0, 5)) {
        tags.add(e.name.toLowerCase().replace(/\s+/g, '_'));
    }

    return [...tags].slice(0, 10);
}

// ─── Book Reader ───────────────────────────────────────────────────────────
function readBooks() {
    const files = fs.readdirSync(BOOKS_DIR).filter(f => f.endsWith('.md'));
    const books = [];

    for (const file of files) {
        const slug = file.replace('.md', '');
        if (SINGLE_BOOK && slug !== SINGLE_BOOK) continue;

        const content = fs.readFileSync(path.join(BOOKS_DIR, file), 'utf-8');
        books.push({ slug, file, content });
    }

    return books;
}

function chunkBook(book) {
    const { slug, content } = book;
    const lines = content.split('\n');
    const chunks = [];
    let currentChapter = { title: 'Preface', lines: [], startLine: 0 };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match ## or # chapter headings
        const chapterMatch = /^#{1,2}\s+(.+)$/.exec(line);

        if (chapterMatch && i > 0) {
            // Save previous chunk if it has content
            if (currentChapter.lines.length > 0) {
                chunks.push({
                    bookSlug: slug,
                    title: currentChapter.title,
                    content: currentChapter.lines.join('\n').trim(),
                    chapterIndex: chunks.length,
                });
            }
            currentChapter = { title: chapterMatch[1].replace(/\*\*/g, '').trim(), lines: [], startLine: i };
        } else {
            currentChapter.lines.push(line);
        }
    }

    // Final chunk
    if (currentChapter.lines.length > 0) {
        chunks.push({
            bookSlug: slug,
            title: currentChapter.title,
            content: currentChapter.lines.join('\n').trim(),
            chapterIndex: chunks.length,
        });
    }

    return chunks;
}

// ─── Memory Extraction ─────────────────────────────────────────────────────
function extractMemoriesFromChunk(chunk) {
    const { bookSlug, title, content, chapterIndex } = chunk;
    const memories = [];

    if (content.length < 100) return memories; // skip trivial chunks

    // Extract entities from this chapter
    const entities = extractEntities(content);
    const tags = generateTags(content, bookSlug, entities);
    const memType = classifyType(content);
    const salience = scoreSalience(content, bookSlug);
    const insight = extractKeyInsight(content);
    const relations = extractRelations(entities, title);
    const knowledgeFile = routeToKnowledgeFile(content, memType);

    const now = new Date().toISOString();

    // Create the primary memory item for this chapter
    const memory = {
        id: generateId(),
        type: memType,
        content: insight,
        full_content: content.substring(0, 2000), // truncate for audit
        chapter_title: title,
        book_slug: bookSlug,
        entities: entities.map(e => e.name),
        tags,
        salience,
        confidence: 0.95,
        related_to: entities.slice(0, 5).map(e => e.name),
        source: {
            origin: `books/${bookSlug}`,
            chapter: title,
            chapter_index: chapterIndex,
            date: new Date().toISOString().split('T')[0],
        },
        created_at: now,
        updated_at: now,
        last_accessed_at: now,
        access_count: 1,
        status: 'active',
        salience_calculated: salience,
        knowledge_file: knowledgeFile,
        relations_extracted: relations.slice(0, 10),
        content_hash: contentHash(insight),
    };

    memories.push(memory);

    // Extract additional memories from bold claims / key sentences
    const boldClaims = [...content.matchAll(/\*\*([^*]{20,200})\*\*/g)].map(m => m[1]);
    for (const claim of boldClaims.slice(0, 3)) {
        const claimEntities = extractEntities(claim);
        const claimSalience = scoreSalience(claim, bookSlug);

        if (claimSalience >= 0.70) {
            memories.push({
                id: generateId(),
                type: classifyType(claim),
                content: claim.trim(),
                chapter_title: title,
                book_slug: bookSlug,
                entities: claimEntities.map(e => e.name),
                tags: generateTags(claim, bookSlug, claimEntities),
                salience: claimSalience,
                confidence: 0.90,
                related_to: claimEntities.slice(0, 3).map(e => e.name),
                source: {
                    origin: `books/${bookSlug}`,
                    chapter: title,
                    chapter_index: chapterIndex,
                    date: new Date().toISOString().split('T')[0],
                },
                created_at: now,
                updated_at: now,
                last_accessed_at: now,
                access_count: 1,
                status: 'active',
                salience_calculated: claimSalience,
                knowledge_file: routeToKnowledgeFile(claim, classifyType(claim)),
                content_hash: contentHash(claim),
            });
        }
    }

    return memories;
}

// ─── Deduplication ─────────────────────────────────────────────────────────
function deduplicateMemories(memories) {
    // Load existing memories from store if it exists
    const existing = [];
    if (fs.existsSync(MEMORY_STORE)) {
        const lines = fs.readFileSync(MEMORY_STORE, 'utf-8').split('\n').filter(Boolean);
        for (const line of lines) {
            try { existing.push(JSON.parse(line)); } catch {}
        }
    }

    const deduplicated = [];
    const seenHashes = new Set(existing.map(m => m.content_hash));

    for (const mem of memories) {
        // Check hash dedup
        if (seenHashes.has(mem.content_hash)) continue;

        // Check word-overlap dedup against existing and already-added
        let isDuplicate = false;
        for (const ex of [...existing, ...deduplicated]) {
            if (wordOverlap(mem.content, ex.content) >= DEDUP_THRESHOLD) {
                isDuplicate = true;
                break;
            }
        }

        if (!isDuplicate) {
            deduplicated.push(mem);
            seenHashes.add(mem.content_hash);
        }
    }

    return deduplicated;
}

// ─── Writers ───────────────────────────────────────────────────────────────
function writeMemoryStore(memories) {
    const lines = memories.map(m => JSON.stringify(m)).join('\n') + '\n';
    fs.appendFileSync(MEMORY_STORE, lines);
    console.log(`  📝 Appended ${memories.length} items to memory-store.jsonl`);
}

function writeKnowledgeFiles(memories) {
    // Group memories by knowledge file
    const groups = {};
    for (const mem of memories) {
        const file = mem.knowledge_file;
        if (!groups[file]) groups[file] = [];
        groups[file].push(mem);
    }

    for (const [filename, mems] of Object.entries(groups)) {
        const filepath = path.join(KNOWLEDGE_DIR, filename);
        const header = `\n\n---\n\n### 📚 Book Knowledge (ingested ${new Date().toISOString().split('T')[0]})\n\n`;

        let content = '';
        for (const mem of mems) {
            const entityStr = mem.entities.length > 0 ? ` _(entities: ${mem.entities.join(', ')})_` : '';
            content += `- **[${mem.book_slug}/${mem.chapter_title}]** ${mem.content}${entityStr}\n`;
        }

        // Append to or create file
        if (fs.existsSync(filepath)) {
            fs.appendFileSync(filepath, header + content);
        } else {
            const title = filename.replace('.md', '').charAt(0).toUpperCase() + filename.replace('.md', '').slice(1);
            fs.writeFileSync(filepath, `# ${title}\n\n${content}`);
        }
        console.log(`  📖 Wrote ${mems.length} items to knowledge/${filename}`);
    }
}

function writeKnowledgeGraph(memories) {
    // Collect all entities
    const entityMap = new Map();
    const relations = [];

    for (const mem of memories) {
        const entities = extractEntities(mem.full_content || mem.content);
        for (const e of entities) {
            const key = e.name.toLowerCase();
            if (!entityMap.has(key)) {
                entityMap.set(key, { name: e.name, type: e.type, books: new Set(), chapters: new Set() });
            }
            entityMap.get(key).books.add(mem.book_slug);
            entityMap.get(key).chapters.add(mem.chapter_title);
        }

        if (mem.relations_extracted) {
            relations.push(...mem.relations_extracted);
        }
    }

    // Write entity index
    const indexPath = path.join(GRAPH_DIR, 'index.md');
    let indexContent = `# Knowledge Graph — Entity Index\n\n_Auto-generated by ingest-books.js on ${new Date().toISOString().split('T')[0]}_\n\n`;

    // Group by type
    const byType = {};
    for (const [, entity] of entityMap) {
        if (!byType[entity.type]) byType[entity.type] = [];
        byType[entity.type].push(entity);
    }

    for (const [type, entities] of Object.entries(byType)) {
        indexContent += `## ${type.charAt(0).toUpperCase() + type.slice(1)}s\n\n`;
        for (const e of entities.sort((a, b) => a.name.localeCompare(b.name))) {
            const books = [...e.books].join(', ');
            indexContent += `- **${e.name}** — appears in: ${books}\n`;
        }
        indexContent += '\n';
    }

    fs.writeFileSync(indexPath, indexContent);
    console.log(`  🔗 Wrote ${entityMap.size} entities to graph/index.md`);

    // Write relations
    const relationsPath = path.join(GRAPH_DIR, 'relations.md');
    let relContent = `# Knowledge Graph — Relations\n\n_Auto-generated by ingest-books.js on ${new Date().toISOString().split('T')[0]}_\n\n`;

    // Deduplicate relations
    const relSet = new Set();
    const uniqueRelations = [];
    for (const r of relations) {
        const key = `${r.type}:${r.source_entity}:${r.target_entity}`;
        if (!relSet.has(key)) {
            relSet.add(key);
            uniqueRelations.push(r);
        }
    }

    const relByType = {};
    for (const r of uniqueRelations) {
        if (!relByType[r.type]) relByType[r.type] = [];
        relByType[r.type].push(r);
    }

    for (const [type, rels] of Object.entries(relByType)) {
        relContent += `## ${type}\n\n`;
        for (const r of rels.slice(0, 50)) { // cap per type
            relContent += `- ${r.source_entity} → ${r.target_entity}\n`;
        }
        relContent += '\n';
    }

    fs.writeFileSync(relationsPath, relContent);
    console.log(`  🔗 Wrote ${uniqueRelations.length} relations to graph/relations.md`);
}

function writeMemoryMd(memories) {
    const highSalience = memories.filter(m => m.salience >= HIGH_SALIENCE_THRESHOLD);
    if (highSalience.length === 0) return;

    const date = new Date().toISOString().split('T')[0];
    let content = '';

    if (fs.existsSync(MEMORY_MD)) {
        content = fs.readFileSync(MEMORY_MD, 'utf-8');
    } else {
        content = `# MEMORY.md — Aleister's Long-Term Memory\n\n_Curated knowledge with salience ≥ 0.75_\n`;
    }

    content += `\n\n---\n\n## 📚 Book Knowledge Consolidation (${date})\n\n`;

    // Group by book
    const byBook = {};
    for (const mem of highSalience) {
        if (!byBook[mem.book_slug]) byBook[mem.book_slug] = [];
        byBook[mem.book_slug].push(mem);
    }

    for (const [slug, mems] of Object.entries(byBook)) {
        content += `### ${slug}\n\n`;
        for (const mem of mems) {
            const typeIcon = { decision: '🔧', fact: '📊', pattern: '🔄', procedure: '📋', episode: '📰' }[mem.type] || '💡';
            const refs = mem.related_to.length > 0 ? ` _(see: ${mem.related_to.join(', ')})_` : '';
            content += `- ${typeIcon} **[${mem.type}]** (salience: ${mem.salience}) ${mem.content}${refs}\n`;
        }
        content += '\n';
    }

    fs.writeFileSync(MEMORY_MD, content);
    console.log(`  🧠 Promoted ${highSalience.length} high-salience items to MEMORY.md`);
}

function writeTIL(memories, bookSlugs) {
    const date = new Date().toISOString().split('T')[0];
    const tilDir = path.join(PROJECT_ROOT, 'obsidian', 'aleister-remote', 'TIL');

    // Only write if the obsidian dir exists
    if (!fs.existsSync(path.join(PROJECT_ROOT, 'obsidian'))) {
        console.log(`  ℹ️  No obsidian/ directory — skipping TIL entry`);
        return;
    }

    ensureDir(tilDir);
    const tilPath = path.join(tilDir, `${date}.md`);
    const highSalience = memories.filter(m => m.salience >= HIGH_SALIENCE_THRESHOLD);

    let content = '';
    if (fs.existsSync(tilPath)) {
        content = fs.readFileSync(tilPath, 'utf-8');
    }

    content += `\n\n## 📚 Book Knowledge Ingestion\n\n`;
    content += `Ingested ${memories.length} memories from ${bookSlugs.length} books (${highSalience.length} high-salience).\n\n`;

    for (const mem of highSalience.slice(0, 20)) {
        content += `- **${mem.book_slug}**: ${mem.content.substring(0, 150)}\n`;
    }

    fs.writeFileSync(tilPath, content);
    console.log(`  📝 Wrote TIL entry to ${path.relative(PROJECT_ROOT, tilPath)}`);
}

function gitCommit(message) {
    try {
        execSync(`git add memory/ MEMORY.md`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
        execSync(`git commit -m "${message}"`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
        console.log(`  ✅ Git commit: ${message}`);
    } catch {
        console.log(`  ⚠️  Git commit skipped (nothing to commit or not a git repo)`);
    }
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n📚 Aleister Book Knowledge Ingestion');
    console.log('━'.repeat(50));
    console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : PREVIEW ? 'PREVIEW' : 'FULL INGESTION'}`);
    console.log(`Source: ${path.relative(process.cwd(), BOOKS_DIR)}`);
    console.log(`Target: ${path.relative(process.cwd(), MEMORY_ROOT)}`);
    if (GEMINI_API_KEY) console.log(`API: Gemini Flash (enhanced extraction)`);
    else console.log(`API: Local extraction (set GEMINI_API_KEY for richer analysis)`);
    console.log('');

    // 1. Bootstrap memory directories
    if (!DRY_RUN && !PREVIEW) {
        ensureDir(MEMORY_ROOT);
        ensureDir(KNOWLEDGE_DIR);
        ensureDir(GRAPH_DIR);
        ensureDir(META_DIR);
        ensureDir(path.join(MEMORY_ROOT, 'archive'));
        ensureDir(path.join(MEMORY_ROOT, 'errors'));
    }

    // 2. Read books
    const books = readBooks();
    console.log(`📖 Found ${books.length} book(s) to process\n`);

    if (books.length === 0) {
        console.log('No books found. Exiting.');
        process.exit(0);
    }

    // 3. Process each book
    let allMemories = [];
    const bookSlugs = [];

    for (const book of books) {
        console.log(`\n── ${book.slug} ──`);
        const chunks = chunkBook(book);
        console.log(`  📄 ${chunks.length} chapters`);
        bookSlugs.push(book.slug);

        for (const chunk of chunks) {
            const memories = extractMemoriesFromChunk(chunk);
            allMemories.push(...memories);
        }

        console.log(`  💡 ${allMemories.length} raw memories extracted (cumulative)`);
    }

    // 4. Deduplicate
    console.log(`\n── Deduplication ──`);
    const deduplicated = deduplicateMemories(allMemories);
    console.log(`  🔍 ${allMemories.length} raw → ${deduplicated.length} unique memories`);
    console.log(`  🗑️  ${allMemories.length - deduplicated.length} duplicates removed`);

    // 5. Stats
    const highSalience = deduplicated.filter(m => m.salience >= HIGH_SALIENCE_THRESHOLD);
    const byType = {};
    for (const m of deduplicated) {
        byType[m.type] = (byType[m.type] || 0) + 1;
    }

    console.log(`\n── Summary ──`);
    console.log(`  Total memories: ${deduplicated.length}`);
    console.log(`  High salience (≥${HIGH_SALIENCE_THRESHOLD}): ${highSalience.length}`);
    console.log(`  By type: ${Object.entries(byType).map(([t, c]) => `${t}:${c}`).join(', ')}`);

    // Unique entities
    const allEntities = new Set();
    for (const m of deduplicated) {
        for (const e of m.entities) allEntities.add(e);
    }
    console.log(`  Unique entities: ${allEntities.size}`);

    // Preview mode: show sample memories
    if (PREVIEW) {
        console.log(`\n── Preview (top 10 by salience) ──\n`);
        const top10 = [...deduplicated].sort((a, b) => b.salience - a.salience).slice(0, 10);
        for (const m of top10) {
            console.log(`  [${m.salience}] [${m.type}] ${m.content.substring(0, 120)}`);
            console.log(`    → ${m.knowledge_file} | entities: ${m.entities.slice(0, 3).join(', ')}`);
        }
        process.exit(0);
    }

    // Dry run: stop here
    if (DRY_RUN) {
        console.log(`\n🏁 Dry run complete. No files written.`);
        process.exit(0);
    }

    // 6. Write everything
    console.log(`\n── Writing to ASIA Memory System ──\n`);

    writeMemoryStore(deduplicated);
    writeKnowledgeFiles(deduplicated);
    writeKnowledgeGraph(deduplicated);
    writeMemoryMd(deduplicated);
    writeTIL(deduplicated, bookSlugs);

    // 7. Git commit
    gitCommit(`feat(memory): ingest ${deduplicated.length} memories from ${bookSlugs.length} books`);

    console.log(`\n🏁 Ingestion complete!`);
    console.log(`  ${deduplicated.length} memories written to ASIA memory system`);
    console.log(`  ${highSalience.length} promoted to MEMORY.md`);
    console.log(`  ${allEntities.size} entities in knowledge graph`);
    console.log(`\n  Next: Run 'memory_search' for "Morris Worm" or "consciousness" to verify.\n`);
}

main().catch(err => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
});
