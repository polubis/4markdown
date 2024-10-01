import React, { type ReactNode } from 'react';
import c from 'classnames';
import MoreNav from './more-nav';
import UserPopover from './user-popover';
import { ThemeSwitcher } from 'design-system/theme-switcher';

interface NavigationProps {
  className?: string;
  children: ReactNode;
}

const Navigation = ({ className, children }: NavigationProps) => {
  return (
    <header
      className={c(
        `flex items-center overflow-x-auto py-2 pl-4 pr-0 sm:pr-4 bg-zinc-200 dark:bg-gray-950 h-[72px] border-zinc-300 dark:border-zinc-800`,
        className,
      )}
    >
      <picture className="shrink-0 sm:flex hidden mr-3">
        <img
          className="w-8 h-8"
          rel="preload"
          src="/favicon-32x32.png"
          alt="Logo"
        />
      </picture>
      <nav className="flex gap-3 w-full items-center">
        {children}
        <ThemeSwitcher className="ml-auto" />
        <UserPopover />
        <MoreNav />
        <div className="h-1 w-2 shrink-0 block sm:hidden" />
      </nav>
    </header>
  );
};

export type { NavigationProps };
export { Navigation };
