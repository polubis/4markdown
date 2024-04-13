import React from 'react';
import c from 'classnames';
import { AnimationProps, motion } from 'framer-motion';

interface BackdropProps {
  className?: string;
  onClick?(): void;
}

const props: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const Backdrop = ({ className, onClick }: BackdropProps) => {
  return (
    <motion.div
      {...props}
      className={c(
        `fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/40 dark:bg-white/20`,
        className,
      )}
      onClick={onClick}
    />
  );
};

export default Backdrop;
