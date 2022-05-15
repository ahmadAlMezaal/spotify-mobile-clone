import React from 'react';
import { StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { globalStyles } from '@styles/globalStyles';
import { themeStyles } from '@styles/globalColors';
import HorizontalButton from '@components/horizontalButton.component';
import ProgressBarComponent from './components/progressBar.component';
import SignupSlide from './components/signupSlide.component';
import { Ionicons } from '@expo/vector-icons';
import { ParamListBase } from '@react-navigation/routers';
import TextField from '@components/textField.component';
import { getAuthTokens } from '@services/getAuthorizationCode';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
}

interface State {
    email: string;
    password: string;
    progress: number;
    currentSlide: number;
    totalSlides: number;
    isNext: boolean;
    isPasswordShown: boolean;
    phoneNumber: string;
    displayName: string;
}

const { width: screenWidth } = Dimensions.get('screen');

export default class SignupScreen extends React.Component<Props, State> {

    private _isMounted = false;

    private _scrollViewRef: React.RefObject<ScrollView>;

    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            progress: 25,
            totalSlides: 0,
            currentSlide: 1,
            isNext: false,
            isPasswordShown: false,
            phoneNumber: '',
            displayName: ''
        };

        this._scrollViewRef = React.createRef();

        this.signup = this.signup.bind(this);
        this.goToNext = this.goToNext.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handleDisplayName = this.handleDisplayName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleProgress = this.handleProgress.bind(this);
        this.handleButtonColor = this.handleButtonColor.bind(this);
        this.handlePhoneNumber = this.handlePhoneNumber.bind(this);
        this.toggleSecureTextEntry = this.toggleSecureTextEntry.bind(this);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private handleEmail(email: string): void {
        if (this._isMounted) {
            this.setState({ email });
        }
    }

    private handlePassword(password: string) {
        if (this._isMounted) {
            this.setState({ password });
        }
    }

    private handlePhoneNumber(phoneNumber: string) {
        const num = parseInt(phoneNumber);
        if (this._isMounted && !isNaN(num)) {
            this.setState({ phoneNumber });
        }
    }

    private handleDisplayName(displayName: string): void {
        if (this._isMounted) {
            this.setState({ displayName });
        }
    }

    private handleProgress(): void {
        if (this._isMounted) {
            this.setState({ progress: this.state.progress + 25 });
        }
    }

    private toggleSecureTextEntry(): void {
        if (this._isMounted) {
            this.setState({ isPasswordShown: !this.state.isPasswordShown });
        }
    }

    private validateEmail(): boolean {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(this.state.email).toLowerCase());
    }

    private validateForm(): boolean {
        if (!this.validateEmail() && this.state.currentSlide === 1) {
            return false;
        }

        if (this.state.password.length < 8 && this.state.currentSlide === 3) {
            return false;
        }
        return true;
    }

    private goToNext() {
        if (this._scrollViewRef) {
            if (!this.validateForm()) {
                return;
            }
            const scrollPoint = this.state.currentSlide * screenWidth;
            (this._scrollViewRef as any).scrollTo({ x: scrollPoint, y: 0, animated: true });
            if (Platform.OS === 'android') {
                this.handleScrollEnd({ nativeEvent: { contentOffset: { y: 0, x: scrollPoint } } });
            }
            this.handleProgress();
        }
    }

    private calculateTotalSlides = (contentWidth: number) => {
        if (contentWidth !== 0) {
            const approxSlide = contentWidth / screenWidth;
            if (this.state.totalSlides !== approxSlide) {
                this.setState({
                    totalSlides: parseInt(String(Math.ceil((approxSlide as any).toFixed(2))))
                });
                this.setNext(3 > this.state.currentSlide);
            }
        }
    }

    private setNext = (status: boolean) => {
        if (status !== this.state.isNext) {
            this.setState({ isNext: status });
        }
    }

    private handleScrollEnd = (event: any) => {
        if (!event) {
            return;
        }
        if (event.nativeEvent && event.nativeEvent.contentOffset) {
            let currentSlide = 1;
            if (event.nativeEvent.contentOffset.x === 0) {
                this.setState({ currentSlide });
            } else {
                const approxCurrentSlide: number = event.nativeEvent.contentOffset.x / screenWidth;
                const parsedApproxCurrentSlide: number = parseInt(approxCurrentSlide.toFixed(2));
                currentSlide = parseInt(String(Math.ceil(parsedApproxCurrentSlide) + 1));
                this.setState({ currentSlide });
            }
            this.setNext(this.state.totalSlides > currentSlide);
        }
    }

    private handleButtonColor(): string {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        regex.test(String(this.state.email).toLowerCase());
        if (this.state.currentSlide === 1 && !regex.test(String(this.state.email).toLowerCase())) {
            return themeStyles.disabledButton.backgroundColor;
        }
        if (this.state.currentSlide === 2 && this.state.displayName.length < 3) {
            return themeStyles.disabledButton.backgroundColor;
        }
        if (this.state.currentSlide === 3 && this.state.password.length < 8) {
            return themeStyles.disabledButton.backgroundColor;
        }
        if (this.state.currentSlide === 4 && this.state.phoneNumber.length < 6) {
            return themeStyles.disabledButton.backgroundColor;
        }
        return 'white';
    }

    private async signup() {
        try {
            const response = await getAuthTokens();
            if (response) {
                this.props.navigation.navigate('BottomTabNavigator');
            }
        } catch { }
    }

    render() {

        const iconName = this.state.isPasswordShown ? 'ios-eye-outline' : 'ios-eye-off-outline';
        const slides: JSX.Element[] = [
            <View>
                <Text style={styles.title}>Enter your email address</Text>
                <TextField
                    keyboardType={'email-address'}
                    placeholder={'Email address'}
                    value={this.state.email}
                    style={styles.input}
                    onChangeText={this.handleEmail}
                />
            </View>,
            <View>
                <Text style={styles.title}>Enter your display name</Text>
                <TextField
                    keyboardType={'default'}
                    placeholder={'John Doe'}
                    value={this.state.displayName}
                    style={styles.input}
                    onChangeText={this.handleDisplayName}
                />
            </View>,
            <>
                <Text style={styles.title}>Create a new password</Text>
                <View style={styles.passwordInputRow}>
                    <TextField
                        secureTextEntry={!this.state.isPasswordShown}
                        keyboardType={'default'}
                        placeholder={'Password'}
                        value={this.state.password}
                        style={styles.input}
                        onChangeText={this.handlePassword}
                    />
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.passwordIcon}
                        onPress={this.toggleSecureTextEntry}>
                        <Ionicons name={iconName} size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </>,
            <View>
                <Text style={styles.title}>Enter your phone number</Text>
                <TextField
                    keyboardType={'numeric'}
                    placeholder={'+12345678'}
                    value={this.state.phoneNumber}
                    style={styles.input}
                    onChangeText={this.handlePhoneNumber}
                />
            </View>,
        ];

        const keyboardVerticalOffset = Platform.OS === 'ios' ? 120 : 0;
        const behavior = Platform.OS === 'ios' ? 'padding' : undefined;

        return <View style={styles.container}>
            <KeyboardAvoidingView
                style={[styles.container, themeStyles.containerColorMain]}
                behavior={behavior}
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <ScrollView
                    style={styles.slider}
                    ref={(ref) => { (this._scrollViewRef as any) = ref; }}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={0}
                    contentContainerStyle={styles.scrollViewStyle}
                    snapToAlignment={'center'}
                    scrollEnabled={false}
                    onContentSizeChange={this.calculateTotalSlides}
                    onMomentumScrollEnd={this.handleScrollEnd}
                >
                    {
                        slides.map(
                            (item: JSX.Element, index: number) => <SignupSlide key={index.toString()} component={item} />
                        )
                    }
                </ScrollView>
                <ProgressBarComponent progress={this.state.progress} />
                {
                    this.state.currentSlide <= 3 ? <HorizontalButton
                        background={this.handleButtonColor()}
                        title={'Next'}
                        titleStyle={{ color: 'black', fontFamily: 'SemiBold' }}
                        styles={styles.button}
                        onPress={this.goToNext}
                    /> :
                        <HorizontalButton
                            title={'Finish Sign up'}
                            background={this.handleButtonColor()}
                            styles={styles.button}
                            titleStyle={{ color: 'black', fontFamily: 'SemiBold' }}
                            onPress={this.signup}
                        />
                }
            </KeyboardAvoidingView>
        </View>;
    }
}

const styles = StyleSheet.create(
    {
        scrollViewStyle: {
            paddingHorizontal: globalStyles.containerPadding.padding,
        },
        container: {
            flex: 1,
        },
        title: {
            fontSize: 30,
            paddingTop: 15,
            paddingBottom: 10,
            fontFamily: 'SemiBold',
            color: 'white'
        },
        button: {
            marginVertical: 10,
        },
        slider: {
            width: '100%',
            flexGrow: 0,
            height: 300,
        },
        input: {
            padding: globalStyles.containerPadding.padding,
            fontSize: 25,
            width: screenWidth - 50
        },
        passwordInputRow: {
            width: screenWidth - 20,
            flexDirection: 'row',
            alignItems: 'center'
        },
        passwordIcon: {
            position: 'absolute',
            right: 40,
            top: 15,
            bottom: 10,
            justifyContent: 'center',
        }
    }
);
