import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Album } from '@types';
import { themeStyles } from '@styles/globalColors';

interface Props {
    album: Album;
    navigation: StackNavigationProp<ParamListBase>;
}
export default class AlbumCardComponent extends React.PureComponent<Props> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.goToAlbum = this.goToAlbum.bind(this);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private goToAlbum(album: Album): void {
        this.props.navigation.push(
            'Album',
            {
                album
            }
        );
    }

    render(): JSX.Element {

        const album = this.props.album;
        return <TouchableOpacity onPress={() => this.goToAlbum(album)} activeOpacity={1} style={styles.container}>
            <Image style={styles.artistProfileImage} source={{ uri: album.images[0]?.url as string }} />
            <View style={styles.boxColumn}>
                <Text numberOfLines={2} style={[styles.title, themeStyles.fontColorMain]}>{album.name}</Text>
                <Text style={[styles.releaseDate, themeStyles.fontColorSub]}>{album.release_date}</Text>
            </View>
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            paddingVertical: 8,
            marginRight: 25,
            width: 120,
            height: 190,
        },
        artistProfileImage: {
            width: 120,
            height: 120,
            aspectRatio: 1,
            borderRadius: 4,
            marginBottom: 6
        },
        boxColumn: {
            height: '100%',
        },
        title: {
            fontSize: 14,
            includeFontPadding: false,
            fontFamily: 'SemiBold'
        },
        releaseDate: {
            fontSize: 13,
            paddingTop: 2,
            includeFontPadding: false,
            fontFamily: 'Regular'
        }
    }
);
