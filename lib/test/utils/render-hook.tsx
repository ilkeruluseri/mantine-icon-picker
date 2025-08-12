import type { MantineThemeOverride } from '@mantine/core';
import { createTheme  } from '@mantine/core';
import type { RenderHookResult } from '@testing-library/react';
import { renderHook } from '@testing-library/react';

import { ThemeProvider } from './theme-provider';
import type { TTestThemeConfig } from './type';

interface IProps {
    children: React.ReactNode;
    theme?: TTestThemeConfig;
}

// Render Wrapper for Hooks and non-UI components
// eslint-disable-next-line react-refresh/only-export-components
const ProvidersWrapper = ({ children, theme }: IProps) => {
    return (
        <ThemeProvider theme={theme ? createTheme(theme as MantineThemeOverride) : undefined}>
            {children}
        </ThemeProvider>
    );
};

export const renderHookWrapper = (hook: () => unknown, theme?: TTestThemeConfig): RenderHookResult<any, unknown> => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProvidersWrapper theme={theme}>{children}</ProvidersWrapper>
    );
    return renderHook(hook, { wrapper });
};
