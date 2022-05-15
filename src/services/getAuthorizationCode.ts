/* eslint-disable no-console */
import * as AuthSession from 'expo-auth-session';
import { encode as btoa } from 'base-64';
import * as SecureStore from 'expo-secure-store';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URL } from '@env';

const credsB64: string = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

export async function getAuthorizationCode() {
    const scopesArr = [
        'user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state',
        'user-library-modify', 'user-library-read', 'playlist-read-private', 'playlist-read-collaborative',
        'playlist-modify-public', 'playlist-modify-private', 'user-read-recently-played', 'user-top-read'
    ];
    const scopes = scopesArr.join(' ');
    let result: any;
    try {
        const redirectUrl = AuthSession.getRedirectUrl();

        const params = {
            authUrl:
                'https://accounts.spotify.com/authorize' +
                '?response_type=code' +
                '&client_id=' +
                SPOTIFY_CLIENT_ID +
                (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
                '&redirect_uri=' +
                encodeURIComponent(redirectUrl),
        };
        result = await AuthSession.startAsync(params);
    } catch (error) {
        console.log('error: ', error);
    }
    return result.params.code;
}

export async function getAuthTokens(): Promise<void | boolean> {
    try {
        const authorizationCode: string = await getAuthorizationCode();

        const response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credsB64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${SPOTIFY_REDIRECT_URL}`,
            }

        );
        const responseJson = await response.json();
        const {
            access_token,
            refresh_token,
            expires_in
        }: { access_token: string, refresh_token: string, expires_in: number } = responseJson;

        await Promise.all(
            [
                SecureStore.setItemAsync('expiration_time', String(expires_in)),
                SecureStore.setItemAsync('access_token', access_token),
                SecureStore.setItemAsync('refresh_token', refresh_token),

            ]
        ).catch((error) => { console.log('Promise.all error: ', error); });

        return true;
    } catch (error) {
        console.log('error: ', error);
        return false;
    }
}

export async function handleRefreshToken() {
    try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        const response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credsB64}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=refresh_token&refresh_token=${refreshToken as string}`,
            }
        );
        const responseJson = await response.json();
        if (responseJson.error) {
            await getAuthTokens();
        } else {
            const {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                expires_in: expiresIn,
            } = responseJson;

            const expirationTime = new Date().getTime() + expiresIn * 1000;
            await SecureStore.setItemAsync('access_token', newAccessToken);

            if (newRefreshToken) {
                await SecureStore.setItemAsync('refresh_token', newRefreshToken);
            }
            await SecureStore.setItemAsync('expiration_time', String(expirationTime));
        }
    } catch (error) {
        console.error('error: ', error);
    }
}
