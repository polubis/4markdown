import React, { type ReactNode } from 'react';
import c from 'classnames';

type NavigationProps = {
  className?: string;
  children: ReactNode;
};

const Navigation = ({ className, children }: NavigationProps) => {
  return (
    <header
      className={c(
        `ds-navigation flex items-center overflow-x-auto py-2 pl-4 pr-0 sm:pr-4 h-[72px] border-zinc-300 dark:border-zinc-800`,
        className,
      )}
    >
      {children}
    </header>
  );
};

const Logo = ({ children }: { children: ReactNode }) => (
  <div className="ds-navigation-logo">{children}</div>
);

const Links = ({ children }: { children: ReactNode }) => (
  <nav className="ds-navigation-links flex gap-2 w-full items-center">
    {children}
  </nav>
);

Navigation.Logo = Logo;
Navigation.Links = Links;

export { Navigation };
