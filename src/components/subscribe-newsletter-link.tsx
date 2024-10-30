import React from 'react';
import { Link } from 'gatsby';
import { meta } from '../../meta';

const SubscribeNewsletterLink = () => {
  return (
    <Link
      className="text-sm font-semibold flex px-3 py-2 w-fit bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 hover:opacity-90 shadow-md rounded-md cursor-pointer animate-gradient-move bg-[length:200%_200%]"
      to={meta.routes.newsletter.subscribe}
      title="Subscribe to weekly summary newsletter"
    >
      Subscribe To Our Weekly Web Summary
    </Link>
  );
};

export { SubscribeNewsletterLink };
