import React, { type ReactNode } from 'react';
import { Link } from 'gatsby';
import { meta } from '../../meta';
import c from 'classnames';

type SubscribeNewsletterLinkProps = {
  className?: string;
  children: ReactNode;
};

const SubscribeNewsletterLink = ({
  className,
  children,
}: SubscribeNewsletterLinkProps) => {
  return (
    <Link
      className={c(
        `text-sm font-semibold px-3 py-2 w-fit bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 hover:opacity-90 shadow-md rounded-md cursor-pointer animate-gradient-move bg-[length:200%_200%] dark:outline-white focus:outline dark:outline-2 outline-2.5 outline-black`,
        className,
      )}
      to={meta.routes.newsletter.subscribe}
      title="Subscribe to weekly summary newsletter"
    >
      {children}
    </Link>
  );
};

export { SubscribeNewsletterLink };
