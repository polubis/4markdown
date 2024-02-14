import React from 'react';
import c from 'classnames';

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
}

const Badge = ({ className, children, title }: BadgeProps) => {
  return (
    <div
      className={c(
        `text-lg font-medium capitalize rounded-lg bg-slate-200 dark:bg-slate-800 dark:text-white text-black py-1 px-3`,
        className,
      )}
      title={title}
    >
      {children}
    </div>
  );
};

export { Badge };
