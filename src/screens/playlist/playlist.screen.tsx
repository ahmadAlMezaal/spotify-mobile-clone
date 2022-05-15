import React from 'react';
import { Text, StyleSheet, View, ScrollView, ImageBackground, Dimensions, TouchableOpacity, Image } from 'react-native';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { themeStyles } from '@styles/globalColors';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { globalStyles } from '@styles/globalStyles';
import { Album, EventType } from '@types';
import { RouteProp } from '@react-navigation/core';
import { spotifyApi } from '@services/api/spotifyApi';
import { formatTrackDuration } from '@services/helpers/formatFollowers';
import SpotifyLoader from '@components/spotifyLoader.component';
import { eventManager } from '@globals/injectors';

type RouteParams = {
    Album: {
        album: Album
    }
}

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
    route: RouteProp<RouteParams, 'Album'>
}

interface State {
    isLoading: boolean,
    album: Album[];
}

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

export default class PlayListScreen extends React.PureComponent<Props, State> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            album: []
        };

        this.openTrack = this.openTrack.bind(this);
        this.init = this.init.bind(this);

        this.init();
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private async init(): Promise<void> {
        try {
            const id = this.props.route.params.album.id;
            const response = await spotifyApi.getPlaylistTracks(id, (this.props.route.params.album as any).tracks?.total);
            if (this._isMounted) {
                this.setState({ album: (response.data as any).items });
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        } finally {
            if (this._isMounted) {
                this.setState({ isLoading: false });
            }
        }
    }

    private openTrack(track: Album): void {
        eventManager.dispatchEvent(EventType.ToggleMusicTrack, { isVisible: true, navigation: this.props.navigation, track: (track as any).track?.album });
    }

    render(): JSX.Element {

        return <>
            {this.state.isLoading && <SpotifyLoader />}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 10 }}
                style={themeStyles.containerColorMain}
            >
                <View style={[styles.container, themeStyles.containerColorMain]}>
                    <ImageBackground style={styles.backgroundImage} source={{ uri: this.props.route.params.album.images[0]?.url as string }} >
                        <View style={styles.overlay}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                                activeOpacity={1}
                            >
                                <MaterialIcons name="keyboard-arrow-left" size={32} color={themeStyles.fontColorMain.color} />
                            </TouchableOpacity>
                            <View style={{ paddingHorizontal: 16 }}>
                                <Text style={[themeStyles.fontColorMain, styles.strongLabel, { fontSize: 25 }]}>{this.props.route.params.album.name}</Text>
                                <Text style={[themeStyles.fontColorMain, styles.lightLabel]}>
                                    <Text style={[themeStyles.fontColorMain, styles.strongLabel]}>{(this.props.route.params.album as any).tracks?.total} </Text>
                                    Tracks
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={[styles.row, styles.bottomContainer, globalStyles.containerPadding]}>
                        <TouchableOpacity activeOpacity={1} style={[styles.button, themeStyles.spotifyPrimary]} >
                            <Text style={[themeStyles.fontColorMain, styles.buttonText]}>SHUFFLE PLAY</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} style={[styles.button, { backgroundColor: themeStyles.placeHolderFontColor.color }]} >
                            <Text style={[themeStyles.fontColorMain, styles.buttonText]}>LIKE</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.album.map(
                            (item: Album, index: number) =>
                                <TouchableOpacity
                                    onPress={() => this.openTrack(item)}
                                    activeOpacity={1}
                                    key={index.toString()}
                                    style={[styles.row, styles.cardContainer]}
                                >
                                    <View style={styles.row}>
                                        <Image style={styles.cardCoverImage} source={{ uri: (item.track as any).album.images[2]?.url as string }} />
                                        <View style={{ width: '80%' }}>
                                            <Text numberOfLines={1} style={[styles.title, themeStyles.fontColorMain]}>{item.track?.name}</Text>
                                            <View style={styles.row}>
                                                <Text style={[styles.name, themeStyles.fontColorSub]}>{(item.track as any).album.artists[0].name} • </Text>
                                                <Text style={themeStyles.fontColorSub}>{formatTrackDuration((item.track as any).duration_ms)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Feather name="more-vertical" size={22} color={themeStyles.fontColorSub.color} />
                                </TouchableOpacity>
                        )
                    }
                </View>
            </ScrollView>
        </>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        },
        backgroundImage: {
            width: screenWidth,
            height: screenHeight / 2,
            aspectRatio: 1
        },
        overlay: {
            height: '100%',
            width: screenWidth,
            backgroundColor: 'rgba(0,0,0,0.4)',
            paddingTop: Constants.statusBarHeight,
            justifyContent: 'space-between',
            paddingBottom: 10
        },
        bottomContainer: {
            justifyContent: 'space-between'
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        strongLabel: {
            fontSize: 17,
            fontFamily: 'SemiBold'
        },
        lightLabel: {
            fontSize: 18,
            fontFamily: 'Regular'
        },
        cardContainer: {
            paddingHorizontal: 16,
            justifyContent: 'space-between',
            marginVertical: 12
        },
        cardCoverImage: {
            width: 50,
            height: 50,
            marginRight: 10
        },
        title: {
            fontSize: 18,
            fontFamily: 'Regular',
            paddingBottom: 3
        },
        name: {
            fontSize: 15,
            fontFamily: 'Regular',
        },
        button: {
            width: '46%',
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50
        },
        buttonText: {
            fontSize: 15,
            fontFamily: 'SemiBold',
            includeFontPadding: false
        }
    }
);
