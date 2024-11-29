import { AppNavLink } from 'components/app-nav-link';
import React from 'react';
import { BiBook } from 'react-icons/bi';
import { meta } from '../../meta';

const EducationZoneLinkContainer = () => {
  return (
    <AppNavLink
      title="Go to education zone"
      className="hidden md:flex"
      to={meta.routes.education.zone}
      partiallyActive
    >
      <BiBook size={20} className="mr-2 shrink-0" />
      <span className="font-semibold">Education Zone</span>
    </AppNavLink>
  );
};

export { EducationZoneLinkContainer };
