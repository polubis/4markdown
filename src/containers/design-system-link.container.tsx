import { AppNavLink } from 'components/app-nav-link';
import React from 'react';
import { BiPalette } from 'react-icons/bi';
import { meta } from '../../meta';

const DesignSystemLinkContainer = () => {
  return (
    <AppNavLink
      title="Go to design system page"
      className="hidden md:flex"
      to={meta.routes.designSystem}
    >
      <BiPalette size={20} className="mr-2 shrink-0" />
      <span className="font-semibold">Design System</span>
    </AppNavLink>
  );
};

export { DesignSystemLinkContainer };
