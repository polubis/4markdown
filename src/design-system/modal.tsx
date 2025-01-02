import React, {
  type ReactNode,
  type HTMLAttributes,
  type DetailedHTMLProps,
} from 'react';
import { usePortal } from 'development-kit/use-portal';
import c from 'classnames';
import { useScrollHide } from 'development-kit/use-scroll-hide';
import { type OnKeyPress, useKeyPress } from 'development-kit/use-key-press';
import { BiX } from 'react-icons/bi';
import { Button } from './button';

type ModalProps = {
  children: ReactNode;
  onEscape?: OnKeyPress;
} & Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children'
>;

const Modal = ({ className, children, onEscape, ...props }: ModalProps) => {
  useScrollHide();
  useKeyPress([`Escape`], onEscape);
  const { render } = usePortal();

  return render(
    <div
      className={c(
        `bg-black/40 dark:bg-white/20 fixed items-center justify-center flex p-4 z-20 h-[100svh] w-[100svw] left-0 top-0 overflow-auto animate-fade-in`,
        className,
      )}
      {...props}
    >
      <div className="bg-white m-auto w-[100%] tn:w-[380px] dark:bg-black rounded-lg shadow-xl p-4">
        {children}
      </div>
    </div>,
  );
};

type ModalHeaderProps = { children: ReactNode; title: ReactNode };

const ModalHeader = ({ children, title }: ModalHeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <h6 className="text-xl mr-6">{title}</h6>
      <div className="flex items-center space-x-2">
        {children}
        <Button i={2} s={1} title="Close modal" onClick={close}>
          <BiX />
        </Button>
      </div>
    </header>
  );
};

Modal.Header = ModalHeader;

export { Modal };
