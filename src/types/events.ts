import { NavigationProp } from '@react-navigation/core';

export enum EventType {
    ToggleMusicTrack = 1,
    ToggleFloatingTrack = 2,
}

export interface ToggleMusicTrackEvent {
    isVisible: boolean;
    navigation: NavigationProp<any>;
    track: any;
    albumCover?: { [key: string]: string; }
}

export interface ToggleFloatingTrackEvent {
    isVisible: boolean;
    track: any;
    albumCover?: { [key: string]: string; }
}
