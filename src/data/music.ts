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
    icon: string;
}

export interface Song {
    slug: string;
    title: string;
    artist: string;
    genre: string;
    artwork: string;
    audioSrc?: string;
    status: SongStatus;
    stores: string[];
    platformLinks?: PlatformLink[];
    releaseDate?: string;
}

export const STATUS_CONFIG: Record<
    SongStatus,
    { label: string; color: string; emoji: string }
> = {
    development: { label: "In Development", color: "#3b82f6", emoji: "🔵" },
    shipped: { label: "Shipped", color: "#eab308", emoji: "🟡" },
    delivered: { label: "Delivered", color: "#22c55e", emoji: "🟢" },
};

export const songs: Song[] = [
    {
        slug: "backseat-halo",
        title: "Backseat Halo",
        artist: "The Aleister",
        genre: "R&B",
        artwork: "/music/artwork/backseat-halo.jpg",
        audioSrc: "/music/audio/backseat-halo.mp3",
        status: "shipped",
        stores: [
            "Spotify",
            "Apple Music",
            "YouTube Music",
            "Amazon Music",
            "Tidal",
            "Deezer",
        ],
    },
];
