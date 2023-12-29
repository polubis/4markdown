import React from 'react';
import c from 'classnames';

interface BtnProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  s: 1 | 2 | 3;
  i: 2;
  rounded?: boolean;
}

const Btn: React.FC<BtnProps> = ({ className, children, s, i, rounded }) => {
  const classes = React.useMemo(() => {
    return c(
      className,
      `flex justify-center items-center shrink-0 enabled:focus:outline outline-4 outline-black font-medium font-sans disabled:cursor-not-allowed dark:outline-white`,
      { [`h-10 w-10 text-xl`]: s === 2 },
      {
        [`disabled:bg-neutral-300/30 disabled:text-black/30 bg-gray-300 text-black enabled:hover:bg-gray-400/70 dark:bg-slate-800 dark:enabled:hover:bg-slate-800/70 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-white/30`]:
          i === 2,
      },
      rounded ? `rounded-full` : `rounded`,
    );
  }, [className, i, s, rounded]);

  return <button className={classes}>{children}</button>;
};

export default Btn;
