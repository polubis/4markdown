import React, { type ReactNode } from 'react';
import c from 'classnames';
import MoreNav from './more-nav';
import UserPopover from './user-popover';
import { Link } from 'gatsby';
import { meta } from '../../meta';
import { SearchPopover } from './search-popover';

interface NavigationProps {
  className?: string;
  children: ReactNode;
}

const Navigation = ({ className, children }: NavigationProps) => {
  return (
    <header
      className={c(
        `flex items-center overflow-x-auto py-2 pl-4 pr-0 sm:pr-4 h-[72px] border-zinc-300 dark:border-zinc-800`,
        className,
      )}
    >
      <Link to={meta.routes.home} className="shrink-0 sm:flex hidden mr-2">
        <img
          className="w-8 h-8"
          rel="preload"
          src="/favicon-32x32.png"
          alt="Logo"
        />
      </Link>
      <nav className="flex gap-2 w-full items-center">
        {children}
        <SearchPopover className="ml-auto" />
        <UserPopover />
        <MoreNav />
        <div className="h-1 w-2 shrink-0 block sm:hidden" />
      </nav>
    </header>
  );
};

export type { NavigationProps };
export { Navigation };
