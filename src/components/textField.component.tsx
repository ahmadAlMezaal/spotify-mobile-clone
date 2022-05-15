import { themeStyles } from '@styles/globalColors';
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

interface Props {
    secureTextEntry?: boolean;
    placeholder: string;
    value: string;
    onChangeText: (value: string) => void;
    style?: any;
    keyboardType?: any;
}

export default function TextField({ secureTextEntry, placeholder, value, onChangeText, style, keyboardType }: Props): JSX.Element {

    return <TextInput
        selectionColor={themeStyles.spotifyPrimary.backgroundColor}
        placeholderTextColor={themeStyles.placeHolderFontColor.color}
        keyboardType={keyboardType ? keyboardType : 'default'}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, style]}
    />;
}

const styles = StyleSheet.create(
    {
        input: {
            padding: 8,
            backgroundColor: '#2E2E2E',
            borderRadius: 6,
            color: 'white',
            fontSize: 21,
        },
    }
);
