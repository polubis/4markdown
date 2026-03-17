import { c } from "design-system/c";
import React, { type ReactNode } from "react";

const NodeTile = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <article
      className={c(
        "border-zinc-300 dark:border-zinc-800 node-tile cursor-move flex flex-col border-2 rounded-lg bg-zinc-200 dark:bg-gray-950 w-[280px] overflow-hidden",
        className,
      )}
    >
      {children}
    </article>
  );
};

// eslint-disable-next-line react/display-name
NodeTile.Name = ({ children }: { children: ReactNode }) => {
  return <h3 className="font-bold px-4 pt-3 min-w-0">{children}</h3>;
};
// eslint-disable-next-line react/display-name
NodeTile.Label = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-sm capitalize mb-0.5 italic px-4 pt-3 min-w-0 text-zinc-500 dark:text-zinc-400">
      {children}
    </p>
  );
};

// eslint-disable-next-line react/display-name
NodeTile.Description = ({ children }: { children: ReactNode }) => {
  return <p className="mt-1 px-4 min-w-0 break-words">{children}</p>;
};

// eslint-disable-next-line react/display-name
NodeTile.Actions = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-end gap-1 px-1 py-1 mt-1 min-w-0">
      {children}
    </div>
  );
};

export { NodeTile };
