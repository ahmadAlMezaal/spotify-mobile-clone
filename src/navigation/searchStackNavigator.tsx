import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { stackConfig } from './config/stackNavigationConfig';
import { TouchableOpacity } from 'react-native';
import { themeStyles } from '@styles/globalColors';
import { MaterialIcons } from '@expo/vector-icons';
import PlayListScreen from '@screens/playlist/playlist.screen';
import SearchScreen from '@screens/search/search.screen';
import { SearchHeaderComponent } from '@screens/search/searchHeader.component';
import ArtistScreen from '@screens/artist/artist.screen';
import AlbumScreen from '@screens/album/album.screen';

const SearchStack = createStackNavigator();

export default function SearchStackNavigator({ initialRoute }: { initialRoute: string }): JSX.Element {
    return <SearchStack.Navigator
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
        <SearchStack.Screen
            options={
                () => (
                    {
                        headerBackTitle: '',
                        headerTitle: '',
                        headerTitleAlign: 'center',
                        headerLeft: () => <SearchHeaderComponent />,
                    }
                )
            }
            name="Search"
            component={SearchScreen}
        />
        <SearchStack.Screen
            options={{ headerShown: false }}
            name="Playlist"
            component={PlayListScreen}
        />
        <SearchStack.Screen
            options={{ headerShown: false }}
            name="Artist"
            component={ArtistScreen}
        />
        <SearchStack.Screen
            options={{ headerShown: false }}
            name="Album"
            component={AlbumScreen}
        />
    </SearchStack.Navigator>;
}
