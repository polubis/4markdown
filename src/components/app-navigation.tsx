import React, { type ReactNode } from "react";
import { Navigation } from "./navigation";

interface AppNavigationProps {
  children: ReactNode;
}

const AppNavigation = ({ children }: AppNavigationProps) => {
  return (
    <Navigation className="border-b">
      <div className="flex items-center space-x-5 sm:pl-5">{children}</div>
    </Navigation>
  );
};

export { AppNavigation };
