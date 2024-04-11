import { GatsbyLinkProps, Link } from 'gatsby';
import React from 'react';

interface AppNavLinkProps {
  to: GatsbyLinkProps<unknown>['to'];
  children: GatsbyLinkProps<unknown>['children'];
  title: GatsbyLinkProps<unknown>['title'];
}

const AppNavLink = (props: AppNavLinkProps) => {
  return (
    <Link
      activeClassName="active-link"
      className="cursor-pointer no-underline flex items-center ml-2 dark:hover:text-white/80 hover:text-black/80"
      {...props}
    />
  );
};

export { AppNavLink };
