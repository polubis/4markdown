import React, { type ReactNode } from 'react';
import c from 'classnames';

interface BadgesProps {
  className?: string;
  children: ReactNode;
}

const Badges = ({ className, children }: BadgesProps) => {
  return (
    <div className={c(`flex flex-wrap gap-2 items-center`, className)}>
      {children}
    </div>
  );
};

export { Badges };
