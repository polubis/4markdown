import React from 'react';
import c from 'classnames';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  variant: 'info' | 'casual' | 'error' | 'warn';
}

interface AlertMessageProps {
  className?: string;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<AlertProps['variant'], string> = {
  error: `bg-red-400 [&>*]:text-black`,
  info: `bg-gray-400 [&>*]:text-black`,
  casual: `bg-gray-300 [&>*]:text-black`,
  warn: `bg-yellow-500 [&>*]:text-black`,
};

const Alert = ({ className, children, variant }: AlertProps) => {
  return (
    <div
      className={c(
        className,
        `px-3 py-2 rounded-md shadow-xl`,
        VARIANT_CLASSES[variant],
      )}
    >
      {children}
    </div>
  );
};

const AlertMessage = ({ className, children }: AlertMessageProps) => {
  return <p className={c(className, `font-medium`)}>{children}</p>;
};

Alert.Message = AlertMessage;

export default Alert;
