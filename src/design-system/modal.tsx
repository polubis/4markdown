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
      <div className="fixed items-center justify-center flex p-4 z-20 h-[100svh] w-[100svw] left-0 top-0 overflow-y-auto">
        <div
          className={c(
            `bg-white m-auto max-w-[420px] dark:bg-black rounded-lg shadow-xl p-4`,
            className,
          )}
        >
          {children}
        </div>
      </div>
      ,
    </>,
  );
};

export default Modal;
