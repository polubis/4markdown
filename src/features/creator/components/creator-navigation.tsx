import React, { type ReactNode } from 'react';
import { Navigation } from 'components/navigation';

interface CreatorNavigationProps {
  children: ReactNode;
}

const CreatorNavigation = ({ children }: CreatorNavigationProps) => {
  return (
    <Navigation className="border-t md:border-b md:border-t-0">
      {children}
    </Navigation>
  );
};

export { CreatorNavigation };
