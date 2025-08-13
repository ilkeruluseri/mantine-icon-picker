import config from 'eslint-config-reactify';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

// eslint-disable-next-line tsdoc/syntax
/** @type {import("eslint").Linter.Config} */
export default [
    ...config,
    ...storybook.configs['flat/recommended'],
    {
        files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
        ...jestDom.configs['flat/recommended'],
        ...jest.configs['flat/recommended'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['tsconfig.json', 'tsconfig.*.json'],
        rules: {
            'json/*': ['error', {'allowComments': true}],
        },
    },
];
