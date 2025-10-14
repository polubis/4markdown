import React from "react";
import { c } from "./c";

type EmptyProps = React.ComponentPropsWithoutRef<"div">;
type EmptyIconProps = React.ComponentPropsWithoutRef<"div">;
type EmptyTitleProps = React.ComponentPropsWithoutRef<"h3">;
type EmptyDescriptionProps = React.ComponentPropsWithoutRef<"p">;
type EmptyActionProps = React.ComponentPropsWithoutRef<"div">;

const Empty = ({ className, children, ...props }: EmptyProps) => {
  return (
    <div
      className={c(
        `flex flex-col justify-center items-center py-12 px-4`,
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center max-w-md text-center">
        {children}
      </div>
    </div>
  );
};

const EmptyIcon = ({ className, children, ...props }: EmptyIconProps) => {
  return (
    <div
      className={c(`mb-6 text-gray-400 dark:text-gray-500`, className)}
      {...props}
    >
      {children}
    </div>
  );
};

const EmptyTitle = ({ className, children, ...props }: EmptyTitleProps) => {
  return (
    <h3
      className={c(
        `text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2`,
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

const EmptyDescription = ({
  className,
  children,
  ...props
}: EmptyDescriptionProps) => {
  return (
    <p
      className={c(`text-sm text-gray-500 dark:text-gray-400 mb-6`, className)}
      {...props}
    >
      {children}
    </p>
  );
};

const EmptyAction = ({ className, children, ...props }: EmptyActionProps) => {
  return (
    <div className={c(`flex justify-center`, className)} {...props}>
      {children}
    </div>
  );
};

// Compound component pattern
Empty.Icon = EmptyIcon;
Empty.Title = EmptyTitle;
Empty.Description = EmptyDescription;
Empty.Action = EmptyAction;

export type {
  EmptyProps,
  EmptyIconProps,
  EmptyTitleProps,
  EmptyDescriptionProps,
  EmptyActionProps,
};
export { Empty };
