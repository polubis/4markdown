import React, { type ReactNode } from 'react';
import c from 'classnames';

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

export { Field };
