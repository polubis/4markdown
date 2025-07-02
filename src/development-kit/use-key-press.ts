import React from "react";

type OnKeyPress = (event: KeyboardEvent) => void;

const useKeyPress = (keys: string[], onKeyPress?: OnKeyPress) => {
	const eventHandler = React.useRef<OnKeyPress>();

	eventHandler.current = (event: KeyboardEvent): void => {
		if (Array.isArray(keys) && keys.includes(event.key)) {
			onKeyPress?.(event);
		}
	};

	React.useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent): void => {
			eventHandler.current?.(event);
		};

		document.addEventListener(`keydown`, handleKeyPress);

		return () => {
			document.removeEventListener(`keydown`, handleKeyPress);
		};
	}, []);
};

export type { OnKeyPress };
export { useKeyPress };
