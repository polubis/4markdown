import React, { type ReactNode } from "react";
import c from "classnames";

interface FieldProps {
  className?: string;
  children: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
}

const Field = ({ children, className, label, hint }: FieldProps) => {
  return (
    <fieldset className={c(`flex flex-col gap-1.5`, className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      {children}
      {hint}
    </fieldset>
  );
};

type HintProps = React.ComponentPropsWithoutRef<"i">;

const Hint = ({ children, className, ...props }: HintProps) => {
  return (
    <i className={c(`text-sm`, className)} {...props}>
      {children}
    </i>
  );
};

type ErrorProps = React.ComponentPropsWithoutRef<"i">;

const Error = ({ children, className, ...props }: ErrorProps) => {
  return (
    <i
      className={c(`text-sm text-red-700 dark:text-red-300`, className)}
      {...props}
    >
      {children}
    </i>
  );
};

const Label = ({
  label,
  value,
  required,
}: {
  label: string;
  value: string;
  required?: boolean;
}) => {
  const trimmed = value.trim();

  return (
    <>
      {label}
      {trimmed.length > 0 && ` (${trimmed.length})`}
      {required && `*`}
    </>
  );
};

Field.Label = Label;
Field.Hint = Hint;
Field.Error = Error;

export { Field };
