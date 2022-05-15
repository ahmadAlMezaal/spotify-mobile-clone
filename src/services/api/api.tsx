import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'https://api.spotify.com/v1',
});

api.interceptors.request.use(
    async (config: any) => {

        const token = await SecureStore.getItemAsync('access_token').catch(() => { });
        config.headers.Accept = 'application/json';
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
