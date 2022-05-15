import { settingsGlobals } from '@globals/settingsGlobals';
import { themeStyles } from '@styles/globalColors';
import React from 'react';
import { Text, StyleSheet, StyleProp, View, ViewStyle, TouchableOpacity, ActivityIndicator, Dimensions, TextStyle } from 'react-native';

interface Props {
    title: string;
    onPress: () => void;
    styles?: StyleProp<ViewStyle>;
    disabled?: boolean;
    isLoading?: boolean;
    icon?: JSX.Element;
    background?: string;
    titleStyle?: StyleProp<TextStyle>
}

const { width } = Dimensions.get('screen');

export default class HorizontalButtonComponent extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);

        this.onPress = this.onPress.bind(this);
    }

    private onPress(): void {
        if (this.props.disabled) {
            return;
        }
        this.props.onPress();
    }

    render() {
        const backgroundColor = this.props.background ?
            this.props.background :
            this.props.disabled ? themeStyles.disabledButton.backgroundColor : 'black';

        const borderWidth = settingsGlobals.darkMode ? 1 : 0;

        return <TouchableOpacity
            activeOpacity={1}
            onPress={this.onPress}
            style={
                [
                    styles.container,
                    themeStyles.buttonBorderColor,
                    this.props.styles,
                    {
                        borderWidth,
                        backgroundColor,
                    },
                ]
            }
        >
            <View style={styles.icon}>
                {this.props.icon}
            </View>
            {
                this.props.isLoading ?
                    <ActivityIndicator color='white' /> :
                    <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
            }
        </TouchableOpacity>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            width: width / 1.2,
            height: 50,
            borderRadius: 50,
            paddingHorizontal: 15,
            backgroundColor: '#1DB954',
            alignSelf: 'center',
            borderWidth: .2,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10
        },
        title: {
            fontSize: 17,
            color: 'white',
            fontFamily: 'Regular',
            includeFontPadding: false
        },
        icon: {
            position: 'absolute',
            left: 20,
        }
    }
);
