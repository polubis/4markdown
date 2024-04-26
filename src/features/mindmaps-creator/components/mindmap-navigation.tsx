import { Logo } from 'components/logo';
import { Navigation } from 'components/navigation';
import UserPopover from 'components/user-popover';
import React from 'react';

interface AppNavigationProps {
  children: React.ReactNode;
}

const MindmapNavigation = ({ children }: AppNavigationProps) => {
  return (
    <Navigation
      className="border-b-2"
      popover={<UserPopover className="right-2 top-16" />}
      logo={<Logo className="sm:flex hidden mr-10" />}
    >
      <div className="flex items-center space-x-5">{children}</div>
    </Navigation>
  );
};

export { MindmapNavigation };
