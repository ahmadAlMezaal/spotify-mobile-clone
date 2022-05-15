import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeStyles } from '@styles/globalColors';
import { eventManager } from '@globals/injectors';
import { EventType } from '@types';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
    track: any;
    albumCover?: any
}

const { width: screenWidth } = Dimensions.get('screen');

export default function FloatedTrackPlayerComponent({ navigation, track, albumCover }: Props) {

    const [isPlaying, setIsPlaying] = useState(false);

    function togglePlay(): void {
        setIsPlaying(!isPlaying);
    }

    function toggleTrack(): void {
        eventManager.dispatchEvent(EventType.ToggleMusicTrack, { isVisible: true, navigation, track });
    }

    const playIcon = isPlaying ? 'ios-pause-circle' : 'ios-play-circle';
    const uri = albumCover ? albumCover[0].url : track?.images[0].url;

    return <TouchableOpacity onPress={toggleTrack} activeOpacity={1} style={[styles.container, themeStyles.containerColorMain]}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
                <Image style={styles.trackImage} source={{ uri }} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.artist}>{track?.artists[0].name}</Text>
                    <Text style={styles.song}>{track?.name}</Text>
                </View>
            </View>

            <TouchableOpacity activeOpacity={1} onPress={togglePlay}>
                <Ionicons name={playIcon} size={35} color={themeStyles.spotifyPrimary.backgroundColor} />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>;
}

const styles = StyleSheet.create(
    {
        container: {
            position: 'absolute',
            bottom: 63,
            width: screenWidth,
            height: 70,
            paddingRight: 16,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        detailsContainer: {
            marginLeft: 10,
        },
        artist: {
            fontWeight: 'bold',
            fontFamily: 'SemiBold',
            color: 'white',
        },
        song: {
            fontFamily: 'Medium',
            color: 'white',
            marginTop: 5,
        },
        trackImage: {
            height: 70,
            width: 70,
        }
    }
);
