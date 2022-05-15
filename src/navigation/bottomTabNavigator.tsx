import React from 'react';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { themeStyles } from '@styles/globalColors';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeStackNavigator from './homeStackNavigator';
import LibraryScreen from '@screens/library/library.screen';
import ProfileScreen from '@screens/profile/profile.screen';
import SearchStackNavigator from './searchStackNavigator';

const BottomTab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends React.Component {
    render() {
        return <BottomTab.Navigator
            shifting={false}
            activeColor='white'
            inactiveColor='rgba(255,255,255,0.4)'
            initialRouteName="Home"
            barStyle={
                {
                    height: Platform.OS === 'ios' ? 80 : 63,
                    backgroundColor: themeStyles.containerColorMain.backgroundColor,
                    shadowColor: '000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 2.5,
                    elevation: 5,
                    paddingVertical: 5
                }
            }
        >
            <BottomTab.Screen
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }: any) => <Ionicons name="home-outline" size={24} color={color} />
                }}
                name="HomeStack"
                component={HomeStackNavigator} />
            <BottomTab.Screen
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color }: any) => <Ionicons name="search" size={24} color={color} />
                }}
                name="SearchStack"
                component={SearchStackNavigator} />
            <BottomTab.Screen
                options={{
                    tabBarLabel: 'Favorites',
                    tabBarIcon: ({ color }: any) => <FontAwesome name="star-o" size={24} color={color} />
                }}
                name="Library"
                component={LibraryScreen} />
            <BottomTab.Screen
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }: any) => <AntDesign name="user" size={24} color={color} />
                }}
                name="Profile"
                component={ProfileScreen} />
        </BottomTab.Navigator >;
    }
}
