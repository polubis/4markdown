import React from 'react';
import c from 'classnames';

interface SwitchProps {
  className?: string;
  disabled?: boolean;
  active?: boolean;
  title: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Switch: React.FC<SwitchProps> = ({
  className,
  disabled,
  active,
  title,
  onChange,
}) => {
  const id = React.useId();

  return (
    <div className="relative">
      <div
        className={c(
          className,
          `rounded-full w-16 py-2 px-2 shrink-0 bg-gray-300 text-black dark:bg-slate-800 dark:text-white`,
          {
            'bg-neutral-300/30 text-black/30 dark:bg-gray-900 dark:text-white/30':
              disabled,
          },
          {
            'dark:hover:bg-slate-800/70 hover:bg-gray-400/70': !disabled,
          },
        )}
      >
        <div
          className={c(
            `w-6 h-6 rounded-full transition-transform shadow-2xl bg-white`,
            {
              'translate-x-6': active,
            },
          )}
        />
      </div>
      <input
        id={id}
        className="opacity-0 rounded-full absolute top-0 right-0 w-full h-full disabled:cursor-not-allowed cursor-pointer"
        type="checkbox"
        disabled={disabled}
        title={title}
        checked={active}
        onChange={onChange}
      />
      <label className="opacity-0 absolute" htmlFor={id}>
        <button />
      </label>
    </div>
  );
};

export default Switch;
