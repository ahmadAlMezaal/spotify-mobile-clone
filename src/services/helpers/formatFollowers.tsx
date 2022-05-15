export const formatFollowers = (followers: number): string => {
    const tier = Math.log10(Math.abs(followers)) / 3 | 0;

    if (tier <= 0) {
        followers.toString();
    }

    const suffix = 'k';
    const scale = Math.pow(10, tier * 3);
    const scaled = followers / scale;
    return scaled.toFixed(1) + suffix;
};

export const formatTrackDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${(parseInt(seconds) < 10 ? '0' : '')}${seconds}`;
}