import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LoginStackNavigator from './src/navigation/loginStackNavigator';
import * as Font from 'expo-font';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import TrackScreen from '@screens/track/track.modal';
import { EventType, ToggleMusicTrackEvent, ToggleFloatingTrackEvent } from '@types';
import { eventManager } from '@globals/injectors';
import { NavigationProp } from '@react-navigation/core';
import { ParamListBase } from '@react-navigation/routers';
import FloatedTrackPlayerComponent from '@components/floatedTrackPlayer.component';
import * as SplashScreen from 'expo-splash-screen';

AuthSession.makeRedirectUri({ path: '/' });

export default function App() {

    const [appIsReady, setAppIsReady] = useState(false);
    const [initialRoute, setInitialRoute] = useState('Welcome');
    const [isTrackShown, setIsTrackShown] = useState<boolean>(false);
    const [navigation, setNavigation] = useState<NavigationProp<ParamListBase>>();
    const [albumCover, setAlbumCover] = useState<{ [key: string]: string; }>();
    const [track, setTrack] = useState<any>();
    const [floatingTrack, setFloatingTrack] = useState<any>();
    const [isFloatedTrackShown, setIsFloatedTrackShown] = useState<boolean>(false);
    const [floatingAlbumCover, setFloatingAlbumCover] = useState<{ [key: string]: string; }>();

    const isMounted = useRef<boolean>(true);

    useEffect(
        () => {
            initApp();
            const unsubscribeFloatedTrack = eventManager.addEventListener(
                EventType.ToggleFloatingTrack,
                (event: ToggleFloatingTrackEvent) => {
                    if (isMounted) {
                        setIsFloatedTrackShown(event.isVisible);
                        setFloatingTrack(event.track);
                        setFloatingAlbumCover(event.albumCover);
                    }
                }
            );

            const unsubscribeMusicTrack = eventManager.addEventListener(
                EventType.ToggleMusicTrack,
                (event: ToggleMusicTrackEvent) => {
                    if (isMounted) {
                        setNavigation(event.navigation);
                        setIsTrackShown(event.isVisible);
                        setTrack(event.track);
                        setAlbumCover(event.albumCover);
                    }
                }
            );

            const unsubscribeKeyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardEvent);
            const unsubscribeKeyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardEvent);

            return () => {
                unsubscribeKeyboardDidShowListener.remove();
                unsubscribeKeyboardDidHideListener.remove();
                unsubscribeFloatedTrack();
                unsubscribeMusicTrack();
                isMounted.current = false;
            };
        }
    );

    async function initApp() {
        try {
            await SplashScreen.preventAutoHideAsync();
            await fetchFonts();
            const token = await SecureStore.getItemAsync('access_token').catch(() => { });
            if (token) {
                setInitialRoute('BottomTabNavigator');
            }
        } catch {
        } finally {
            setTimeout(() => setAppIsReady(true), 500);
        }

    }
    function handleKeyboardEvent(event: any): void {
        const { height } = event;
        if (height > 0) {
            return setIsFloatedTrackShown(false);
        }
    }

    function fetchFonts() {
        return Font.loadAsync(
            {
                'Heavy': require('./assets/fonts/SF-Heavy.otf'),
                'Light': require('./assets/fonts/SF-Light.ttf'),
                'Medium': require('./assets/fonts/SF-Medium.otf'),
                'Regular': require('./assets/fonts/SF-Regular.otf'),
                'SemiBold': require('./assets/fonts/SF-Semibold.otf'),
            }
        );
    }

    const onLayoutRootView = useCallback(
        async () => {
            if (appIsReady) {
                await SplashScreen.hideAsync();
            }
        },
        [appIsReady]
    );

    if (!appIsReady) {
        return null;
    }

    return <View onLayout={onLayoutRootView} style={styles.container}>
        <StatusBar backgroundColor='white' />
        <LoginStackNavigator initialRoute={initialRoute} />
        {
            isTrackShown && <TrackScreen
                track={track}
                albumCover={albumCover}
            />
        }

        {isFloatedTrackShown && <FloatedTrackPlayerComponent albumCover={floatingAlbumCover} track={floatingTrack} navigation={navigation as any} />}
    </View>;
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        },
    }
);
