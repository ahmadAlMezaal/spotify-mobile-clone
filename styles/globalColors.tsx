import { StyleSheet } from 'react-native';
import { settingsGlobals } from '@globals';

export let themeStyles = StyleSheet.create(
    {
        containerColorMain: { backgroundColor: settingsGlobals.darkMode ? '#191414' : 'white' },
        spotifyPrimary: { backgroundColor: '#1DB954' },
        fontColorMain: { color: settingsGlobals.darkMode ? '#ebebeb' : 'black' },
        fontColorSub: { color: settingsGlobals.darkMode ? '#b0b3b8' : '#828282' },
        // buttonDisabledColor: { backgroundColor: settingsGlobals.darkMode ? '#2e2e2e' : '#999999' },
        disabledButton: { backgroundColor: '#2b2b2b' },
        buttonBorderColor: { borderColor: '#484848' },
        placeHolderFontColor: { color: '#8A8A8A' },

    }
);

export function updateThemeStyles() {
    themeStyles = StyleSheet.create(
        {
            containerColorMain: { backgroundColor: settingsGlobals.darkMode ? '#191414' : 'white' },
            spotifyPrimary: { backgroundColor: '#1DB954' },
            fontColorMain: { color: settingsGlobals.darkMode ? '#ebebeb' : 'black' },
            fontColorSub: { color: settingsGlobals.darkMode ? '#b0b3b8' : '#828282' },
            buttonBorderColor: { borderColor: '#484848' },
            // buttonDisabledColor: { backgroundColor: settingsGlobals.darkMode ? '#2e2e2e' : '#999999' },
            disabledButton: { backgroundColor: '#2b2b2b' },
            placeHolderFontColor: { color: '#8A8A8A' },

        }
    );
}
