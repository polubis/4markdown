import React from "react";
import { c } from "./c";
import { Button } from "./button";

const Err = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
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

const ErrIcon = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
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

const ErrTitle = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"h3">) => {
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

const ErrDescription = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p">) => {
  return (
    <p
      className={c(`text-sm text-gray-500 dark:text-gray-400 mb-6`, className)}
      {...props}
    >
      {children}
    </p>
  );
};

const ErrAction = Button;

Err.Icon = ErrIcon;
Err.Title = ErrTitle;
Err.Description = ErrDescription;
Err.Action = ErrAction;

export { Err };
