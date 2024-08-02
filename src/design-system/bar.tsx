import React, { type ReactNode } from 'react';
import c from 'classnames';

interface BarProps {
  className?: string;
  children: ReactNode;
}

const Bar = ({ className, children }: BarProps) => {
  return (
    <header
      className={c(
        `flex px-4 py-2 bg-zinc-200 dark:bg-gray-950 border-t-2 md:border-b-2 md:border-t-0 border-zinc-300 dark:border-zinc-800`,
        className,
      )}
    >
      {children}
    </header>
  );
};

export { Bar };
