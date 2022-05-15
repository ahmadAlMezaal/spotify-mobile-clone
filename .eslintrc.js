module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-native'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
        'semi': [1, 'always'],
        'quotes': [1, 'single', { 'avoidEscape': true }],
        'no-multiple-empty-lines': [1, { 'max': 1, 'maxEOF': 0 }],
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-empty-interface':'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'lines-between-class-members': 'off',
        '@typescript-eslint/lines-between-class-members': ['error'],
        'no-console': 'warn',
        'no-trailing-spaces': 'warn',
        'react-native/no-unused-styles': 1,
        'react-native/no-inline-styles': 1,
        'eol-last': ['warn', 'always'],
        'react-native/no-inline-styles': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'no-empty': 'off'
    }
};