import React, { ButtonHTMLAttributes } from "react";
import { c } from "./c";

interface Tabs2Props {
  children: React.ReactNode;
  className?: string;
}

const Tabs2 = ({ children, className }: Tabs2Props) => {
  return (
    <div
      className={c(
        "flex w-full [&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-r-md",
        className,
      )}
    >
      {children}
    </div>
  );
};

type Tabs2ItemProps = {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Tabs2Item = ({ active, className, ...props }: Tabs2ItemProps) => {
  return (
    <button
      className={c(
        `flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-3`,
        {
          [`bg-green-700 disabled:bg-green-700/30 text-white cursor-auto disabled:text-white/60 dark:disabled:text-white/30`]:
            active,
        },
        {
          [`enabled:hover:bg-gray-400/70 dark:enabled:hover:bg-slate-800/70 dark:bg-slate-800 bg-gray-300 text-black dark:text-white disabled:bg-neutral-300/30 disabled:text-black/30 dark:disabled:bg-gray-900 dark:disabled:text-white/30`]:
            !active,
        },
        className,
      )}
      {...props}
    />
  );
};

const Tabs2ItemText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={c("truncate block min-w-0 font-medium", className)}>
      {children}
    </span>
  );
};

Tabs2.Item = Tabs2Item;
Tabs2.ItemText = Tabs2ItemText;

export { Tabs2 };
