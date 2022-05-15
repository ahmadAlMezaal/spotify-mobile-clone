import HorizontalButtonComponent from '@components/horizontalButton.component';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { themeStyles } from '@styles/globalColors';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
}

export default function ProfileScreen({ navigation }: Props): JSX.Element {

    const [imageUri, setImageUri] = useState('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [bio, setBio] = useState<string>('');

    async function logout(): Promise<void> {
        try {

            await Promise.all(
                [
                    SecureStore.deleteItemAsync('access_token'),
                    SecureStore.deleteItemAsync('refresh_token'),
                    SecureStore.deleteItemAsync('expiration_time')
                ]
            );

            navigation.reset(
                {
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                }
            );
        } catch { }
    }

    async function handlePickImage(): Promise<void> {
        const result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            }
        );

        if (!result.cancelled) {
            setImageUri(result.uri);
        }
    }

    return <ScrollView style={themeStyles.containerColorMain}>
        <View style={[styles.container, themeStyles.containerColorMain]}>

            <TouchableOpacity activeOpacity={1} onPress={handlePickImage} style={styles.imageContainer}>

                {
                    imageUri.length === 0 ?
                        <Image style={styles.profileImage} source={{ uri: 'https://preview.keenthemes.com/metronic-v4/theme_rtl/assets/pages/media/profile/profile_user.jpg' }} /> :
                        <Image style={styles.profileImage} source={{ uri: imageUri }} />
                }
                <Feather style={styles.cameraIcon} name="camera" size={22} color={themeStyles.spotifyPrimary.backgroundColor} />
            </TouchableOpacity>

            <View style={styles.row}>
                <View style={{ width: '45%' }}>
                    <Text style={[styles.label, themeStyles.fontColorMain]}>First name</Text>
                    <TextInput
                        style={[styles.input, themeStyles.fontColorMain]}
                        value={firstName}
                        onChangeText={(e) => setFirstName(e)}
                    />
                </View>
                <View style={{ width: '45%' }}>
                    <Text style={[styles.label, themeStyles.fontColorMain]}>Last name</Text>
                    <TextInput
                        style={[styles.input, themeStyles.fontColorMain]}
                        value={lastName}
                        onChangeText={(e) => setLastName(e)}
                    />
                </View>
            </View>
            <View style={{ marginVertical: 15 }}>
                <Text style={[styles.label, themeStyles.fontColorMain]}>Email address</Text>
                <TextInput
                    style={[styles.input, themeStyles.fontColorMain]}
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                />
            </View>
            <Text style={[styles.label, themeStyles.fontColorMain]}>Biography</Text>
            <TextInput
                numberOfLines={5}
                style={[styles.input, Platform.OS === 'ios' && { paddingBottom: 70, paddingTop: 15 }]}
                textAlignVertical={'top'}
                value={bio}
                multiline={Platform.OS !== 'ios' && true}
                onChangeText={(text) => setBio(text)}
            />
            <View style={styles.buttonsContainer}>
                <HorizontalButtonComponent
                    background={themeStyles.spotifyPrimary.backgroundColor}
                    title={'Save'}
                    onPress={logout}
                />
                <HorizontalButtonComponent
                    title={'Log out'}
                    onPress={logout}
                />
            </View>
        </View>
    </ScrollView>;
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            paddingTop: Constants.statusBarHeight + 30,
            paddingHorizontal: 16,
        },
        imageContainer: {
            alignSelf: 'center',
            marginBottom: 30,
        },
        profileImage: {
            width: 125,
            height: 125,
            borderRadius: 70,
        },
        cameraIcon: {
            padding: 6,
            borderRadius: 50,
            position: 'absolute',
            bottom: 0,
            right: 5,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        label: {
            fontFamily: 'Regular',
            paddingBottom: 3,
        },
        input: {
            fontFamily: 'Medium',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderColor: 'white',
        },
        buttonsContainer: {
            marginVertical: 20,
        },
    }
);
