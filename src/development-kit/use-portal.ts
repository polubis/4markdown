import React, { type ReactNode, type ReactPortal } from "react";
import { createPortal } from "react-dom";
import { isServer } from "./ssr-csr";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

type RenderPortal = (children: ReactNode) => ReactPortal | null;

type UsePortal = () => {
	render: RenderPortal;
};

const usePortal: UsePortal = () => {
	const wrapper = React.useMemo(
		() => (isServer() ? null : document.createElement(`div`)),
		[],
	);

	useIsomorphicLayoutEffect(() => {
		if (!wrapper) return;

		document.body.appendChild(wrapper);

		return () => {
			document.body.removeChild(wrapper);
		};
	}, []);

	return {
		render: (children) => (wrapper ? createPortal(children, wrapper) : null),
	};
};

export { usePortal };
