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
  loading?: boolean;
}

const Tabs = ({ className, children, fit, loading }: TabsProps) => {
  const enhancedChildren = React.Children.map(
    children,
    (child: React.ReactElement<TabsItemProps>) => {
      if (!React.isValidElement(child))
        throw Error(`Passed children is not an React element`);

      return React.cloneElement(child, { ...child.props, disabled: loading });
    },
  );

  return (
    <div
      className={c(
        className,
        `relative 
        flex rounded-md [&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-r-md`,
        {
          [`w-fit`]: fit,
        },
      )}
    >
      {enhancedChildren}
      {loading && (
        <div className="absolute z-10 top-0 right-0 left-0 bottom-0 bg-slate-300/40 rounded-r-md rounded-s-md " />
      )}
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
