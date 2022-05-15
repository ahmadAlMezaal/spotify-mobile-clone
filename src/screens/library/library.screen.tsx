import { themeStyles } from '@styles/globalColors';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default class LibraryScreen extends React.PureComponent {
    render() {
        return <View style={[styles.container, themeStyles.containerColorMain]}>
            <Text style={themeStyles.fontColorMain}> Library Screen </Text>
        </View>;
    }
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
);
