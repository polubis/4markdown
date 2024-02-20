import React from 'react';
import Backdrop from './backdrop';
import { usePortal } from 'development-kit/use-portal';
import c from 'classnames';

interface ModalProps {
  className?: string;
  children: React.ReactNode;
  onClose?(): void;
}

const Modal = ({ className, children, onClose }: ModalProps) => {
  const { render } = usePortal();

  return render(
    <>
      <Backdrop onClick={onClose} />
      <div
        className={c(
          `p-4 w-[96%] tn:w-[380px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-40 bg-white dark:bg-black rounded-lg shadow-xl`,
          className,
        )}
      >
        {children}
      </div>
    </>,
  );
};

export default Modal;
