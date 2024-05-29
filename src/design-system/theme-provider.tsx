import { isClient } from 'development-kit/ssr-csr';
import React, { useEffect } from 'react';

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
  const [theme, setTheme] = React.useState<Theme | null>(null);

  useEffect(() => {
    (window as any).__onThemeChange = () => {
      setTheme((window as any).__theme);
    };

    setTheme(readThemeFromLS());
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
