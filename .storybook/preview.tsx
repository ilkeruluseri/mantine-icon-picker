import '@mantine/core/styles.css';
import '../src/global.css';

import { MantineProvider } from '@mantine/core';
import type { Decorator, Preview } from '@storybook/react';

const withThemeProvider: Decorator = (Story) => (
    <MantineProvider>
        <Story />
    </MantineProvider>
);

const preview: Preview = {
    decorators: [withThemeProvider],
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    tags: ['autodocs'],
};

export default preview;
