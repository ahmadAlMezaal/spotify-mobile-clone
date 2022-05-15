import React from 'react';
import { Easing, Platform, View } from 'react-native';
import { CardStyleInterpolators, StackNavigationOptions } from '@react-navigation/stack';
import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types';

const config: TransitionSpec = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const closeConfig: TransitionSpec = {
    animation: 'timing',
    config: {
        duration: 150,
        easing: Easing.linear,
    },
};

export const stackConfig: StackNavigationOptions = Platform.OS === 'ios' ? {} : {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    gestureEnabled: true,
    transitionSpec: {
        open: config,
        close: closeConfig,
    },
};
