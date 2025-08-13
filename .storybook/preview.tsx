import '@mantine/core/styles.css';
import '../lib/global.css';

import { MantineProvider } from '@mantine/core';
import type { Decorator, Preview } from '@storybook/react';

const withMantineProvider: Decorator = (Story) => (
    <MantineProvider>
        <Story />
    </MantineProvider>
);

const preview: Preview = {
    decorators: [withMantineProvider],
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
