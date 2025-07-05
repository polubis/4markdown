import React, {
	type ReactNode,
	type HTMLAttributes,
	type DetailedHTMLProps,
} from "react";
import { usePortal } from "development-kit/use-portal";
import { useScrollHide } from "development-kit/use-scroll-hide";
import { useKeyPress } from "development-kit/use-key-press";
import { Button } from "./button";
import { BiX } from "react-icons/bi";
import { context } from "@greenonsoftware/react-kit";
import { c } from "./c";

type ModalProps = {
	children: ReactNode;
	disabled?: boolean;
	onClose?(): void;
} & Omit<
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	"children"
>;

const [ModalProvider, useModalContext] = context(
	(props: { disabled?: boolean; close(): void }) => props,
);

const Modal = ({
	className,
	children,
	disabled,
	onClose,
	...props
}: ModalProps) => {
	const ref = React.useRef<HTMLDivElement | null>(null);

	const close = (): void => {
		if (disabled) return;

		onClose?.();
	};

	useScrollHide();
	useKeyPress([`Escape`], close);

	const { render } = usePortal();

	React.useEffect(() => {
		ref.current?.focus();
	}, []);

	return render(
		<ModalProvider disabled={disabled} close={close}>
			<div
				ref={ref}
				tabIndex={-1}
				aria-modal
				role="dialog"
				className={c(
					`bg-black/40 dark:bg-white/20 fixed z-20 inset-0 flex justify-center`,
					"items-end pt-20 md:animate-fade-in md:py-4 md:inset-0 md:items-center",
					"[&>*]:rounded-tl-lg [&>*]:rounded-tr-lg md:[&>*]:rounded-lg",
					className,
				)}
				{...props}
			>
				<div className="bg-white max-h-full w-full tn:max-w-sm dark:bg-black shadow-xl grid grid-rows-[auto_1fr_auto] animate-slide-in-bottom md:animate-none">
					{children}
				</div>
			</div>
		</ModalProvider>,
	);
};

const ModalHeader = ({
	title,
	closeButtonTitle,
	children,
	className,
	skipX,
}: {
	className?: string;
	children?: ReactNode;
	title: ReactNode;
	closeButtonTitle?: string;
	skipX?: boolean;
}) => {
	const { close, disabled } = useModalContext();

	return (
		<header
			className={c(
				`flex items-center justify-between p-4 border-b border-zinc-300 dark:border-zinc-800`,
				className,
			)}
		>
			<h6 className="text-xl mr-8">{title}</h6>
			<div className="flex items-center space-x-2">
				{children}
				{skipX || (
					<Button
						i={2}
						s={1}
						aria-disabled={disabled}
						disabled={disabled}
						title={closeButtonTitle}
						className="ml-auto"
						onClick={close}
					>
						<BiX />
					</Button>
				)}
			</div>
		</header>
	);
};

const ModalBody = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<section className={c(`overflow-y-auto p-4`, className)}>
			{children}
		</section>
	);
};

const ModalFooter = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return (
		<footer
			className={c(
				`p-4 border-t border-zinc-300 dark:border-zinc-800`,
				className,
			)}
		>
			{children}
		</footer>
	);
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal as Modal2 };
