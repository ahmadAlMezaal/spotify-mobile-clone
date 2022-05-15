import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { eventManager } from '@globals/injectors';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { themeStyles } from '@styles/globalColors';
import { EventType } from '@types';

interface Props {
    track: any;
    navigation: StackNavigationProp<ParamListBase>;
    isNewRelease?: boolean;
}

export default class SongCardComponent extends React.PureComponent<Props> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.openTrack = this.openTrack.bind(this);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private openTrack(): void {
        const track = this.props.isNewRelease ? this.props.track : this.props.track.track.album;
        eventManager.dispatchEvent(
            EventType.ToggleMusicTrack,
            {
                isVisible: true,
                navigation: this.props.navigation,
                track
            }
        );
    }

    render(): JSX.Element {

        const name = this.props.isNewRelease ?
            this.props.track.name :
            this.props.track.track?.album.name;

        const uri = this.props.isNewRelease ?
            this.props.track.images[1]?.url as string :
            this.props.track.track.album.images[1]?.url as string;

        return <TouchableOpacity
            onPress={this.openTrack}
            activeOpacity={1}
            style={styles.container}
        >
            <Image style={styles.artistProfileImage} source={{ uri }} />
            <View style={styles.boxColumn}>
                <Text numberOfLines={2} style={[styles.title, themeStyles.fontColorSub]}>{name}</Text>
            </View>
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            marginRight: 25,
            width: 120,
            height: 170,
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
    }
);
