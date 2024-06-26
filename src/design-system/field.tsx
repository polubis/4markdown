import React from 'react';
import c from 'classnames';
import { Hint } from './hint';

interface FieldProps {
  className?: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  hint?: React.ReactNode;
}

const Field = ({ children, className, label, hint }: FieldProps) => {
  return (
    <fieldset className={c(`flex flex-col gap-1.5`, className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      {children}
      {hint && <Hint className="px-0.5" trigger={() => hint} />}
    </fieldset>
  );
};

export { Field };
