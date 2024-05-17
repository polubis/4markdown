import React from 'react';
import { Navigation } from './navigation';

interface AppNavigationProps {
  children: React.ReactNode;
}

const AppNavigation = ({ children }: AppNavigationProps) => {
  return (
    <Navigation className="border-b-2">
      <div className="flex items-center space-x-5 sm:pl-5">{children}</div>
    </Navigation>
  );
};

export { AppNavigation };
