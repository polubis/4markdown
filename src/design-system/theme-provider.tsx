import { isClient } from 'development-kit/ssr-csr';
import { useIsomorphicLayoutEffect } from 'development-kit/use-isomorphic-layout-effect';
import React from 'react';

const themes = [`light`, `dark`] as const;

type Theme = (typeof themes)[number];

interface ThemeContext {
  theme: Theme;
  set(theme: Theme): void;
}

interface ThemeProviderProps {
  children: (context: ThemeContext) => React.ReactNode;
}

const readThemeFromLS = (): Theme =>
  isClient() ? (window as any).__theme : null;

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = React.useState(readThemeFromLS);

  useIsomorphicLayoutEffect(() => {
    (window as any).__onThemeChange = () => {
      setTheme((window as any).__theme);
    };
  }, []);

  const set: ThemeContext['set'] = React.useCallback((theme) => {
    (window as any).__setPreferredTheme(theme);
  }, []);

  return children({
    theme,
    set,
  });
};

export type { ThemeProviderProps };
export { ThemeProvider };
