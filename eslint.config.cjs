const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
    js.configs.recommended,

    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**']
    },

    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',

                fetch: 'readonly',
                Response: 'readonly',
                Request: 'readonly',
                Headers: 'readonly',
                AbortController: 'readonly',
                URLSearchParams: 'readonly',
                URL: 'readonly',
                RequestInit: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,

            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true
            }],
            '@typescript-eslint/no-explicit-any': 'off',

            'no-console': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
            'no-unused-vars': 'off',
            'no-undef': 'error',
            'no-control-regex': 'off',
            'no-prototype-builtins': 'off',
            'no-case-declarations': 'off'
        }
    }
];