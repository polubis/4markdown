import React from 'react';
import c from 'classnames';

type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoaderProps {
  className?: string;
  size?: LoaderSize;
}

const sizesLokup = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
};

const Loader = ({ className, size = `md` }: LoaderProps) => {
  const s = sizesLokup[size];

  return (
    <div
      className={c(
        `loader border-4 border-gray-300 border-r-green-700 border-solid dark:border-slate-800 dark:border-r-green-700 rounded-full`,
        `w-${s} h-${s}`,
        className,
      )}
    />
  );
};

export { Loader };
