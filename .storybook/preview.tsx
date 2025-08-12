import '../lib/global.css';

import type { Preview } from '@storybook/react';
import type { Decorator } from '@storybook/react';
import { MantineProvider } from '@mantine/core';

const withMantineProvider: Decorator = (Story) => (
    <MantineProvider>
        <Story />
    </MantineProvider>
);

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [withMantineProvider],
    tags: ['autodocs'],
};

export default preview;
