import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { spotifyApi } from '@services/api/spotifyApi';
import { themeStyles } from '@styles/globalColors';
import { Artist } from '@types';
import { Feather } from '@expo/vector-icons';
import { formatFollowers } from '@services/helpers/formatFollowers';
import SpotifyLoader from '@components/spotifyLoader.component';
import { navigatorGlobals } from '@globals/navigationGlobals';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
}

interface State {
    isLoading: boolean,
    query: string;
    artists: Artist[]
}

export default class SearchScreen extends React.PureComponent<Props, State> {

    private _isMounted = false;

    private _focusSubscription: () => void;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            query: '',
            artists: []
        };

        this.goToArtist = this.goToArtist.bind(this);
        this.init = this.init.bind(this);

        this.init();

        this._focusSubscription = this.props.navigation.addListener(
            'focus',
            () => this.handleQuery()
        );

    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
        this._focusSubscription();
    }

    private async init(): Promise<void> {
        try {
            const response = await spotifyApi.getMultipleArtists();
            if (this._isMounted) {
                this.setState({ artists: (response.data as any).artists });
            }
        } catch {

        } finally {
            if (this._isMounted) {
                this.setState({ isLoading: false });
            }
        }
    }

    private handleQuery() {
        navigatorGlobals.searchResults = async (query: string) => {
            if (query === '') {
                this.init();
            }
            if (this._isMounted) {
                this.setState({ query, });
            }
            try {
                const response = await spotifyApi.searchArtist(query, 10);

                if (this._isMounted) {
                    this.setState({ artists: (response.data as any).artists.items });
                }
            } catch { }
        };
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

    render(): JSX.Element {

        const keyExtractor = (item: Artist, index: number): string => `${item.id}_${index.toString()}`;
        const renderItem = ({ item }: { item: Artist }) => <TouchableOpacity
            activeOpacity={1}
            style={[styles.row, styles.cardContainer]}
            onPress={() => this.goToArtist(item)}
        >
            <View style={styles.row}>
                <Image
                    source={{ uri: item.images[0]?.url as string }}
                    style={styles.image}
                />
                <View>
                    <Text style={[styles.name, themeStyles.fontColorMain]}>{item.name}</Text>
                    <View style={styles.row}>
                        <Text style={[styles.type, themeStyles.fontColorSub]}>{item.type} • </Text>
                        <Text style={[styles.label, themeStyles.fontColorSub]}>{formatFollowers(parseInt(item.followers.total))} followers</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity activeOpacity={1}>
                <Feather name="more-vertical" size={22} color={themeStyles.fontColorSub.color} />
            </TouchableOpacity>
        </TouchableOpacity>;

        const renderEmptyList = () => <Text style={[styles.name, styles.emptyListText, themeStyles.fontColorMain]}>Artist not found</Text>;

        return <View style={[styles.container, themeStyles.containerColorMain]}>
            {
                this.state.isLoading && <SpotifyLoader />
            }
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.artists}
                contentContainerStyle={styles.flatList}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyList}
            />
        </View>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        },
        flatList: {
            paddingHorizontal: 16,
            paddingVertical: 10
        },
        cardContainer: {
            paddingVertical: 12,
            justifyContent: 'space-between',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        image: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 10
        },
        name: {
            fontFamily: 'SemiBold',
            fontSize: 16,
        },
        type: {
            fontFamily: 'SemiBold',
            fontSize: 13
        },
        label: {
            fontFamily: 'Regular',
            fontSize: 13
        },
        emptyListText: {
            marginTop: '10%',
            textAlign: 'center',
            fontSize: 18,
        }
    }
);
