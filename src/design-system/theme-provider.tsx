import { isServer } from 'development-kit/ssr-csr';
import { useIsomorphicLayoutEffect } from 'development-kit/use-isomorphic-layout-effect';
import React from 'react';

const themes = [`light`, `dark`] as const;

type Theme = (typeof themes)[number];

interface ThemeContext {
  theme: Theme;
  setTheme(theme: Theme): void;
}

interface ThemeProviderProps {
  children: (context: ThemeContext) => React.ReactNode;
}

const isTheme = (theme: string | null): theme is Theme =>
  theme !== null && themes.includes(theme as Theme);

const readThemeFromLS = (): Theme => {
  if (isServer()) {
    return `light`;
  }

  const theme = localStorage.getItem(`theme`);

  if (!isTheme(theme)) return `light`;

  return theme;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = React.useState(readThemeFromLS);

  useIsomorphicLayoutEffect(() => {
    localStorage.setItem(`theme`, theme);

    if (document.body.classList.contains(`light`)) {
      document.body.classList.replace(`light`, theme);
      return;
    }

    if (document.body.classList.contains(`dark`)) {
      document.body.classList.replace(`dark`, theme);
      return;
    }

    document.body.classList.add(theme);
  }, [theme]);

  return children({
    theme,
    setTheme,
  });
};

export type { ThemeProviderProps };
export { ThemeProvider };
