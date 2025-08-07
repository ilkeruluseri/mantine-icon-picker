import type { ComponentProps } from 'react';

import type { ThemeProvider } from './theme-provider';

export type TTestThemeConfig = Omit<ComponentProps<typeof ThemeProvider>, 'children'|'theme'>;
