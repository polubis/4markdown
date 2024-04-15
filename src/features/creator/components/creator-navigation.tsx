import React from 'react';
import { Navigation } from 'components/navigation';
import UserPopover from 'components/user-popover';

interface CreatorNavigationProps {
  children: React.ReactNode;
}

const CreatorNavigation = ({ children }: CreatorNavigationProps) => {
  return (
    <Navigation
      className="border-t-2 md:border-b-2 md:border-t-0"
      popover={
        <UserPopover className="bottom-20 right-2 md:bottom-auto md:top-16" />
      }
    >
      {children}
    </Navigation>
  );
};

export { CreatorNavigation };
