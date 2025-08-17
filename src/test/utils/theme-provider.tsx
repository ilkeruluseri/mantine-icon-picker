import '@mantine/core/styles.css';

import { DirectionProvider, MantineProvider } from '@mantine/core';
import type { ComponentProps, PropsWithChildren } from 'react';

export const ThemeProvider = ({
    children,
    ...props
}: PropsWithChildren<ComponentProps<typeof MantineProvider>>) => {
    return (
        <DirectionProvider>
            <MantineProvider {...props}>
                {children}
            </MantineProvider>
        </DirectionProvider>
    );
};
