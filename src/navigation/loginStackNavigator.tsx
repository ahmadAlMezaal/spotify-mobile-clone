import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@screens/login/login.screen';
import WelcomeScreen from '@screens/welcome/welcome.screen';
import SignupScreen from '@screens/login/signup.screen';
import { stackConfig } from './config/stackNavigationConfig';
import { TouchableOpacity } from 'react-native';
import { themeStyles } from '@styles/globalColors';
import { MaterialIcons } from '@expo/vector-icons';
import BottomTabNavigator from './bottomTabNavigator';

const LoginStack = createStackNavigator();

export default function LoginStackNavigator({ initialRoute }: { initialRoute: string }): JSX.Element {
    return <NavigationContainer theme={DarkTheme} >
        <LoginStack.Navigator
            initialRouteName={initialRoute}
            screenOptions={
                ({ navigation }: any) => (
                    {
                        ...stackConfig,
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            alignSelf: 'center',
                            color: themeStyles.fontColorMain.color
                        },
                        headerStyle: {
                            backgroundColor: themeStyles.containerColorMain.backgroundColor,
                            shadowRadius: 0,
                            shadowOffset: { height: 0, width: 0 },
                            elevation: 0,
                        },
                        headerLeft: () => navigation.canGoBack() ?
                            <TouchableOpacity
                                style={{ marginLeft: 10 }}
                                onPress={() => navigation.goBack()}
                                activeOpacity={1}
                            >
                                <MaterialIcons name="keyboard-arrow-left" size={32} color={themeStyles.fontColorMain.color} />
                            </TouchableOpacity> :
                            <></>
                    }
                )
            }
        >
            <LoginStack.Screen
                options={{ headerShown: false }}
                name="Welcome"
                component={WelcomeScreen}
            />
            <LoginStack.Screen
                options={
                    {
                        headerBackTitle: ' ',
                        headerTitle: 'Log in'
                    }
                }
                name="Login"
                component={LoginScreen}
            />
            <LoginStack.Screen
                options={
                    {
                        headerBackTitle: ' ',
                        headerTitle: 'Sign up'
                    }
                }
                name="Signup"
                component={SignupScreen}
            />
            <LoginStack.Screen
                options={{ headerShown: false, gestureEnabled: false }}
                name="BottomTabNavigator"
                component={BottomTabNavigator}
            />
        </LoginStack.Navigator>
    </NavigationContainer>;
}
