import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@screens/home/home.screen';
import { stackConfig } from './config/stackNavigationConfig';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { themeStyles } from '@styles/globalColors';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import PlayListScreen from '@screens/playlist/playlist.screen';
import NotificationsScreen from '@screens/notifications/notifications.screen';
import AlbumScreen from '@screens/album/album.screen';

const HomeStack = createStackNavigator();

export default function HomeStackNavigator({ initialRoute }: { initialRoute: string }): JSX.Element {
    return <View style={{ flex: 1, backgroundColor: 'red' }}>
        <HomeStack.Navigator
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
                        headerLeft: () => <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={() => navigation.goBack()}
                            activeOpacity={1}
                        >
                            <MaterialIcons name="keyboard-arrow-left" size={32} color={themeStyles.fontColorMain.color} />
                        </TouchableOpacity>
                    }
                )
            }
        >
            <HomeStack.Screen
                options={
                    ({ navigation }) => ({
                        headerTitle: ' ',
                        headerBackTitle: ' ',
                        headerLeft: () => <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={styles.logo} source={require('../../assets/logo.png')} />
                            <Text style={[{ color: themeStyles.spotifyPrimary.backgroundColor, marginLeft: 6, fontSize: 26, fontFamily: 'SemiBold' }]}>Spotify</Text>
                        </View>,
                        headerRight: () => (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.headerIcon}
                                onPress={() => navigation.navigate('Notifications')}
                            >
                                <Ionicons name="notifications-outline" size={28} color={themeStyles.fontColorMain.color} />
                            </TouchableOpacity>
                        ),
                    })
                }
                name="Home"
                component={HomeScreen}
            />

            <HomeStack.Screen
                options={{ headerShown: false }}
                name="Playlist"
                component={PlayListScreen}
            />
            <HomeStack.Screen
                options={{ headerShown: false }}
                name="Album"
                component={AlbumScreen}
            />
            <HomeStack.Screen
                options={
                    {
                        headerBackTitle: ' ',
                        headerTitle: 'Notifications'
                    }
                }
                name="Notifications"
                component={NotificationsScreen}
            />
        </HomeStack.Navigator>
    </View>;
}
const styles = StyleSheet.create(
    {
        logo: {
            marginLeft: 16,
            height: 30,
            width: 30,
            aspectRatio: 1
        },
        headerIcon: {
            marginRight: 16
        }
    }
);
