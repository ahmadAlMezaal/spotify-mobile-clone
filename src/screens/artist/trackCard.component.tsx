import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { themeStyles } from '@styles/globalColors';
import { Feather } from '@expo/vector-icons';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
    album: any;
    onPress: () => void;
}

export default class TrackCardComponent extends React.Component<Props> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.onPress = this.onPress.bind(this);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private onPress(): void {
        this.props.onPress();
    }

    render(): JSX.Element {

        const album = this.props.album;

        return <TouchableOpacity
            activeOpacity={1}
            onPress={this.onPress}
            style={[styles.row, styles.cardContainer]}
        >
            <View style={styles.row}>
                <Image style={styles.cardCoverImage} source={{ uri: album.album.images[2]?.url as string }} />
                <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={[styles.title, themeStyles.fontColorMain]}>{album.album.name}</Text>
                    <Text style={[styles.name, themeStyles.fontColorSub]}>{album.album.artists[0].name}</Text>
                </View>
            </View>
            <Feather name="more-vertical" size={22} color={themeStyles.fontColorSub.color} />
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create(
    {
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        cardContainer: {
            justifyContent: 'space-between',
            marginVertical: 12
        },
        cardCoverImage: {
            width: 50,
            height: 50,
            marginRight: 10,
            borderRadius: 2
        },
        textContainer: {
            width: '80%'
        },
        title: {
            fontSize: 16,
            fontFamily: 'SemiBold',
            paddingBottom: 5
        },
        name: {
            fontSize: 15,
            fontFamily: 'Regular'
        }
    }
);
