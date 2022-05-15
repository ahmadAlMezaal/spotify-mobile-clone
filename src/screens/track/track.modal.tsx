import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { themeStyles } from '@styles/globalColors';
import Modal from 'react-native-modal';
import { eventManager } from '@globals/injectors';
import { EventType } from '@types';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';

interface Props {
    track: any;
    albumCover?: any;
}

enum AudioStatus {
    Started = 'Started',
    Playing = 'Playing',
    Paused = 'Paused'
}

const { height: screenHeight } = Dimensions.get('screen');

export default function TrackScreen(props: Props): JSX.Element {

    const isMounted = useRef<boolean>(true);
    const soundRef = useRef<Audio.Sound>();

    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingStatus, setPlayingStatus] = useState<AudioStatus>(AudioStatus.Started);
    const [currentTrackValue, setCurrentTrackValue] = useState<number>(0);

    useEffect(
        () => {
            return () => {
                if (soundRef.current) {
                    soundRef.current.unloadAsync();
                }
                isMounted.current = false;
            };
        },
        []
    );

    function close(): void {
        if (isMounted.current) {
            soundRef.current?.unloadAsync();
            setIsVisible(false);
        }
        eventManager.dispatchEvent(EventType.ToggleFloatingTrack, { isVisible: true, track: props.track, albumCover: props?.albumCover });

        const timeout = 1000;
        setTimeout(() => eventManager.dispatchEvent(EventType.ToggleMusicTrack, { isVisible: false }), timeout);
    }

    function togglePlay(): void {
        setIsPlaying(!isPlaying);
        handleTrack();
    }

    function updateScreenForSoundStatus(status?: AudioStatus) {
        const isCurrentTrackPlaying = status === AudioStatus.Playing;
        if (isCurrentTrackPlaying && playingStatus !== AudioStatus.Playing) {
            setPlayingStatus(AudioStatus.Playing);
        } else {
            setPlayingStatus(AudioStatus.Paused);
        }
    }

    async function initTrack() {
        const { sound } = await Audio.Sound.createAsync(
            { uri: 'http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3' },
            {
                shouldPlay: true,
                isLooping: false
            },
            updateScreenForSoundStatus() as any
        );
        // const { durationMillis }: any = await sound.getStatusAsync();
        // const minutes = Math.floor(durationMillis / 60000);
        // const seconds = ((durationMillis % 60000) / 1000).toFixed(0);
        soundRef.current = sound;
        setPlayingStatus(AudioStatus.Playing);
    }

    async function handlePausePlayTrack() {
        if (soundRef.current != null) {
            if (playingStatus == AudioStatus.Playing) {
                await soundRef.current.pauseAsync();
                setPlayingStatus(AudioStatus.Paused);
            } else {
                await soundRef.current.playAsync();
                setPlayingStatus(AudioStatus.Playing);
            }
        }
    }

    function handleTrack(): void {
        switch (playingStatus) {
            case AudioStatus.Started:
                initTrack();
                break;
            case AudioStatus.Paused:
                handlePausePlayTrack();
                break;
            case AudioStatus.Playing:
                handlePausePlayTrack();
                break;
        }
    }

    const imageUri = props.albumCover ? props.albumCover[0].url : props.track?.images[0].url;

    const playIcon = isPlaying ? 'ios-pause-circle' : 'ios-play-circle';
    return <Modal
        style={[styles.modal, themeStyles.containerColorMain]}
        animationIn={'slideInUp'}
        isVisible={isVisible}
        swipeDirection='down'
        animationInTiming={300}
        animationOutTiming={300}
        onSwipeComplete={close}
        onBackButtonPress={close}
    >
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[styles.title, themeStyles.fontColorMain]}>Now Playing</Text>
                <TouchableOpacity
                    onPress={close}
                    activeOpacity={1}
                >
                    <AntDesign name="close" size={25} color={themeStyles.fontColorMain.color} />
                </TouchableOpacity>
            </View>
            <View style={styles.coverImageContainer}>
                <Image style={styles.coverImage} source={{ uri: imageUri }} />
            </View>

            <View style={styles.infoContainer}>
                <View>
                    <Text style={[styles.trackName, themeStyles.fontColorMain]}>{props.track?.name}</Text>
                    <Text style={[styles.artist, themeStyles.fontColorSub]}>{props.track?.artists[0].name}</Text>
                </View>
                <Ionicons name="heart-outline" size={30} color={themeStyles.fontColorMain.color} />
            </View>
            <Slider
                onValueChange={(value: number) => setCurrentTrackValue(value)}
                value={currentTrackValue}
                style={{ width: '100%', height: 10 }}
                minimumValue={0}
                maximumValue={2}
                thumbTintColor={themeStyles.fontColorMain.color}
                minimumTrackTintColor={themeStyles.spotifyPrimary.backgroundColor}
                maximumTrackTintColor={themeStyles.fontColorSub.color}
            />
            <View style={styles.controlsContainer}>
                <Ionicons name="md-refresh-outline" size={24} color={themeStyles.fontColorSub.color} />
                <MaterialCommunityIcons name="skip-previous" size={30} color={themeStyles.fontColorSub.color} />
                <TouchableOpacity activeOpacity={1} onPress={togglePlay}>
                    <Ionicons name={playIcon} size={80} color={themeStyles.spotifyPrimary.backgroundColor} />
                </TouchableOpacity>
                <MaterialCommunityIcons name="skip-next" size={30} color={themeStyles.fontColorSub.color} />
                <AntDesign name="sound" size={24} color={themeStyles.fontColorSub.color} />
            </View>
        </View>
    </Modal>;
}

const styles = StyleSheet.create(
    {
        modal: {
            flex: 1,
            margin: 0
        },
        container: {
            flex: 1,
            paddingTop: Constants.statusBarHeight,
            paddingBottom: 15,
            justifyContent: 'space-evenly'
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end'
        },
        title: {
            fontSize: 22,
            fontFamily: 'SemiBold',
            position: 'absolute',
            right: 0,
            left: 0,
            textAlign: 'center'

        },
        coverImageContainer: {
            width: '100%',
            alignItems: 'center',
            marginTop: 30
        },
        coverImage: {
            height: screenHeight * 0.42,
            aspectRatio: 1,
            borderRadius: 3,
        },
        infoContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 16
        },
        trackName: {
            fontSize: 25,
            fontFamily: 'SemiBold',
            marginBottom: 5
        },
        artist: {
            fontSize: 17,
            fontFamily: 'Regular',
        },
        // durationContainer: {
        //     flexDirection: 'row',
        //     justifyContent: 'space-between',
        //     marginHorizontal: 16,
        //     paddingTop: 5
        // },
        // duration: {
        //     alignSelf: 'flex-end',
        // },
        controlsContainer: {
            flexDirection: 'row',
            marginHorizontal: 16,
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    }
);
