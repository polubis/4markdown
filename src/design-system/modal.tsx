import React, {
  type ReactNode,
  type HTMLAttributes,
  type DetailedHTMLProps,
} from 'react';
import { usePortal } from 'development-kit/use-portal';
import c from 'classnames';
import { useScrollHide } from 'development-kit/use-scroll-hide';
import { type OnKeyPress, useKeyPress } from 'development-kit/use-key-press';

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
      <div className="bg-white m-auto w-[100%] tn:max-w-sm dark:bg-black rounded-lg shadow-xl p-4">
        {children}
      </div>
    </div>,
  );
};

export { Modal };
