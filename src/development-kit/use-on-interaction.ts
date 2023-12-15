import React from 'react';

const useOnInteraction = () => {
  const [interacted, setInteracted] = React.useState(false);

  React.useEffect(() => {
    if (interacted) return;

    const listener = (): void => {
      setInteracted(true);
    };

    window.addEventListener(`mousemove`, listener);
    window.addEventListener(`touchstart`, listener);

    return () => {
      window.removeEventListener(`touchstart`, listener);
      window.removeEventListener(`mousemove`, listener);
    };
  }, [interacted]);

  return interacted;
};

export { useOnInteraction };
