import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import eslint_js from '@eslint/js';
import eslint_ts from 'typescript-eslint';

export default [
    {
        files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
        languageOptions: {
            ...reactPlugin.configs.flat.recommended.languageOptions,
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
    },
    eslint_js.configs.recommended,
    ...eslint_ts.configs.recommended,
    {
        "rules": {
            "constructor-super": ["error", {
                "structuredClone": true // 或者 false，取决于你的需求
            }]
        },
    }
];