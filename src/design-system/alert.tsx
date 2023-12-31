import React from 'react';
import c from 'classnames';
import { BiError, BiInfinite, BiInfoCircle, BiX } from 'react-icons/bi';
import type { IconBaseProps } from 'react-icons';
import Btn from './btn';

interface AlertProps {
  className?: string;
  children: React.ReactNode;
  variant: 'info' | 'casual' | 'error' | 'warn';
  onClose?(): void;
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

const VARIANT_ICONS: Record<
  AlertProps['variant'],
  React.FunctionComponent<IconBaseProps>
> = {
  error: BiError,
  info: BiInfoCircle,
  casual: BiInfoCircle,
  warn: BiInfinite,
};

const Alert = ({ className, children, variant, onClose }: AlertProps) => {
  const Icon = VARIANT_ICONS[variant];

  return (
    <div
      className={c(
        className,
        `px-3 py-2 rounded-md shadow-xl max-w-[300px]`,
        VARIANT_CLASSES[variant],
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="text-2xl" />
        {children}
        <Btn
          type="button"
          className="ml-auto text-black dark:text-black outline-black dark:outline-black enabled:hover:bg-slate-800/20 enabled:dark:hover:bg-slate-800/20"
          i={1}
          s={1}
          rounded
          title="Close alert"
          onClick={onClose}
        >
          <BiX className="text-2xl" />
        </Btn>
      </div>
    </div>
  );
};

const AlertMessage = ({ className, children }: AlertMessageProps) => {
  return (
    <p className={c(className, `font-medium text-black dark:text-black`)}>
      {children}
    </p>
  );
};

Alert.Message = AlertMessage;

export default Alert;
