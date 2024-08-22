import React from 'react';
import { ThemeProvider } from './theme-provider';
import { Button } from './button';
import { BiMoon, BiSun } from 'react-icons/bi';

type ThemeSwitcherProps = {
  className?: string;
};

const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  return (
    <ThemeProvider>
      {({ theme, set }) => (
        <Button
          i={1}
          s={2}
          title="Change theme"
          className={className}
          disabled={theme === null}
          onClick={() => set(theme === `light` ? `dark` : `light`)}
        >
          {theme === `dark` ? <BiSun /> : <BiMoon />}
        </Button>
      )}
    </ThemeProvider>
  );
};

export { ThemeSwitcher };
