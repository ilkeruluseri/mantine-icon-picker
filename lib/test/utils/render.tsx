import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';

import { ThemeProvider } from './theme-provider';
import type { TTestThemeConfig } from './type';

export const renderWrapper = (ui: React.ReactNode, theme?: TTestThemeConfig, options?: RenderOptions): RenderResult => {
    return render(
        <ThemeProvider {...theme}>
            {ui}
        </ThemeProvider>,
        options,
    );
};
