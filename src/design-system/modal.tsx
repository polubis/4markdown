import React, {
  type ReactNode,
  type HTMLAttributes,
  type DetailedHTMLProps,
} from 'react';
import { usePortal } from 'development-kit/use-portal';
import c from 'classnames';
import { useScrollHide } from 'development-kit/use-scroll-hide';
import { useKeyPress } from 'development-kit/use-key-press';
import { Button } from './button';
import { BiX } from 'react-icons/bi';
import { falsy } from 'development-kit/guards';

type ModalProps = {
  children: ReactNode;
  disabled?: boolean;
  onClose?(): void;
} & Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'children'
>;

type ModalContextValue = { close: ModalProps['onClose'] } & Pick<
  ModalProps,
  'disabled'
>;

const ModalContext = React.createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const ctx = React.useContext(ModalContext);

  falsy(ctx, `Lack of context wrapper for modal`);

  return ctx;
};

const Modal = ({
  className,
  children,
  disabled,
  onClose,
  ...props
}: ModalProps) => {
  const close = (): void => {
    if (disabled) return;

    onClose?.();
  };

  useScrollHide();
  useKeyPress([`Escape`], close);

  const { render } = usePortal();

  return render(
    <div
      className={c(
        `bg-black/40 dark:bg-white/20 fixed items-center justify-center flex py-4 z-20 h-[100svh] w-[100svw] left-0 top-0 overflow-auto animate-fade-in`,
        className,
      )}
      {...props}
    >
      <div className="bg-white m-auto w-[100%] tn:max-w-sm dark:bg-black rounded-lg shadow-xl p-4">
        <ModalContext.Provider
          value={{
            disabled,
            close,
          }}
        >
          {children}
        </ModalContext.Provider>
      </div>
    </div>,
  );
};

const ModalHeader = ({
  title,
  closeButtonTitle,
  children,
  className,
  skipX,
}: {
  className?: string;
  children?: ReactNode;
  title: ReactNode;
  closeButtonTitle?: string;
  skipX?: boolean;
}) => {
  const { close, disabled } = useModalContext();

  return (
    <header className={c(`flex items-center justify-between mb-6`, className)}>
      <h6 className="text-xl mr-8">{title}</h6>
      <div className="flex items-center space-x-2">
        {children}
        {skipX || (
          <Button
            i={2}
            s={1}
            aria-disabled={disabled}
            disabled={disabled}
            title={closeButtonTitle}
            className="ml-auto"
            onClick={close}
          >
            <BiX />
          </Button>
        )}
      </div>
    </header>
  );
};

Modal.Header = ModalHeader;

export { Modal };
