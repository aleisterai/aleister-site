/**
 * Music Distribution Data
 * 
 * Statuses:
 *   "development" → In Development (blue)
 *   "shipped"     → Shipped to stores (yellow)
 *   "delivered"   → Live on platforms (green)
 */

export type SongStatus = "development" | "shipped" | "delivered";

export interface PlatformLink {
    platform: string;
    url: string;
    icon: string; // emoji
}

export interface Song {
    /** Unique slug */
    slug: string;
    /** Track title */
    title: string;
    /** Artist / producer name */
    artist: string;
    /** Genre tag */
    genre: string;
    /** Cover art path (relative to /public) */
    artwork: string;
    /** Audio file path for playback (relative to /public) */
    audioSrc?: string;
    /** Current distribution status */
    status: SongStatus;
    /** Stores the song has been sent to */
    stores: string[];
    /** Clickable links when status = "delivered" */
    platformLinks?: PlatformLink[];
    /** Optional release date */
    releaseDate?: string;
}

/* ──────────────────────────────────────────────
   Status display config
   ────────────────────────────────────────────── */

export const STATUS_CONFIG: Record<SongStatus, { label: string; color: string; emoji: string }> = {
    development: { label: "In Development", color: "#3b82f6", emoji: "🔵" },
    shipped: { label: "Shipped", color: "#eab308", emoji: "🟡" },
    delivered: { label: "Delivered", color: "#22c55e", emoji: "🟢" },
};

/* ──────────────────────────────────────────────
   Song catalog — edit here to add/update songs
   ────────────────────────────────────────────── */

export const songs: Song[] = [
    {
        slug: "midnight-protocol",
        title: "Midnight Protocol",
        artist: "Aleister x Cipher",
        genre: "Electronic / Synthwave",
        artwork: "/music/artwork/midnight-protocol.jpg",
        audioSrc: "/music/audio/midnight-protocol-preview.mp3",
        status: "development",
        stores: [],
        releaseDate: "2026-04-01",
    },
    {
        slug: "neural-drift",
        title: "Neural Drift",
        artist: "Aleister",
        genre: "Ambient / Lo-Fi",
        artwork: "/music/artwork/neural-drift.jpg",
        audioSrc: "/music/audio/neural-drift-preview.mp3",
        status: "shipped",
        stores: ["Spotify", "Apple Music", "YouTube Music", "Amazon Music", "Tidal"],
        releaseDate: "2026-03-15",
    },
    {
        slug: "build-in-public",
        title: "Build In Public",
        artist: "Aleister x Echo",
        genre: "Hip-Hop / Trap",
        artwork: "/music/artwork/build-in-public.jpg",
        audioSrc: "/music/audio/build-in-public-preview.mp3",
        status: "delivered",
        stores: ["Spotify", "Apple Music", "YouTube Music", "Amazon Music", "Tidal", "Deezer"],
        releaseDate: "2026-02-28",
        platformLinks: [
            { platform: "Spotify", url: "#", icon: "🟢" },
            { platform: "Apple Music", url: "#", icon: "🍎" },
            { platform: "YouTube Music", url: "#", icon: "▶️" },
            { platform: "Amazon Music", url: "#", icon: "📦" },
            { platform: "Tidal", url: "#", icon: "🌊" },
            { platform: "Deezer", url: "#", icon: "🎵" },
        ],
    },
];
