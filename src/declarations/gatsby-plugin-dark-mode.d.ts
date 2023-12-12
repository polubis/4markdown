import type { FC, ReactNode } from 'react';

declare module 'gatsby-plugin-dark-mode' {
  export type Theme = 'light' | 'dark';

  export interface ThemeTogglerChildrenProps {
    theme: Theme;
    toggleTheme(theme: Theme): void;
  }

  export interface ThemeTogglerProps {
    children(props: ThemeTogglerChildrenProps): ReactNode;
  }

  export const ThemeToggler: FC<ThemeTogglerProps>;
}
