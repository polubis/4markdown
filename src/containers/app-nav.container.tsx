import React from 'react';
import UserPopover from '../components/user-popover';
import MoreNav from '../components/more-nav';
import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import { Button } from 'design-system/button';
import { siteMetadataStoreSelectors } from 'store/site-metadata/site-metadata.store';
import { BiMoon, BiSun } from 'react-icons/bi';

interface AppNavContainerProps {
  children: React.ReactNode;
}

const AppNavContainer = ({ children }: AppNavContainerProps) => {
  const meta = siteMetadataStoreSelectors.useReady();

  return (
    <header className="flex items-center overflow-x-auto overflow-y-hidden py-2 pl-4 pr-0 sm:pr-4 bg-zinc-200 dark:bg-gray-950 border-t-2 md:border-b-2 md:border-t-0 border-zinc-300 dark:border-zinc-800 h-[72px]">
      <picture className="w-[32px] h-[32px] shrink-0 sm:flex hidden mr-3">
        <img
          rel="preload"
          src="/favicon-32x32.png"
          alt={meta.appName}
          title={meta.title}
        />
      </picture>
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
        <UserPopover />
        <MoreNav />
        <div className="h-1 w-2 shrink-0 block sm:hidden" />
      </nav>
    </header>
  );
};

export { AppNavContainer };
