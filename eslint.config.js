import config from 'eslint-config-reactify';
import jestDom from 'eslint-plugin-jest-dom';
import storybook from 'eslint-plugin-storybook';

// eslint-disable-next-line tsdoc/syntax
/** @type {import("eslint").Linter.Config} */
export default [
    ...config,
    ...storybook.configs['flat/recommended'],
    {
        files: ['**/*.test.{js,jsx,ts,tsx}'],
        ...jestDom.configs['flat/recommended'],
    },
];
