import React from 'react';
import { BiCodeBlock } from 'react-icons/bi';
import { AppNavLink } from 'components/app-nav-link';
import { meta } from 'core/consts/meta';

const BackToCreatorLinkContainer = () => {
  return (
    <AppNavLink title="Go to creator" to={meta.routes.home}>
      <BiCodeBlock size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Creator</span>
    </AppNavLink>
  );
};

export { BackToCreatorLinkContainer };
