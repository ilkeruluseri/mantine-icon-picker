import type { RenderHookResult } from '@testing-library/react';
import { renderHook as renderHookLibrary } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import { ThemeProvider } from './theme-provider';

// Render Wrapper for Hooks and non-UI components
// eslint-disable-next-line react-refresh/only-export-components
const ProvidersWrapper = ({ children }: PropsWithChildren) => {
    return (
        <ThemeProvider env="test">
            {children}
        </ThemeProvider>
    );
};

export const renderHookWrapper = <T,>(hook: () => T): RenderHookResult<T, unknown> => {
    const wrapper = ({ children }: PropsWithChildren) => (
        <ProvidersWrapper>{children}</ProvidersWrapper>
    );
    return renderHookLibrary(hook, { wrapper });
};
