import React from 'react';
import c from 'classnames';
import Backdrop from './backdrop';
import { AnimationProps, motion } from 'framer-motion';

interface PopoverProps {
  className: string;
  children: React.ReactNode;
  onBackdropClick?(): void;
}

const props: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const Popover = ({ className, children, onBackdropClick }: PopoverProps) => {
  return (
    <>
      <motion.div
        className={c(
          `fixed rounded-xl bg-zinc-200 dark:bg-gray-950 shadow-lg z-30 p-4`,
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
      <Backdrop onClick={onBackdropClick} />
    </>
  );
};

export default Popover;
