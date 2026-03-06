/**
 * Office Equipment Level-Up Catalog
 *
 * Defines all upgradeable items: desks, chairs, furniture, and the building.
 * Level thresholds are computed from cumulative Stripe charge amounts.
 */

export type UpgradeCategory = 'desk' | 'chair' | 'furniture' | 'building';

export interface UpgradeLevel {
    level: number;
    name: string;
    price: number;          // USD — cost to reach this level from the previous
    description: string;
    renderImage: string;    // path to 3D render asset
}

export interface UpgradeItem {
    slug: string;
    name: string;
    shortName: string;
    description: string;
    category: UpgradeCategory;
    agentId?: string;
    avatar?: string;
    color?: string;
    meshPath?: string;          // optional path to a .glb 3D model
    levels: UpgradeLevel[];
}

// ── Agent list (mirrors office-sprites.js) ──────────────────────────
const AGENTS = [
    { id: 'aleister', name: 'Aleister', avatar: '/avatars/hero-avatar.gif', color: '#6c5ce7' },
    { id: 'cipher', name: 'Cipher', avatar: '/avatars/cipher.png', color: '#00b894' },
    { id: 'sage', name: 'Sage', avatar: '/avatars/sage.png', color: '#0984e3' },
    { id: 'quill', name: 'Quill', avatar: '/avatars/quill.png', color: '#fdcb6e' },
    { id: 'rally', name: 'Rally', avatar: '/avatars/rally.png', color: '#e17055' },
    { id: 'echo', name: 'Echo', avatar: '/avatars/echo.png', color: '#a29bfe' },
    { id: 'pixel', name: 'Pixel', avatar: '/avatars/pixel.png', color: '#fd79a8' },
    { id: 'forge', name: 'Forge', avatar: '/avatars/forge.png', color: '#636e72' },
    { id: 'prism', name: 'Prism', avatar: '/avatars/prism.png', color: '#00cec9' },
    { id: 'lyra', name: 'Lyra', avatar: '/avatars/lyra.png', color: '#e84393' },
];

// ── Per-agent desks ─────────────────────────────────────────────────
export const deskUpgrades: UpgradeItem[] = AGENTS.map(a => ({
    slug: `desk-${a.id}`,
    name: `${a.name}'s Desk`,
    shortName: a.name,
    description: `Upgrade ${a.name}'s workstation`,
    category: 'desk' as UpgradeCategory,
    agentId: a.id,
    avatar: a.avatar,
    color: a.color,
    levels: [
        { level: 1, name: 'Basic Desk', price: 5, description: 'Simple wooden desk with a single monitor', renderImage: '/upgrades/renders/desk-l1.png' },
        { level: 2, name: 'Standing Desk', price: 15, description: 'Adjustable standing desk with monitor arm', renderImage: '/upgrades/renders/desk-l2.png' },
        { level: 3, name: 'Executive Desk', price: 30, description: 'Premium desk with dual monitors and LED underglow', renderImage: '/upgrades/renders/desk-l3.png' },
    ],
}));

// ── Per-agent chairs ────────────────────────────────────────────────
export const chairUpgrades: UpgradeItem[] = AGENTS.map(a => ({
    slug: `chair-${a.id}`,
    name: `${a.name}'s Chair`,
    shortName: a.name,
    description: `Upgrade ${a.name}'s office chair`,
    category: 'chair' as UpgradeCategory,
    agentId: a.id,
    avatar: a.avatar,
    color: a.color,
    levels: [
        { level: 1, name: 'Basic Chair', price: 3, description: 'Standard office chair', renderImage: '/upgrades/renders/chair-l1.png' },
        { level: 2, name: 'Ergonomic Chair', price: 10, description: 'Mesh-back ergonomic chair with lumbar support', renderImage: '/upgrades/renders/chair-l2.png' },
        { level: 3, name: 'Executive Chair', price: 25, description: 'Premium leather executive chair with headrest', renderImage: '/upgrades/renders/chair-l3.png' },
    ],
}));

