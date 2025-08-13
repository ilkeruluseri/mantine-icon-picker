import { render as RenderReactTest, type RenderResult } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import { ThemeProvider } from './theme-provider';

export function renderWrapper(ui: React.ReactNode): RenderResult {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return RenderReactTest(<>{ui}</>, {
        wrapper: ({ children }: PropsWithChildren) => (
            <ThemeProvider env="test">
                {children}
            </ThemeProvider>
        ),
    });
}
