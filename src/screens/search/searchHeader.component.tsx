import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeStyles } from '@styles/globalColors';
import { navigatorGlobals } from '@globals/navigationGlobals';
import { AntDesign } from '@expo/vector-icons';

export function SearchHeaderComponent(): JSX.Element {

    const isMounted = useRef<boolean>(true);
    const [search, setSearch] = useState('');

    useEffect(
        () => {
            return () => { isMounted.current = false; };
        }
    );

    const textInput = useRef<TextInput>(null);

    function handleSearch(query: string) {
        setSearch(query);
        navigatorGlobals.searchResults(query);
    }

    function clear() {
        setSearch('');
        navigatorGlobals.searchResults('');
    }

    return <View style={styles.inputContainer}>
        <Ionicons style={[styles.searchIcon, themeStyles.fontColorSub]} name="ios-search" size={20} color={themeStyles.fontColorMain.color} />
        <TextInput
            ref={textInput}
            value={search}
            style={[themeStyles.disabledButton, styles.input, themeStyles.fontColorMain]}
            onChangeText={handleSearch}
            maxLength={50}
            placeholder={'Search'}
            placeholderTextColor={themeStyles.fontColorSub.color}
        />
        {search.length > 0 &&
            <TouchableOpacity
                activeOpacity={1}
                style={styles.closeIcon}
                onPress={clear}
            >
                <AntDesign name="close" size={20} color={themeStyles.fontColorMain.color} />
            </TouchableOpacity>
        }
    </View>;
}

const styles = StyleSheet.create(
    {
        inputContainer: {
            width: Dimensions.get('window').width - 50,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 16,
            padding: 4
        },
        searchIcon: {
            position: 'absolute',
            marginHorizontal: 10,
            zIndex: 1,
        },
        input: {
            borderRadius: 4,
            fontSize: 15,
            height: 35,
            width: '100%',
            paddingVertical: 4,
            paddingLeft: 30,
        },
        closeIcon: {
            position: 'absolute',
            right: 10
        }
    }
);
