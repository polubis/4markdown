import React, { type ReactNode } from 'react';
import c from 'classnames';

const NodeTile = ({
  selected,
  children,
}: {
  selected: boolean;
  children: ReactNode;
}) => {
  return (
    <div
      className={c(
        `flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 w-[280px]`,
        selected
          ? `border-black dark:border-white`
          : `border-zinc-300 dark:border-zinc-800`,
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
  return (
    <p className="text-sm capitalize mb-0.5 italic line-clamp-4">{children}</p>
  );
};

// eslint-disable-next-line react/display-name
NodeTile.Description = ({ children }: { children: ReactNode }) => {
  return <p className="mt-1">{children}</p>;
};

export { NodeTile };
