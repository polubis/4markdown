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
        `node-tile flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:bg-gray-950 w-[280px]`,
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
// eslint-disable-next-line react/display-name
NodeTile.Toolbox = ({ children }: { children: ReactNode }) => {
  return (
    <div className="node-tile-toolbox absolute top-2 right-2">{children}</div>
  );
};

export { NodeTile };
