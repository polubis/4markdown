import c from "classnames";
import React, { type ReactNode } from "react";
import { Button, type ButtonProps } from "./button";

const Communicate = ({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) => {
	return (
		<div className={c(`flex flex-col justify-center items-center`, className)}>
			<div className="p-4 flex flex-col items-center max-w-[420px]">
				{children}
			</div>
		</div>
	);
};

const CommunicateAction = ({
	className,
	title,
	children,
	onClick,
}: Pick<ButtonProps, "className" | "title" | "children" | "onClick">) => {
	return (
		<Button
			className={className}
			title={title}
			auto
			s={2}
			i={2}
			onClick={onClick}
		>
			{children}
		</Button>
	);
};

const CommunicateFooter = ({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) => {
	return (
		<div className={c(`flex items-center space-x-3 mt-4`, className)}>
			{children}
		</div>
	);
};

const CommunicateMessage = ({ children }: { children: ReactNode }) => {
	return <h6 className="text-xl text-center">{children}</h6>;
};

Communicate.Action = CommunicateAction;
Communicate.Message = CommunicateMessage;
Communicate.Footer = CommunicateFooter;

export { Communicate };
