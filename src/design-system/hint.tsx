import React, { type ReactNode, type ComponentType } from "react";
import { Modal } from "./modal";
import c from "classnames";
import { useSimpleFeature } from "@greenonsoftware/react-kit";

type SimpleFeature = ReturnType<typeof useSimpleFeature>;

interface HintProps {
	className?: string;
	content?: ComponentType<SimpleFeature>;
	trigger: ComponentType<SimpleFeature> | ReactNode;
}

const Hint = ({ className, trigger: Trigger, content: Content }: HintProps) => {
	const toggler = useSimpleFeature();

	return (
		<>
			<i className={c(`text-sm`, className)}>
				{typeof Trigger === `function` ? <Trigger {...toggler} /> : Trigger}
			</i>
			{toggler.isOn && Content && (
				<Modal onClose={toggler.off}>
					<Content {...toggler} />
				</Modal>
			)}
		</>
	);
};

export type { HintProps };
export { Hint };
