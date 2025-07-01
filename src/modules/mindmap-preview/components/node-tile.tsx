import React, { type ReactNode } from "react";
import c from "classnames";

const NodeTile = ({
	children,
	selected,
}: {
	children: ReactNode;
	selected: boolean;
}) => {
	return (
		<div
			className={c(
				`node-tile cursor-move flex flex-col border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:bg-gray-950 w-[280px]`,
				selected
					? `border-black dark:border-white`
					: `border-zinc-300 dark:border-zinc-800`,
			)}
		>
			{children}
		</div>
	);
};

NodeTile.Name = ({ children }: { children: ReactNode }) => {
	return <h6 className="font-bold line-clamp-2">{children}</h6>;
};
NodeTile.Label = ({ children }: { children: ReactNode }) => {
	return <p className="text-sm capitalize mb-0.5 italic">{children}</p>;
};

NodeTile.Description = ({ children }: { children: ReactNode }) => {
	return <p className="mt-1 line-clamp-4">{children}</p>;
};
NodeTile.Toolbox = ({ children }: { children: ReactNode }) => {
	return (
		<div className="node-tile-toolbox flex items-center space-x-1 absolute top-2 right-2">
			{children}
		</div>
	);
};

export { NodeTile };
