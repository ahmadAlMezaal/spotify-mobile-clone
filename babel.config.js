module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        '@components': './src/components',
                        '@controls': './src/controls',
                        '@screens': './src/screens',
                        '@globals': './src/globals',
                        '@services': './src/services',
                        '@types': './src/types',
                        '@styles': './styles'
                    }
                },
            ],
            [
                'module:react-native-dotenv',
                {
                    'moduleName': '@env',
                    'path': '.env',
                    'blacklist': null,
                    'whitelist': [
                        'SPOTIFY_CLIENT_ID',
                        'SPOTIFY_CLIENT_SECRET',
                        'SPOTIFY_REDIRECT_URL',
                        'ANDROID_CLIENT_ID',
                        'IOS_CLIENT_ID',
                        'FACEBOOK_APP_ID'
                    ],
                    'safe': false,
                    'allowUndefined': true
                }
            ]
        ],
    };
};
