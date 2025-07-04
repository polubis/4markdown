import React from "react";

type KeysCombo = string[];

type OnMatch = (key: KeysCombo[number]) => void;

const useComboPress = (combo: KeysCombo, onMatch: OnMatch) => {
	const pressedKeys = React.useRef(new Set<string>());
	const handleMatch = React.useRef(onMatch);

	React.useEffect(() => {
		handleMatch.current = (key: string): void => {
			pressedKeys.current.add(key);

			const isComboPressed = combo.every((key) => pressedKeys.current.has(key));

			isComboPressed && onMatch(key);
		};
	}, [combo, onMatch]);

	React.useEffect(() => {
		const handlePress = (event: KeyboardEvent): void => {
			if (!event.key) return;

			handleMatch.current!(event.key.toLowerCase());
		};

		const handleUp = (event: KeyboardEvent): void => {
			if (!event.key) return;

			pressedKeys.current.delete(event.key.toLowerCase());
		};

		window.addEventListener(`keydown`, handlePress);
		window.addEventListener(`keyup`, handleUp);

		return () => {
			window.removeEventListener(`keydown`, handlePress);
			window.removeEventListener(`keyup`, handleUp);
		};
	}, []);
};

export { useComboPress };
