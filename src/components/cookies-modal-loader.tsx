import { useOnFirstInteraction } from "development-kit/use-on-first-interaction";
import React from "react";

const CookiesModal = React.lazy(() =>
	import(`./cookies-modal`).then((m) => ({
		default: m.CookiesModal,
	})),
);

const CookiesModalLoader = () => {
	const { interacted } = useOnFirstInteraction();

	if (interacted)
		return (
			<React.Suspense>
				<CookiesModal />
			</React.Suspense>
		);
};

export { CookiesModalLoader };
