import React from 'react';
import c from 'classnames';
import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import { Button } from 'design-system/button';
import { BiMoon, BiSun } from 'react-icons/bi';
import MoreNav from './more-nav';
import { Logo } from './logo';

interface NavigationProps {
  className?: string;
  children: React.ReactNode;
  popover: React.ReactNode;
  logo?: React.ReactNode;
}

const Navigation = ({
  className,
  children,
  popover,
  logo = <Logo className="sm:flex hidden mr-3" />,
}: NavigationProps) => {
  return (
    <header
      className={c(
        `flex items-center overflow-x-auto overflow-y-hidden py-2 pl-4 pr-0 sm:pr-4 bg-zinc-200 dark:bg-gray-950 h-[72px] border-zinc-300 dark:border-zinc-800`,
        className,
      )}
    >
      {logo}
      <nav className="flex gap-3 w-full items-center">
        {children}
        <ThemeToggler>
          {({ theme, toggleTheme }) => (
            <Button
              i={1}
              s={2}
              title="Change theme"
              className="ml-auto"
              onClick={() => toggleTheme(theme === `light` ? `dark` : `light`)}
            >
              {theme === `light` ? <BiMoon /> : <BiSun />}
            </Button>
          )}
        </ThemeToggler>
        {popover}
        <MoreNav />
        <div className="h-1 w-2 shrink-0 block sm:hidden" />
      </nav>
    </header>
  );
};

export type { NavigationProps };
export { Navigation };
