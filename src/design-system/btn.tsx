import React from 'react';
import c from 'classnames';

interface BtnProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  s: 1 | 2 | 3;
  i: 1 | 2;
  rounded?: boolean;
}

const Btn: React.FC<BtnProps> = ({
  className,
  children,
  s,
  i,
  rounded,
  ...props
}) => {
  const classes = React.useMemo(() => {
    return c(
      className,
      `flex justify-center items-center shrink-0 enabled:focus:outline outline-2 outline-black font-medium font-sans disabled:cursor-not-allowed dark:outline-white`,
      { [`h-8 w-8 text-[18px]`]: s === 1 },
      { [`h-10 w-10 text-xl`]: s === 2 },
      {
        [`disabled:text-black/30 text-black enabled:hover:bg-gray-400/20 dark:enabled:hover:bg-slate-800/50 dark:text-white dark:disabled:text-white/30`]:
          i === 1,
      },
      {
        [`disabled:bg-neutral-300/30 disabled:text-black/30 bg-gray-300 text-black enabled:hover:bg-gray-400/70 dark:bg-slate-800 dark:enabled:hover:bg-slate-800/70 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-white/30`]:
          i === 2,
      },
      rounded ? `rounded-full` : `rounded`,
    );
  }, [className, i, s, rounded]);

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};

export default Btn;
