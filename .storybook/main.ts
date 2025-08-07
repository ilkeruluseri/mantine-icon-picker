import { withoutVitePlugins } from '@storybook/builder-vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    addons: [],
    core: {
        builder: '@storybook/builder-vite',
    },
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    stories: ['../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    viteFinal: async (config) => ({
        ...config,
        plugins: await withoutVitePlugins(config.plugins, ['vite:dts']), // skip dts plugin
    }),
};
export default config;
