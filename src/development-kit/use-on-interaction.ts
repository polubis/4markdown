import React from 'react';

const useOnInteraction = () => {
  const [interacted, setInteracted] = React.useState(false);

  React.useEffect(() => {
    if (interacted) return;

    setInteracted(true);
  }, [interacted]);

  return interacted;
};

export { useOnInteraction };
