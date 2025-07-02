import React, { type ReactNode } from "react";
import c from "classnames";

interface BarProps {
	className?: string;
	children: ReactNode;
}

const Bar = ({ className, children }: BarProps) => {
	return (
		<header
			className={c(
				`flex px-4 py-2 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800`,
				className,
			)}
		>
			{children}
		</header>
	);
};

export { Bar };
