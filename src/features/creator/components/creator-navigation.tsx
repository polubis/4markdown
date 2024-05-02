import React from 'react';
import { Navigation } from 'components/navigation';
import UserPopoverContainer from 'containers/user-popover.container';

interface CreatorNavigationProps {
  children: React.ReactNode;
}

const CreatorNavigation = ({ children }: CreatorNavigationProps) => {
  return (
    <Navigation
      className="border-t-2 md:border-b-2 md:border-t-0"
      popover={
        <UserPopoverContainer className="bottom-20 right-2 md:bottom-auto md:top-16" />
      }
    >
      {children}
    </Navigation>
  );
};

export { CreatorNavigation };
