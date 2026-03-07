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
    releaseId?: string;
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
        releaseId: "4454029",
        status: "delivered",
        stores: [
            "Spotify",
            "Apple Music",
            "YouTube Music",
            "Amazon Music",
            "Tidal",
            "Deezer",
        ],
        platformLinks: [
            {
                platform: "Spotify",
                url: "https://open.spotify.com/track/71llGexZq5XqE125L46uGu?si=e38d67d855f34b17",
                icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
            },
            {
                platform: "Apple Music",
                url: "https://music.apple.com/us/album/backseat-halo-single/1882994806",
                icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0 0 19.7.28C18.96.094 18.21.036 17.46.012c-.11-.004-.222-.01-.332-.012H6.876c-.14.006-.28.01-.418.012C5.73.036 5.004.1 4.286.296 2.94.7 1.944 1.498 1.26 2.746.818 3.58.558 4.478.44 5.424c-.06.484-.092.97-.1 1.458-.004.104-.01.206-.01.308v9.614c.004.104.006.21.01.316.01.488.04.976.1 1.46.118.948.378 1.846.822 2.68.682 1.246 1.678 2.044 3.022 2.448.436.132.882.202 1.334.24.528.044 1.056.066 1.586.068h10.778c.106-.006.21-.008.316-.01.488-.01.976-.04 1.46-.1.948-.118 1.846-.378 2.68-.822 1.246-.682 2.044-1.678 2.448-3.022.132-.436.202-.882.24-1.334.044-.528.066-1.056.068-1.586V6.124zm-7.27 13.334c-.062.012-.112.024-.166.028-.26.016-.52.034-.78.034H8.224c-.26 0-.52-.018-.78-.034-.054-.004-.104-.016-.166-.028a2.1 2.1 0 0 1-1.674-1.548c-.078-.318-.104-.646-.104-.98V7.126c0-.336.024-.664.104-.98.2-.782.808-1.35 1.554-1.53.156-.04.322-.06.482-.072.26-.016.52-.034.78-.034h7.554c.26 0 .52.018.78.034.16.012.326.032.482.072.746.18 1.354.748 1.554 1.53.08.316.104.644.104.98v9.804c0 .334-.024.662-.104.98a2.1 2.1 0 0 1-1.554 1.548zm-2.06-11.97a.489.489 0 0 0-.346.106.525.525 0 0 0-.178.31l-.04.284V14.4a.728.728 0 0 0-.02.2c-.018.336-.094.648-.28.93-.282.428-.674.662-1.162.742-.292.048-.582.04-.86-.048-.376-.118-.64-.36-.78-.73-.1-.27-.1-.548-.034-.826.094-.39.332-.648.698-.812.236-.108.488-.16.746-.2.186-.028.374-.048.548-.1.198-.06.26-.164.268-.37V9.702c0-.04-.012-.32-.012-.32s-4.402.89-4.652.944a.366.366 0 0 0-.308.368v5.222c0 .22-.014.442-.03.662-.024.334-.1.648-.284.932-.282.426-.674.66-1.162.74-.292.048-.582.04-.86-.048-.376-.118-.64-.36-.78-.73-.1-.268-.1-.546-.032-.824.094-.39.332-.648.698-.812.236-.108.49-.162.746-.2.196-.03.394-.05.56-.104.192-.058.256-.162.264-.364V8.806c0-.082.012-.164.04-.242.048-.14.148-.23.292-.266.16-.042.324-.076.488-.108l3.176-.644c.556-.112 1.112-.226 1.668-.338.208-.042.418-.074.63-.064.186.01.256.092.264.282z"/></svg>`,
            },
        ],
    },
    {
        slug: "ghost-in-the-machine",
        title: "Ghost in the Machine",
        artist: "The Aleister",
        genre: "R&B",
        artwork: "/music/artwork/ghost-in-the-machine.jpg",
        audioSrc: "/music/audio/ghost-in-the-machine.mp3",
        status: "shipped",
        stores: [],
    },
];
