import React, { type ReactNode } from "react";
import c from "classnames";
import Backdrop from "./backdrop";

interface PopoverProps {
  className: string;
  children: ReactNode;
  onBackdropClick?(): void;
}

const Popover = ({ className, children, onBackdropClick }: PopoverProps) => {
  return (
    <>
      <div
        className={c(
          `fixed rounded-xl bg-zinc-200 dark:bg-gray-950 shadow-lg z-30 p-4 animate-fade-in`,
          className,
        )}
      >
        {children}
      </div>
      <Backdrop onClick={onBackdropClick} />
    </>
  );
};

export default Popover;
