import React from 'react';
import c from 'classnames';

interface TabsItemProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  active?: boolean;
}

interface TabsProps {
  className?: string;
  children: React.ReactElement | React.ReactElement[];
  fit?: boolean;
}

const Tabs = ({ className, children, fit }: TabsProps) => {
  return (
    <div
      className={c(
        className,
        `flex rounded-md [&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-r-md`,
        {
          [`w-fit`]: fit,
        },
      )}
    >
      {children}
    </div>
  );
};

const Item = ({ active, ...props }: TabsItemProps) => {
  return (
    <button
      className={c(
        `font-medium flex-1 py-2 px-3 disabled:bg-neutral-300/30 disabled:text-black/30 dark:disabled:bg-gray-900 dark:disabled:text-white/30`,
        { [`bg-green-400`]: active },
        {
          [`enabled:hover:bg-gray-400/70 dark:enabled:hover:bg-slate-800/70 dark:bg-slate-800 bg-gray-300 text-black dark:text-white`]:
            !active,
        },
      )}
      {...props}
    />
  );
};

Tabs.Item = Item;

export { Tabs };
