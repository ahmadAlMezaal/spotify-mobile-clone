import React from 'react';
import { Text, StyleSheet, View, ImageBackground, Dimensions, TouchableOpacity, FlatList, ScrollView, Image, Share } from 'react-native';
import { RouteProp } from '@react-navigation/core';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { themeStyles } from '@styles/globalColors';
import { MaterialIcons, EvilIcons, Feather } from '@expo/vector-icons';
import { Album, Artist, EventType } from '@types';
import Constants from 'expo-constants';
import { formatFollowers } from '@services/helpers/formatFollowers';
import { spotifyApi } from '@services/api/spotifyApi';
import SpotifyLoader from '@components/spotifyLoader.component';
import { globalStyles } from '@styles/globalStyles';
import AlbumCardComponent from '@screens/home/albumCard.component';
import TrackCardComponent from './trackCard.component';
import { eventManager } from '@globals/injectors';

type RouteParams = {
    Artist: {
        artist: Artist
    }
};

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
    route: RouteProp<RouteParams, 'Artist'>
}

interface State {
    isLoading: boolean;
    relatedArtists: Artist[],
    albums: Album[];
    topTracks: Album[];
}

const { height: screenHeight } = Dimensions.get('screen');

export default class ArtistScreen extends React.PureComponent<Props, State> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            albums: [],
            relatedArtists: [],
            topTracks: []
        };

        this.goToArtist = this.goToArtist.bind(this);
        this.openTrack = this.openTrack.bind(this);
        this.init = this.init.bind(this);

        this.init(this.props.route.params.artist.id);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private async init(id: string): Promise<void> {
        try {
            const responses = await Promise.all(
                [
                    spotifyApi.getArtistAlbum(id, 10),
                    spotifyApi.getRelatedArtists(id, 10),
                    spotifyApi.getArtistTopTracks(id, 'LB')
                ]
            );

            if (this._isMounted) {
                this.setState(
                    {
                        albums: (responses[0].data as any).items,
                        relatedArtists: (responses[1].data as any).artists,
                        topTracks: (responses[2].data as any).tracks
                    }
                );
            }

        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
        finally {
            if (this._isMounted) {
                this.setState({ isLoading: false });
            }
        }
    }

    private goToArtist(artist: Artist): void {
        this.props.navigation.push(
            'Artist',
            {
                key: `${artist.id}_${artist.name}`,
                artist
            }
        );
    }

    private async onShare(): Promise<void> {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            alert(error.message);
        }
    }

    private openTrack(track: Album): void {
        eventManager.dispatchEvent(EventType.ToggleMusicTrack, { isVisible: true, navigation: this.props.navigation, track: (track as any)?.album });
    }

    render(): JSX.Element {

        const artist = this.props.route.params.artist;

        const keyExtractor = (item: Album, index: number): string => `${item.name}_${index.toString()}`;
        const renderItem = (item: Album) => <AlbumCardComponent
            navigation={this.props.navigation}
            album={item}
        />;

        const renderTopTracks = (item: Album, index: number) => <TrackCardComponent
            onPress={() => this.openTrack(item)}
            key={`${item.name}_${index.toString()}`}
            navigation={this.props.navigation}
            album={item}
        />;

        const relatedArtistsKeyExtractor = (item: Artist, index: number): string => `${item.name}_${index.toString()}`;
        const renderRelatedArtists = (item: Artist) => <TouchableOpacity
            onPress={() => this.goToArtist(item)}
            style={styles.relatedArtistContainer}
            activeOpacity={1}
        >
            <Image style={styles.relatedArtistProfile} source={{ uri: item.images[0]?.url as string }} />
            <Text style={[styles.artistName, themeStyles.fontColorMain]}>{item.name}</Text>
        </TouchableOpacity>;

        return <ScrollView
            contentContainerStyle={{ paddingBottom: 10 }}
            style={themeStyles.containerColorMain}>
            <View style={[styles.container, themeStyles.containerColorMain]}>
                {this.state.isLoading && <SpotifyLoader />}
                <ImageBackground style={styles.artistCoverImage} source={{ uri: this.props.route.params.artist.images[0]?.url as string }}>
                    <View style={styles.overlay}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                                activeOpacity={1}
                            >
                                <MaterialIcons name="keyboard-arrow-left" size={32} color={themeStyles.fontColorMain.color} />
                            </TouchableOpacity>

                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={this.onShare}
                                    activeOpacity={1}
                                >
                                    <EvilIcons name="share-google" size={30} color={themeStyles.fontColorSub.color} />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={1} >
                                    <Feather name="more-vertical" size={24} color={themeStyles.fontColorSub.color} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={[themeStyles.fontColorMain, styles.name]}>{artist.name}</Text>
                            <View style={styles.row}>
                                <View style={styles.row}>
                                    <Text style={[styles.strongLabel, themeStyles.fontColorMain]}>{formatFollowers(parseInt(artist.followers.total))}</Text>
                                    <Text style={[styles.lightLabel, themeStyles.fontColorMain]}> Followers</Text>
                                </View>
                                <View style={[styles.row, { marginLeft: 10 }]}>
                                    <Text style={[styles.strongLabel, themeStyles.fontColorMain]}>{artist.popularity}%</Text>
                                    <Text style={[styles.lightLabel, themeStyles.fontColorMain]}> popular on Spotify</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.section}>
                    <Text style={[styles.title, themeStyles.fontColorMain]}>Top tracks</Text>
                    <View style={styles.flatListStyle}>
                        {this.state.topTracks.map(renderTopTracks)}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.title, themeStyles.fontColorMain]}>Top rated albums</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.flatListStyle}
                        data={this.state.albums}
                        style={{ flexGrow: 0 }}
                        keyExtractor={keyExtractor}
                        renderItem={({ item }) => renderItem(item)}
                    />
                </View>
                <View style={styles.section}>
                    <Text style={[styles.title, themeStyles.fontColorMain]}>Related Artists</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.flatListStyle}
                        data={this.state.relatedArtists}
                        style={{ flexGrow: 0 }}
                        keyExtractor={relatedArtistsKeyExtractor}
                        renderItem={({ item }) => renderRelatedArtists(item)}
                    />
                </View>
            </View>
        </ScrollView>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        },
        artistCoverImage: {
            width: '100%',
            height: screenHeight / 2,
        },
        flatListStyle: {
            minHeight: 150,
            paddingHorizontal: globalStyles.containerPadding.padding
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        overlay: {
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            paddingTop: Constants.statusBarHeight,
            paddingHorizontal: 16,
            justifyContent: 'space-between',
            paddingBottom: 10
        },
        title: {
            fontSize: 28,
            fontFamily: 'SemiBold',
            paddingLeft: 16,
            paddingBottom: 8
        },
        name: {
            fontSize: 35,
            fontFamily: 'SemiBold'
        },
        section: {
            paddingTop: 16,
        },
        strongLabel: {
            fontSize: 17,
            fontFamily: 'SemiBold'
        },
        lightLabel: {
            fontSize: 17,
            fontFamily: 'Regular'
        },
        relatedArtistContainer: {
            width: 100,
            marginHorizontal: 15
        },
        relatedArtistProfile: {
            width: 100,
            height: 100,
            aspectRatio: 1,
            borderRadius: 50,
            marginBottom: 10
        },
        artistName: {
            fontSize: 16,
            fontFamily: 'SemiBold',
            textAlign: 'center'
        }
    }
);