// ── Furniture items ─────────────────────────────────────────────────
export const furnitureUpgrades: UpgradeItem[] = [
    {
        slug: 'furniture-arctic-cooler',
        name: 'Arctic Cooler',
        shortName: 'Arctic',
        description: 'A sleek, modern refrigerator to keep the team fueled',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/fridge.glb',
        levels: [
            { level: 1, name: 'Frost Box', price: 1000, description: 'Compact under-desk fridge with LED indicator', renderImage: '/upgrades/renders/fridge-l1.png' },
            { level: 2, name: 'Arctic Standard', price: 1250, description: 'Full-size stainless steel refrigerator', renderImage: '/upgrades/renders/fridge-l2.png' },
            { level: 3, name: 'Arctic Prime', price: 1500, description: 'Premium fridge with touchscreen and smart inventory', renderImage: '/upgrades/renders/fridge-l3.png' },
        ],
    },
    {
        slug: 'furniture-polar-station',
        name: 'Polar Station',
        shortName: 'Polar',
        description: 'A full-size stainless steel refrigerator with ice maker',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/fridge-v2.glb',
        levels: [
            { level: 1, name: 'Polar Mini', price: 1000, description: 'Basic office beverage cooler', renderImage: '/upgrades/renders/fridge-l2.png' },
            { level: 2, name: 'Polar Dual', price: 1250, description: 'Premium stainless steel with dual-zone cooling', renderImage: '/upgrades/renders/fridge-l2.png' },
            { level: 3, name: 'Polar Max', price: 1500, description: 'Commercial-grade kitchen refrigerator', renderImage: '/upgrades/renders/fridge-l2.png' },
        ],
    },
    {
        slug: 'furniture-quantum-chill',
        name: 'Quantum Chill',
        shortName: 'Quantum',
        description: 'AI-powered smart fridge with touchscreen display',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/fridge-v3.glb',
        levels: [
            { level: 1, name: 'Quantum Lite', price: 1000, description: 'WiFi-enabled fridge with inventory tracking', renderImage: '/upgrades/renders/fridge-l3.png' },
            { level: 2, name: 'Quantum Pro', price: 1250, description: 'Touchscreen fridge with recipe suggestions', renderImage: '/upgrades/renders/fridge-l3.png' },
            { level: 3, name: 'Quantum Ultra', price: 3000, description: 'Full AI kitchen hub with holographic display', renderImage: '/upgrades/renders/fridge-l3.png' },
        ],
    },
    {
        slug: 'furniture-neon-vault',
        name: 'Neon Vault',
        shortName: 'Neon',
        description: 'A cyberpunk fridge with neon LED accents and RGB panels',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/fridge-neon.glb',
        levels: [
            { level: 1, name: 'Neon Core', price: 1000, description: 'Mini fridge with neon underglow', renderImage: '/upgrades/renders/fridge-l3.png' },
            { level: 2, name: 'Neon Surge', price: 1250, description: 'Full-size fridge with RGB LED panels', renderImage: '/upgrades/renders/fridge-l3.png' },
            { level: 3, name: 'Neon Apex', price: 3000, description: 'Cyberpunk vault fridge with holographic display', renderImage: '/upgrades/renders/fridge-l3.png' },
        ],
    },
    {
        slug: 'furniture-eden-garden',
        name: 'Eden Garden',
        shortName: 'Eden',
        description: 'Add some greenery and life to the office',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/plants.glb',
        levels: [
            { level: 1, name: 'Eden Sprout', price: 50, description: 'Lush indoor plant collection in ceramic pots', renderImage: '/upgrades/renders/plants-l1.png' },
        ],
    },
    {
        slug: 'furniture-gallery-wall',
        name: 'Gallery Wall',
        shortName: 'Gallery',
        description: 'Decorate the walls with curated art pieces',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/art.glb',
        levels: [
            { level: 1, name: 'Gallery Collection', price: 90, description: 'Curated gallery wall with abstract canvas and neon accents', renderImage: '/upgrades/renders/art-l1.png' },
        ],
    },
    {
        slug: 'furniture-mainframe',
        name: 'Mainframe',
        shortName: 'Mainframe',
        description: 'The brains behind the entire operation',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/server.glb',
        levels: [
            { level: 1, name: 'Mainframe Cluster', price: 15000, description: 'Enterprise server rack with RGB cooling and glass doors', renderImage: '/upgrades/renders/server-l1.png' },
        ],
    },
    {
        slug: 'furniture-nimbus-sofa',
        name: 'Nimbus Sofa',
        shortName: 'Nimbus',
        description: 'A modern lounge sofa for breaks and brainstorming',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/sofa.glb',
        levels: [
            { level: 1, name: 'Nimbus Lounge', price: 140, description: 'Premium L-shaped sectional sofa with built-in charging', renderImage: '/upgrades/renders/sofa-l1.png' },
        ],
    },
    {
        slug: 'furniture-velvet-divan',
        name: 'Velvet Divan',
        shortName: 'Divan',
        description: 'A vintage-style couch for the lounge area',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/sofa-v1.glb',
        levels: [
            { level: 1, name: 'Velvet Classic', price: 290, description: 'Designer mid-century couch with premium upholstery', renderImage: '/upgrades/renders/sofa-l1.png' },
        ],
    },
    {
        slug: 'furniture-atlas-shelf',
        name: 'Atlas Shelf',
        shortName: 'Atlas',
        description: 'Knowledge is power — fill the shelves',
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/bookshelf.glb',
        levels: [
            { level: 1, name: 'Atlas Library', price: 200, description: 'Floor-to-ceiling wall bookshelf with sliding ladder', renderImage: '/upgrades/renders/bookshelf-l1.png' },
        ],
    },
    {
        slug: 'furniture-symphony-keys',
        name: 'Symphony Keys',
        shortName: 'Symphony',
        description: "For Lyra's musical creations",
        category: 'furniture',
        meshPath: '/upgrades/renders/mesh/piano.glb',
        levels: [
            { level: 1, name: 'Symphony Grand', price: 900, description: 'Baby grand piano in glossy black', renderImage: '/upgrades/renders/piano-l1.png' },
        ],
    },
];

