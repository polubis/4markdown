import { AppNavLink } from 'components/app-nav-link';
import React from 'react';
import { BiBook } from 'react-icons/bi';
import { meta } from '../../meta';

const DocsBrowseLinkContainer = () => {
  return (
    <AppNavLink
      title="Go to education zone"
      className="hidden md:flex"
      to={meta.routes.docs.educationZone}
    >
      <BiBook size={20} className="mr-2 shrink-0" />
      <span className="text-md font-semibold">Education Zone</span>
    </AppNavLink>
  );
};

export { DocsBrowseLinkContainer };
