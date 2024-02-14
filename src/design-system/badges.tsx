import React from 'react';
import c from 'classnames';

interface BadgesProps {
  className?: string;
  children: React.ReactNode;
}

const Badges = ({ className, children }: BadgesProps) => {
  return (
    <div className={c(`flex flex-wrap gap-2 items-center`, className)}>
      {children}
    </div>
  );
};

export { Badges };
