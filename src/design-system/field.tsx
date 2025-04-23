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
      {` `}
      {trimmed.length > 0 && `(${trimmed.length})`}
      {required && `*`}
    </>
  );
};

Field.Label = Label;

export { Field };