// ── Building upgrade ────────────────────────────────────────────────
export const buildingUpgrade: UpgradeItem = {
    slug: 'building',
    name: 'Office Building',
    shortName: 'Building',
    description: 'Level up the entire office — bigger, better, more impressive',
    category: 'building',
    levels: [
        { level: 1, name: 'Upgraded Office', price: 5000, description: 'Expanded floor plan, new rooms, premium finishes', renderImage: '/upgrades/renders/building-l1.png' },
    ],
};

// ── All items combined ──────────────────────────────────────────────
export const allUpgradeItems: UpgradeItem[] = [
    ...deskUpgrades,
    ...chairUpgrades,
    ...furnitureUpgrades,
    buildingUpgrade,
];

export function getUpgradeBySlug(slug: string): UpgradeItem | undefined {
    return allUpgradeItems.find(i => i.slug === slug);
}

/**
 * Compute current level from total raised amount.
 * Returns { level, nextLevelCost, totalToNextLevel }
 */
export function computeLevel(item: UpgradeItem, totalRaised: number) {
    let currentLevel = 0;
    let cumulative = 0;

    for (const lvl of item.levels) {
        if (totalRaised >= cumulative + lvl.price) {
            currentLevel = lvl.level;
            cumulative += lvl.price;
        } else {
            break;
        }
    }

    const nextLevel = item.levels.find(l => l.level === currentLevel + 1);
    const amountToNext = nextLevel ? (cumulative + nextLevel.price) - totalRaised : 0;

    return {
        currentLevel,
        totalRaised,
        maxLevel: item.levels.length,
        isMaxed: currentLevel >= item.levels.length,
        nextLevel: nextLevel || null,
        amountToNext,
        cumulativeSpent: cumulative,
    };
}
