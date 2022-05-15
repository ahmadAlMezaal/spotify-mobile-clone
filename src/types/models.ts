export interface Artist {
    artist: string;
    followersCount: number;
}

export interface Thumbnail {
    title: string;
    coverImageUri: any;
}

export interface Artist {
    external_urls: { [key: string]: string; };
    followers: { [key: string]: string; };
    genres: string[];
    href: string;
    id: string;
    images: [{ [key: string]: string | number; }],
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export interface Album {
    available_markets?: string[];
    added_at?: string;
    added_by?: any;
    is_local?: boolean;
    primary_color?: string | null;
    track?: { [key: string]: Artist; };
    album_group: string;
    album_type: string;
    artists: Artist[];
    external_urls: { [key: string]: string; };
    href: string;
    id: string;
    images: [{ [key: string]: string | number; }],
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number,
    type: string,
    uri: string;
}

export interface Notification {
    imageUrl: string;
    name: string;
    description: string;
    date: string;
}
