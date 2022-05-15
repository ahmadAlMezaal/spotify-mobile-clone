import { themeStyles } from '@styles/globalColors';
import React, { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function ProgressBarComponent({ progress }: { progress: number }) {

    const [progressState, setProgressState] = useState(progress);

    useEffect(() => {
        onScale();
    }, [progress]);

    const scale = useRef(new Animated.Value(0));

    function onScale(): void {
        if (progress > 100) {
            return;
        }
        scale.current.addListener(({ value }: any) => {
            setProgressState(parseInt(value, 10));
        });
        Animated.timing(scale.current, {
            toValue: progress,
            duration: 200,
            useNativeDriver: true
        }).start();
    }

    return <View style={styles.container}>
        <Animated.View style={
            [
                themeStyles.spotifyPrimary,
                styles.fillStyle,
                { width: `${progressState}%` }
            ]
        }
        />
    </View>;
}

const styles = StyleSheet.create(
    {
        container: {
            height: 12,
            width: '95%',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 50,
            marginVertical: 5,
            alignSelf: 'center',
            marginBottom: 15,
        },
        fillStyle: {
            height: '100%',
            borderRadius: 50
        },
    }
);
