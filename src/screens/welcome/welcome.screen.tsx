import React from 'react';
import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { themeStyles } from '@styles/globalColors';
import { globalStyles } from '@styles/globalStyles';
import HorizontalButtonComponent from '@components/horizontalButton.component';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
}

export default class WelcomeScreen extends React.PureComponent<Props> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.goToLogin = this.goToLogin.bind(this);
        this.goToSignup = this.goToSignup.bind(this);

    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private goToSignup(): void {
        if (this._isMounted) {
            this.props.navigation.navigate('Signup');
        }
    }

    private goToLogin(): void {
        if (this._isMounted) {
            this.props.navigation.navigate('Login');
        }
    }

    render(): JSX.Element {
        return <View style={styles.container}>
            <ImageBackground
                style={styles.backgroundImage}
                source={require('../../../assets/login2.jpg')}  >
                <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', width: '100%', height: '100%' }} />
            </ImageBackground>
            <View style={
                [
                    styles.bottomContainer,
                    themeStyles.containerColorMain,
                    globalStyles.containerPadding
                ]
            }>
                <Image style={styles.logo} source={require('../../../assets/logo.png')} />
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>Listen to the best songs.</Text>
                    <Text style={styles.title}>Available on Spotify!</Text>
                </View>
                <View>
                    <HorizontalButtonComponent
                        title="Sign up"
                        onPress={this.goToSignup}
                    />
                    <HorizontalButtonComponent
                        title="Log in"
                        onPress={this.goToLogin}
                    />
                </View>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
        },
        bottomContainer: {
            flex: 1.35,
            alignItems: 'center',
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            marginTop: -30,
            paddingBottom: 20,
            justifyContent: 'space-evenly'
        },
        title: {
            fontSize: 25,
            fontFamily: 'SemiBold',
            color: 'white',
        },
        backgroundImage: {
            width: '100%',
            flex: 1.7,
        },
        logo: {
            width: 75,
            height: 75,
        }
    }
);
