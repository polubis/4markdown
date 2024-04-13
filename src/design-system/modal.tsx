import React from 'react';
import { usePortal } from 'development-kit/use-portal';
import c from 'classnames';
import { useScrollHide } from 'development-kit/use-scroll-hide';
import {
  useOnEscapePress,
  type EscapePressHandler,
} from 'development-kit/use-on-escape-press';
import { AnimationProps, motion } from 'framer-motion';

interface ModalProps {
  className?: string;
  children: React.ReactNode;
  onEscape?: EscapePressHandler;
}

const props: AnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const Modal = ({ className, children, onEscape }: ModalProps) => {
  useScrollHide();
  useOnEscapePress(onEscape);
  const { render } = usePortal();

  return render(
    <motion.div
      className="bg-black/40 dark:bg-white/20 fixed items-center justify-center flex p-4 z-20 h-[100svh] w-[100svw] left-0 top-0 overflow-y-auto"
      {...props}
    >
      <div
        className={c(
          `bg-white m-auto w-[96%] tn:w-[380px] dark:bg-black rounded-lg shadow-xl p-4`,
          className,
        )}
      >
        {children}
      </div>
    </motion.div>,
  );
};

export default Modal;
