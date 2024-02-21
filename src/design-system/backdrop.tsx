import React from 'react';
import c from 'classnames';

interface BackdropProps {
  className?: string;
  onClick?(): void;
}

const Backdrop = ({ className, onClick }: BackdropProps) => {
  return (
    <div
      className={c(
        `fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/40 dark:bg-white/20`,
        className,
      )}
      onClick={onClick}
    />
  );
};

export default Backdrop;
