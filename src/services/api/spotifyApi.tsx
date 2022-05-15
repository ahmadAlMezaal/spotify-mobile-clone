import api from './api';

const getFeaturedPlaylists = (limit: number, country: string) => {
    const route = `/browse/featured-playlists?limit=${limit}&country=${country}`;
    return api.get(route);
};

const getPlaylistTracks = (playlist_id: string, limit: number) => {
    const route = `playlists/${playlist_id}/tracks?limit=${limit}`;
    return api.get(route);
};

const getSeveralTracks = () => {
    const route = '/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B';
    return api.get(route);
};

const getNewReleases = (limit: number) => {
    const route = `/browse/new-releases?limit=${limit}`;
    return api.get(route);
};

const getMultipleArtists = () => {
    const route = '/artists?ids=0EmeFodog0BfCgMzAIvKQp,5pKCCKE2ajJHZ9KAiaK11H,5Y5TRrQiqgUO4S36tzjIRZ,64M6ah0SkkRsnPGtGiRAbb,4S9EykWXhStSc15wEx8QFK,4dpARuHxo51G3z768sgnrY,0C8ZW7ezQVs4URX5aX7Kqx,7dGJo4pcD2V6oG8kP0tJRR';
    return api.get(route);
};

const searchArtist = (query: string, limit: number) => {
    const route = `/search?q=${query}&limit=${limit}&type=artist`;
    return api.get(route);
};

const getArtistAlbum = (id: string, limit: number) => {
    const route = `artists/${id}/albums?limit=${limit}`;
    return api.get(route);
};

const getAlbumTracks = (id: string, limit: number) => {
    const route = `/albums/${id}/tracks?limit=${limit}`;
    return api.get(route);
};

const getRelatedArtists = (id: string, limit: number) => {
    const route = `/artists/${id}/related-artists?limit=${limit}`;
    return api.get(route);
};

const getArtistTopTracks = (id: string, market: string) => {
    const route = `artists/${id}/top-tracks?market=${market}`;
    return api.get(route);
};

export const spotifyApi = {
    getFeaturedPlaylists,
    getSeveralTracks,
    getNewReleases,
    searchArtist,
    getMultipleArtists,
    getArtistAlbum,
    getRelatedArtists,
    getArtistTopTracks,
    getPlaylistTracks,
    getAlbumTracks
};
