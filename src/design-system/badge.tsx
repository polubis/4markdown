import React from 'react';
import c from 'classnames';

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

const Badge = ({ className, children }: BadgeProps) => {
  return (
    <div
      className={c(
        `text-lg font-medium capitalize rounded-lg bg-slate-200 dark:bg-slate-700 dark:text-white text-black py-1 px-3`,
        className,
      )}
    >
      {children}
    </div>
  );
};

export { Badge };
