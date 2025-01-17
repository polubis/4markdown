import React from 'react';

type KeyCombo = string[];

const useComboPress = (combo: KeyCombo, callback: () => void) => {
  React.useEffect(() => {
    const keys = new Set<string>();

    const downHandler = (event: KeyboardEvent): void => {
      keys.add(event.key.toLowerCase());

      const isComboPressed = combo.every((key) => keys.has(key.toLowerCase()));

      if (isComboPressed) {
        callback();
      }
    };

    const upHandler = (event: KeyboardEvent): void => {
      keys.delete(event.key.toLowerCase());
    };

    window.addEventListener(`keydown`, downHandler);
    window.addEventListener(`keyup`, upHandler);

    return () => {
      window.removeEventListener(`keydown`, downHandler);
      window.removeEventListener(`keyup`, upHandler);
    };
  }, [combo, callback]);
};

export { useComboPress };
