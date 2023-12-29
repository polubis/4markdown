import React from 'react';
import c from 'classnames';

interface IconButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  s: 1 | 2 | 3;
  i: 2;
}

const IconButton: React.FC<IconButtonProps> = ({
  className,
  children,
  s,
  i,
}) => {
  return (
    <button
      className={c(
        className,
        `flex justify-center items-center shrink-0 rounded enabled:focus:outline outline-4 outline-black font-medium font-sans text-xl disabled:cursor-not-allowed dark:outline-white`,
        { [`h-[40px] w-[40px]`]: s === 1 },
        {
          [`disabled:bg-neutral-300/30 disabled:text-black/30 bg-gray-300 text-black enabled:hover:bg-gray-400/70 dark:bg-slate-800 dark:enabled:hover:bg-slate-800/70 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-white/30`]:
            i === 2,
        },
      )}
    >
      {children}
    </button>
  );
};

export default IconButton;
