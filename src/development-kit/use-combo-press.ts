import React from 'react';

type OnMatch = (event: KeyboardEvent) => void;

type KeysCombo = string[];

const useComboPress = (combo: KeysCombo, onMatch: OnMatch) => {
  const pressedKeys = React.useRef(new Set<string>());
  const handleMatch = React.useRef<OnMatch>();

  handleMatch.current = (event: KeyboardEvent): void => {
    pressedKeys.current.add(event.key.toLowerCase());

    const isComboPressed = combo.every((key) =>
      pressedKeys.current.has(key.toLowerCase()),
    );

    isComboPressed && onMatch(event);
  };

  React.useEffect(() => {
    const handlePress = (event: KeyboardEvent): void => {
      handleMatch.current?.(event);
    };

    const handleUp = (event: KeyboardEvent): void => {
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

export type { OnMatch };
export { useComboPress };
