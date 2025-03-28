import { useScrollHide } from 'development-kit/use-scroll-hide';
import React, { type ReactNode } from 'react';

const ScrollHide = ({ children }: { children: ReactNode }) => {
  useScrollHide();
  return <>{children}</>;
};

export { ScrollHide };
