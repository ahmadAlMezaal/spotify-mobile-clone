import { themeStyles } from '@styles/globalColors';
import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Notification } from '@types';

interface Props {
    notification: Notification
}

export default class NotificationCardComponent extends React.PureComponent<Props> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    render(): JSX.Element {
        return <TouchableOpacity activeOpacity={1} style={styles.container}>
            <View style={styles.row}>
                <Image style={styles.image} source={{ uri: this.props.notification.imageUrl }} />
                <View style={[styles.row, styles.desc]}>
                    <Text style={[styles.name, themeStyles.fontColorMain]}>{this.props.notification.name} </Text>
                    <Text numberOfLines={1} style={[styles.description, themeStyles.fontColorMain]}>{this.props.notification.description}</Text>
                </View>
            </View>
            <Text style={[themeStyles.fontColorSub, styles.date]}>{this.props.notification.date}</Text>
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: themeStyles.disabledButton.backgroundColor,
            marginVertical: 10,
            padding: 10,
            borderRadius: 5,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        image: {
            width: 50,
            height: 50,
            borderRadius: 251
        },
        name: {
            fontFamily: 'SemiBold',
            fontSize: 17
        },
        description: {
            fontFamily: 'Regular',
            fontSize: 15
        },
        date: {
            fontFamily: 'Regular',
            fontSize: 13
        },
        desc: {
            width: '60%',
            marginLeft: 10,
            flexWrap: 'wrap'
        }
    }
);
