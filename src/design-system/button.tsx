import React from 'react';
import c from 'classnames';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  i: 2;
  wfull?: boolean;
  rfull?: boolean;
  overlay?: string;
}

const classes = `px-4 py-2 relative shrink-0 rounded enabled:focus:outline outline-4 outline-black font-medium font-sans text-medium disabled:cursor-not-allowed outline-black dark:outline-white`;

const Button: React.FC<ButtonProps> = ({
  className,
  wfull,
  i,
  rfull,
  overlay,
  children,
  ...props
}) => {
  const roundedClass = { 'rounded-full': rfull };

  const combinedClasses = c(
    className,
    classes,
    { 'w-full': wfull },
    roundedClass,
  );

  return (
    <button
      className={c(combinedClasses, {
        [`disabled:bg-neutral-300/30 disabled:text-black/30 bg-gray-300 text-black enabled:hover:bg-gray-400/70 dark:bg-slate-800 dark:enabled:hover:bg-slate-800/70 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-white/30`]:
          i === 2,
      })}
      {...props}
    >
      {children}
      {overlay && (
        <div
          className={c(
            `absolute left-0 bottom-0 h-full w-full bg-inherit text-xs flex justify-center items-center`,
            roundedClass,
          )}
        >
          <span>{overlay}</span>
        </div>
      )}
    </button>
  );
};

export { Button };
