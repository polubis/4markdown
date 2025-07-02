import React, { type ReactNode } from "react";
import c from "classnames";

interface BackdropProps {
	className?: string;
	children?: ReactNode;
	onClick?(): void;
}

const Backdrop = ({ className, children, onClick }: BackdropProps) => {
	return (
		<div
			className={c(
				`fixed z-10 top-0 left-0 right-0 bottom-0 bg-black/40 dark:bg-white/20 animate-fade-in`,
				className,
			)}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

export default Backdrop;
