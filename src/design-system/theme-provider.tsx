import React, { type ReactNode } from "react";
import { isClient } from "development-kit/ssr-csr";

const themes = [`light`, `dark`] as const;

type Theme = (typeof themes)[number];
type NullableTheme = Theme | null;

declare global {
  interface Window {
    __theme: Theme;
    __setPreferredTheme(theme: Theme): void;
    __onThemeChange(theme: Theme): void;
  }
}

interface ThemeContext {
  theme: NullableTheme;
  set(theme: Theme): void;
}

interface ThemeProviderProps {
  children(context: ThemeContext): ReactNode;
}

const getInitialTheme = (): NullableTheme =>
  isClient() ? window.__theme : null;

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = React.useState<NullableTheme>(null);

  const set: ThemeContext["set"] = React.useCallback((theme) => {
    window.__setPreferredTheme(theme);
  }, []);

  React.useEffect(() => {
    window.__onThemeChange = () => {
      setTheme(window.__theme);
    };

    setTheme(getInitialTheme());
  }, []);

  return children({
    theme,
    set,
  });
};

export { ThemeProvider };
