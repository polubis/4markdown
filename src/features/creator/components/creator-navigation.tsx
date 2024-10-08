import React, { type ReactNode } from 'react';
import { Navigation } from 'components/navigation';

interface CreatorNavigationProps {
  children: ReactNode;
}

const CreatorNavigation = ({ children }: CreatorNavigationProps) => {
  return (
    <Navigation className="border-t-2 md:border-b-2 md:border-t-0">
      {children}
    </Navigation>
  );
};

export { CreatorNavigation };
