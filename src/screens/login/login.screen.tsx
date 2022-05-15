import React from 'react';
import { Text, StyleSheet, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import HorizontalButtonComponent from '@components/horizontalButton.component';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { themeStyles } from '@styles/globalColors';
import { FontAwesome } from '@expo/vector-icons';
import { globalStyles } from '@styles/globalStyles';
import TextField from '@components/textField.component';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import SpotifyLoader from '@components/spotifyLoader.component';
import { getAuthTokens } from '@services/getAuthorizationCode';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID, FACEBOOK_APP_ID } from '@env';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
}

interface State {
    isLoading: boolean;
    email: string;
    password: string
}

export default class LoginScreen extends React.PureComponent<Props, State> {

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            email: '',
            password: ''
        };

        this.handlePassword = this.handlePassword.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private handleEmail(username: string): void {
        if (this._isMounted) {
            this.setState({ email: username });
        }
    }

    private handlePassword(password: string): void {
        if (this._isMounted) {
            this.setState({ password });
        }
    }

    private async login() {
        try {
            const response = await getAuthTokens();
            if (response) {
                this.props.navigation.navigate('BottomTabNavigator');
            }
        } catch { }
    }

    private async loginWithGoogle() {
        if (this._isMounted) {
            this.setState({ isLoading: true });
        }
        try {
            const { type, user } = await Google.logInAsync(
                {
                    androidClientId: ANDROID_CLIENT_ID,
                    iosClientId: IOS_CLIENT_ID,
                    scopes: ['profile', 'email'],
                }
            ) as any;
            if (type === 'success') {
                alert(`Welcome ${user.name as string}!`);
            } else {
                alert('Something went wrong!');
                return { cancelled: true };
            }
        } catch (error) {
            alert('Something went wrong!');
            return { error: true };
        } finally {
            if (this._isMounted) {
                this.setState({ isLoading: false });
            }
        }

    }

    private async loginWithFacebook() {
        try {
            // const picture = data.picture.data;
            await Facebook.initializeAsync({ appId: FACEBOOK_APP_ID });
            const { type, token }: { type: string, token: string } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] }) as any;
            if (type === 'success') {
                // const { id, name, email }: { id: string, name: string, email: string };
                const response: any = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                const { id, name, email }: { id: number, name: string, email: string } = response;
                alert(`fb login response: ${id}_${name}_${email}`);
            } else {
                alert('Something went wrong');
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message as string}`);
        }
    }

    private loginWithApple(): void {

    }

    render(): JSX.Element {

        const keyboardVerticalOffset = 40;
        const behavior = 'position';

        return <>
            {this.state.isLoading && <SpotifyLoader />}
            <ScrollView
                contentContainerStyle={styles.scrollViewStyle}
                style={
                    [
                        globalStyles.containerPadding,
                        styles.container,
                        themeStyles.containerColorMain,
                    ]
                }
            >
                <View style={
                    [
                        styles.container,
                        themeStyles.containerColorMain,
                    ]
                }>
                    <KeyboardAvoidingView
                        style={
                            [
                                styles.container,
                                themeStyles.containerColorMain,
                            ]
                        }
                        behavior={behavior}
                        keyboardVerticalOffset={keyboardVerticalOffset}
                    >
                        <HorizontalButtonComponent
                            background={'#4267B2'}
                            icon={<FontAwesome name="facebook" size={24} color="white" />}
                            title="Continue with Facebook"
                            onPress={this.loginWithFacebook}
                        />
                        <HorizontalButtonComponent
                            background={'#4285F4'}
                            icon={<FontAwesome name="google" size={24} color="white" />}
                            title="Continue with Google"
                            onPress={this.loginWithGoogle}
                        />
                        <HorizontalButtonComponent
                            icon={<FontAwesome name="apple" size={24} color="white" />}
                            title="Continue with Apple"
                            onPress={this.loginWithApple}
                        />
                        <Text style={styles.or}>OR </Text>
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextField
                                style={styles.input}
                                placeholder={'JohnDoe@gmail.com'}
                                onChangeText={this.handleEmail}
                                value={this.state.email}
                            />
                            <Text style={styles.label}>Password</Text>
                            <TextField
                                style={styles.input}
                                secureTextEntry={true}
                                placeholder={'*****'}
                                onChangeText={this.handlePassword}
                                value={this.state.password}
                            />
                            <Text style={styles.forgotPassword}>Forgotten password?</Text>
                        </View>
                        <HorizontalButtonComponent
                            title="Log in"
                            onPress={this.login}
                        />
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </>;
    }
}

const styles = StyleSheet.create(
    {
        scrollViewStyle: {
            paddingBottom: 15
        },
        container: {
            flex: 1,
        },

        label: {
            color: 'white',
            fontSize: 19
        },
        formContainer: {
            marginBottom: 10
        },
        input: {
            marginVertical: 10
        },
        or: {
            fontSize: 21,
            color: 'white',
            textAlign: 'center',
            marginVertical: 10
        },
        forgotPassword: {
            color: 'white',
            textAlign: 'right'
        }
    }
);
