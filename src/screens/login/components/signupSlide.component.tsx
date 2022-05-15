import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';

export type TextInputProps = {
    secureTextEntry?: boolean;
    keyboardType: any;
    placeholder: string;
    value: string;
    onChangeText: (param: string) => void;
    hasIcon?: boolean;
}

interface Props {
    component: JSX.Element;
}

interface State {
    email: string,
    password: string;
    isPasswordShown: boolean;
}

const { width: screenWidth } = Dimensions.get('screen');

export default class SignupSlide extends React.Component<Props, State>{

    private _isMounted = false;

    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isPasswordShown: false
        };

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.toggleSecureTextEntry = this.toggleSecureTextEntry.bind(this);
    }

    componentDidMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount(): void {
        this._isMounted = false;
    }

    private handleUsername(username: string): void {
        if (this._isMounted) {
            this.setState({ email: username });
        }
    }

    private handlePassword(password: string) {
        if (this._isMounted) {
            this.setState({ password });
        }
    }

    private toggleSecureTextEntry(): void {
        if (this._isMounted) {
            this.setState({ isPasswordShown: !this.state.isPasswordShown });
        }
    }

    render(): JSX.Element {

        return <View style={styles.container}>
            {this.props.component}
        </View>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            width: screenWidth,
            alignItems: 'flex-start',
        },
    }
);
