import React from "react";

import Backdrop from "./backdrop";
import c from "classnames";
import { Loader } from "./loader";
import { usePortal } from "development-kit/use-portal";

type ScreenLoaderProps = {
	className?: string;
};

const ScreenLoader = ({ className }: ScreenLoaderProps) => {
	const { render } = usePortal();

	return render(
		<Backdrop className="flex items-center justify-center z-40">
			<Loader size="lg" className={c(className)} />
		</Backdrop>,
	);
};

export { ScreenLoader };
