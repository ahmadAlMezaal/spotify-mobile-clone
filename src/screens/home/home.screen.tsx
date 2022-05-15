import React from 'react';
import { Text, StyleSheet, View, FlatList, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { themeStyles } from '@styles/globalColors';
import { globalStyles } from '@styles/globalStyles';
import { Album } from '@types';
import SongCardComponent from './songCard.component';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/routers';
import { spotifyApi } from '@services/api/spotifyApi';
import SpotifyLoader from '@components/spotifyLoader.component';
import * as SecureStore from 'expo-secure-store';
import { handleRefreshToken } from '@services/getAuthorizationCode';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
}

interface State {
    isLoading: boolean;
    albums: Album[];
    popularTracks: Album[];
    trending: Album[];
    newRelease: Album[];
    tracks: any;
}

const { width: screenWidth } = Dimensions.get('screen');

export default class HomeScreen extends React.PureComponent<Props, State> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            albums: [],
            tracks: [],
            popularTracks: [],
            trending: [],
            newRelease: []
        };

        this.goToAlbum = this.goToAlbum.bind(this);
        this.init = this.init.bind(this);

        this.init();
    }

    async componentDidMount(): Promise<void> {
        this._isMounted = true;
        const tokenExpirationTime = await SecureStore.getItemAsync('expirationTime').catch(() => { });
        if (!tokenExpirationTime || new Date().getTime() > parseInt(tokenExpirationTime)) {
            await handleRefreshToken();
        }
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private async init(): Promise<void> {
        const offset = 10;
        try {
            const responses = await Promise.all(
                [
                    spotifyApi.getFeaturedPlaylists(6, 'LB'),
                    spotifyApi.getPlaylistTracks('3cEYpjA9oz9GiPac4AsH4n', offset),
                    spotifyApi.getPlaylistTracks('37i9dQZF1DXe3aCmUoBd8n', offset),
                    spotifyApi.getNewReleases(offset),
                ]
            );
            if (this._isMounted) {
                this.setState(
                    {
                        albums: (responses[0].data as any).playlists.items,
                        popularTracks: (responses[1].data as any).items,
                        trending: (responses[2].data as any).items,
                        newRelease: (responses[3].data as any).albums.items
                    }
                );
            }
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.log(error.response.data);

        } finally {
            if (this._isMounted) {
                this.setState({ isLoading: false });
            }
        }
    }

    private goToAlbum(album: Album): void {
        this.props.navigation.push(
            'Playlist',
            {
                album
            }
        );
    }

    render(): JSX.Element {

        const keyExtractor = (item: Album, index: number): string => `${item.toString()}_${index.toString()}`;
        const renderItem = (item: Album) => <SongCardComponent
            navigation={this.props.navigation}
            track={item}
        />;

        const newReleaseKeyExtractor = (item: Album, index: number): string => `${item.toString()}_${index.toString()}`;
        const renderNewRelease = (item: Album) => <SongCardComponent
            isNewRelease={true}
            navigation={this.props.navigation}
            track={item}
        />;

        return <>
            {this.state.isLoading && <SpotifyLoader />}
            <ScrollView style={themeStyles.containerColorMain}>
                <View style={[styles.container, themeStyles.containerColorMain]}>
                    <View style={[styles.section, this.state.isLoading && { height: screenWidth / 1.5 }]}>
                        <Text style={[styles.title, themeStyles.fontColorMain]}>Featured playlists in Lebanon</Text>
                        <View style={styles.albumsContainer}>
                            {
                                this.state.albums.map(
                                    (item: any, index: number) => <TouchableOpacity
                                        style={index % 2 === 0 && { marginRight: 25, }}
                                        activeOpacity={1}
                                        key={index}
                                        onPress={() => this.goToAlbum(item)}
                                    >
                                        <Image source={{ uri: item.images[0].url }} style={styles.coverImage} />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.title, themeStyles.fontColorMain]}>Most popular songs for you</Text>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: globalStyles.containerPadding.padding }}
                            data={this.state.popularTracks}
                            style={{ flexGrow: 0 }}
                            keyExtractor={keyExtractor}
                            renderItem={({ item }) => renderItem(item)}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.title, themeStyles.fontColorMain]}>Trending tracks</Text>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: globalStyles.containerPadding.padding }}
                            data={this.state.trending}
                            style={{ flexGrow: 0 }}
                            keyExtractor={keyExtractor}
                            renderItem={({ item }) => renderItem(item)}
                        />
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.title, themeStyles.fontColorMain]}>New Release</Text>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: globalStyles.containerPadding.padding }}
                            data={this.state.newRelease}
                            style={{ flexGrow: 0 }}
                            keyExtractor={newReleaseKeyExtractor}
                            renderItem={({ item }) => renderNewRelease(item)}
                        />
                    </View>
                </View>
            </ScrollView>
        </>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        },
        title: {
            fontSize: 28,
            fontFamily: 'SemiBold',
            paddingHorizontal: 16,
            paddingBottom: 8
        },
        section: {
            // marginTop: 10
        },
        albumsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        coverImage: {
            width: screenWidth / 2.4,
            aspectRatio: 1,
            marginVertical: 10,
            borderRadius: 2
        }
    }
);
