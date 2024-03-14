import React from 'react';
import { usePortal } from 'development-kit/use-portal';
import c from 'classnames';
import { useScrollHide } from 'development-kit/use-scroll-hide';
import { type Variants, motion } from 'framer-motion';

interface ModalProps {
  className?: string;
  children: React.ReactNode;
}

const wrapperVariants: Variants = {
  initial: {
    y: -12,
    opacity: 0.4,
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      damping: 10,
      stiffness: 100,
    },
  },
};

const containerVariants: Variants = {
  initial: {
    opacity: 0.8,
  },
  open: {
    opacity: 1,
  },
};

const Modal = ({ className, children }: ModalProps) => {
  useScrollHide();
  const { render } = usePortal();

  return render(
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="open"
      className="bg-black/40 dark:bg-white/20 fixed items-center justify-center flex p-4 z-20 h-[100svh] w-[100svw] left-0 top-0 overflow-y-auto"
    >
      <motion.div
        variants={wrapperVariants}
        initial="initial"
        animate="open"
        className={c(
          `bg-white m-auto w-[96%] tn:w-[380px] dark:bg-black rounded-lg shadow-xl p-4`,
          className,
        )}
      >
        {children}
      </motion.div>
    </motion.div>,
  );
};

export default Modal;
