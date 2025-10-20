import React from "react";
import { c } from "./c";
import { Button } from "./button";

type ErrorProps = React.ComponentPropsWithoutRef<"div">;
type ErrorIconProps = React.ComponentPropsWithoutRef<"div">;
type ErrorTitleProps = React.ComponentPropsWithoutRef<"h3">;
type ErrorDescriptionProps = React.ComponentPropsWithoutRef<"p">;
type ErrorActionProps = React.ComponentPropsWithoutRef<typeof Button>;

const Error = ({ className, children, ...props }: ErrorProps) => {
  return (
    <div
      className={c(
        `flex flex-col justify-center items-center py-12 px-4`,
        className,
      )}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <div className="flex flex-col items-center max-w-md text-center">
        {children}
      </div>
    </div>
  );
};

const ErrorIcon = ({ className, children, ...props }: ErrorIconProps) => {
  return (
    <div
      className={c(`mb-6 text-red-400 dark:text-red-500`, className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  );
};

const ErrorTitle = ({ className, children, ...props }: ErrorTitleProps) => {
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

const ErrorDescription = ({
  className,
  children,
  ...props
}: ErrorDescriptionProps) => {
  return (
    <p
      className={c(`text-sm text-gray-500 dark:text-gray-400 mb-6`, className)}
      {...props}
    >
      {children}
    </p>
  );
};

const ErrorAction = Button;

Error.Icon = ErrorIcon;
Error.Title = ErrorTitle;
Error.Description = ErrorDescription;
Error.Action = ErrorAction;

export type {
  ErrorProps,
  ErrorIconProps,
  ErrorTitleProps,
  ErrorDescriptionProps,
  ErrorActionProps,
};
export { Error };
