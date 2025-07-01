import c from "classnames";
import React, {
	type ButtonHTMLAttributes,
	type DetailedHTMLProps,
	type ReactElement,
} from "react";

interface TabsItemProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	active?: boolean;
}

interface TabsProps {
	className?: string;
	children: ReactElement | ReactElement[];
	fit?: boolean;
}

const Tabs = ({ className, children, fit }: TabsProps) => {
	return (
		<div
			className={c(
				className,
				`relative 
        flex [&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-r-md`,
				{
					[`w-fit`]: fit,
				},
			)}
		>
			{children}
		</div>
	);
};

const Item = ({ active, className, ...props }: TabsItemProps) => {
	return (
		<button
			className={c(
				`font-medium flex-1 py-2 px-3`,
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

Tabs.Item = Item;

export { Tabs };
