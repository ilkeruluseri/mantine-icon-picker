import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';

import { ThemeProvider } from './theme-provider';

export const renderWrapper = (ui: React.ReactNode, options?: RenderOptions): RenderResult => {
    return render(
        <ThemeProvider>
            {ui}
        </ThemeProvider>,
        options,
    );
};
