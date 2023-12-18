import React from 'react';
import c from 'classnames';
import Backdrop from './backdrop';

const baseClasses = `fixed rounded-xl bg-zinc-200 dark:bg-gray-950 shadow-lg z-30 p-4`;

interface PopoverProps {
  className: string;
  children: React.ReactNode;
  onBackdropClick?(): void;
}

const Popover = ({ className, children, onBackdropClick }: PopoverProps) => {
  return (
    <>
      <div className={c(baseClasses, className)}>{children}</div>
      <Backdrop onClick={onBackdropClick} />
    </>
  );
};

export default Popover;
