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
    <div
      className={c(
        "border-zinc-300 dark:border-zinc-800 node-tile cursor-move flex flex-col border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:bg-gray-950 w-[280px]",
        className,
      )}
    >
      {children}
    </div>
  );
};

// eslint-disable-next-line react/display-name
NodeTile.Name = ({ children }: { children: ReactNode }) => {
  return <h6 className="font-bold line-clamp-2">{children}</h6>;
};
// eslint-disable-next-line react/display-name
NodeTile.Label = ({ children }: { children: ReactNode }) => {
  return <p className="text-sm capitalize mb-0.5 italic">{children}</p>;
};

// eslint-disable-next-line react/display-name
NodeTile.Description = ({ children }: { children: ReactNode }) => {
  return <p className="mt-1 line-clamp-4">{children}</p>;
};

// eslint-disable-next-line react/display-name
NodeTile.Toolbox = ({ children }: { children: ReactNode }) => {
  return (
    <div className="node-tile-toolbox flex items-center space-x-2 absolute top-2 right-2">
      {children}
    </div>
  );
};

export { NodeTile };
