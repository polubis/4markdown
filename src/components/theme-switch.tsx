import { Button } from 'design-system/button';
import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import React from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';

const ThemeSwitch = React.memo(
  () => {
    return (
      <ThemeToggler>
        {({ theme, toggleTheme }) => (
          <Button
            i={2}
            title="Change theme"
            rfull
            onClick={() => toggleTheme(theme === `light` ? `dark` : `light`)}
          >
            {theme === `light` ? (
              <BiMoon className="text-2xl" />
            ) : (
              <BiSun className="text-2xl" />
            )}
          </Button>
        )}
      </ThemeToggler>
    );
  },
  () => true,
);

ThemeSwitch.displayName = `ThemeSwitch`;

export default ThemeSwitch;
