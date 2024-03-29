import React from 'react';

type EscapePressHandler = () => void;

const useOnEscapePress = (handler?: EscapePressHandler): void => {
  React.useEffect(() => {
    if (!handler) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      event.key === `Escape` && handler();
    };

    document.addEventListener(`keydown`, handleKeyDown);

    return () => {
      document.removeEventListener(`keydown`, handleKeyDown);
    };
  }, [handler]);
};

export type { EscapePressHandler };
export { useOnEscapePress };
