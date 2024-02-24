import React from 'react';
import { usePortal } from 'development-kit/use-portal';
import { Badge, BadgeProps } from './badge';
import c from 'classnames';
import { motion } from 'framer-motion';

interface StatusProps extends BadgeProps {
  open?: boolean;
}

const variants = {
  initial: {
    y: -50,
    opacity: 0,
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      damping: 10,
      stiffness: 100,
    },
  },
  close: {
    y: -100,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
} as const;

const Status = ({ className, open, ...props }: StatusProps) => {
  const { render } = usePortal();

  return render(
    <motion.div
      className={c(
        `fixed top-4 left-0 right-0 mx-auto w-fit shadow-xl z-40 normal-case`,
        className,
      )}
      initial="initial"
      animate={open ? `open` : `close`}
      variants={variants}
    >
      <Badge {...props} />
    </motion.div>,
  );
};

export { Status };
