import { GatsbyLinkProps, Link } from 'gatsby';
import React from 'react';
import c from 'classnames';

interface AppNavLinkProps {
  className?: string;
  to: GatsbyLinkProps<unknown>['to'];
  children: GatsbyLinkProps<unknown>['children'];
  title: GatsbyLinkProps<unknown>['title'];
}

const AppNavLink = ({ className, ...props }: AppNavLinkProps) => {
  return (
    <Link
      activeClassName="active-link"
      className={c(
        `cursor-pointer no-underline flex items-center dark:hover:text-white/80 hover:text-black/80`,
        className,
      )}
      {...props}
    />
  );
};

export { AppNavLink };
