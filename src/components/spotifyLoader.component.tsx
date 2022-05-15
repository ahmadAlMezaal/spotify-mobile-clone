import { themeStyles } from '@styles/globalColors';
import React from 'react';
import { StyleSheet, Animated, ActivityIndicator } from 'react-native';

export default function SpotifyLoader(): JSX.Element {
    return <Animated.View style={styles.container} >
        <ActivityIndicator
            size='large'
            color={themeStyles.spotifyPrimary.backgroundColor}
            style={styles.activityIndicator}
        />
    </Animated.View>;
}

const styles = StyleSheet.create(
    {
        container: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 9999,
            elevation: 9999,
        },
        activityIndicator: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: '100%',
        }
    }
);
