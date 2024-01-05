import React from 'react';
import c from 'classnames';

interface TabsItemProps {
  active?: boolean;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement | React.ReactElement[];
  fit?: boolean;
}

const Tabs = ({ children, fit }: TabsProps) => {
  return (
    <div
      className={c(
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

const Item = ({ children, active }: TabsItemProps) => {
  return (
    <button
      className={c(
        `font-medium flex-1 py-2 px-3 disabled:bg-neutral-300/30 disabled:text-black/30 bg-gray-300 text-black enabled:hover:bg-gray-400/70 dark:bg-slate-800 dark:enabled:hover:bg-slate-800/70 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-white/30`,
      )}
    >
      {children}
    </button>
  );
};

Tabs.Item = Item;

export { Tabs };
