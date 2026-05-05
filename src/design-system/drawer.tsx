import React, {
  type ReactNode,
  type HTMLAttributes,
  type DetailedHTMLProps,
} from "react";
import { usePortal } from "development-kit/use-portal";
import { useScrollHide } from "development-kit/use-scroll-hide";
import { useKeyPress } from "development-kit/use-key-press";
import { Button } from "./button";
import { BiX } from "react-icons/bi";
import { context } from "@greenonsoftware/react-kit";
import { c } from "./c";

type DrawerProps = {
  children: ReactNode;
  disabled?: boolean;
  onClose?(): void;
} & Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "children"
>;

const [DrawerProvider, useDrawerContext] = context(
  (props: { disabled?: boolean; close(): void }) => props,
);

const Drawer = ({
  className,
  children,
  disabled,
  onClose,
  ...props
}: DrawerProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const close = (): void => {
    if (disabled) return;

    onClose?.();
  };

  useScrollHide();
  useKeyPress([`Escape`], close);

  const { render } = usePortal();

  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  return render(
    <DrawerProvider disabled={disabled} close={close}>
      <div
        ref={ref}
        tabIndex={-1}
        aria-modal
        role="dialog"
        className={c(
          `fixed z-20 inset-0 flex justify-end items-stretch`,
          `motion-safe:sm:animate-fade-in`,
          className,
        )}
        {...props}
      >
        <div
          className={c(
            `absolute inset-0 bg-black/40 dark:bg-white/20`,
            `motion-safe:transition-opacity motion-safe:duration-200`,
            `motion-reduce:transition-none`,
          )}
          aria-hidden="true"
          onClick={close}
        />
        <div
          className={c(
            `relative z-10 flex h-full max-h-full w-full max-w-[min(100vw,440px)]`,
            `bg-white dark:bg-black shadow-xl border-l border-zinc-300 dark:border-zinc-800`,
            `grid grid-rows-[auto_1fr_auto] overflow-hidden`,
            `motion-safe:animate-slide-in-right motion-reduce:animate-none`,
            `overscroll-y-contain touch-manipulation`,
          )}
        >
          {children}
        </div>
      </div>
    </DrawerProvider>,
  );
};

const DrawerHeader = ({
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
  const { close, disabled } = useDrawerContext();

  return (
    <header
      className={c(
        `grid items-center gap-6 grid-cols-[1fr_auto] p-4 border-b border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0`,
        className,
      )}
    >
      <h2 className="text-xl font-semibold text-pretty truncate min-w-0">
        {title}
      </h2>
      <div className="flex items-center space-x-2">
        {children}
        {skipX || (
          <Button
            i={2}
            s={1}
            aria-label={closeButtonTitle ?? `Close drawer`}
            aria-disabled={disabled}
            disabled={disabled}
            title={closeButtonTitle ?? `Close`}
            className="ml-auto"
            onClick={close}
          >
            <BiX aria-hidden="true" />
          </Button>
        )}
      </div>
    </header>
  );
};

const DrawerBody = ({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section
      id={id}
      className={c(
        `overflow-y-auto overflow-x-hidden p-4 min-h-0 overscroll-y-contain`,
        className,
      )}
    >
      {children}
    </section>
  );
};

const DrawerFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <footer
      className={c(
        `flex items-center p-4 border-t border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0`,
        className,
      )}
    >
      {children}
    </footer>
  );
};

Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

export { Drawer };
