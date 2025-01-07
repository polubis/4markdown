import React from 'react';
import { observeFirstInteraction } from './observe-first-interaction';

const useOnFirstInteraction = (): { interacted: boolean } => {
  const [interacted, setInteracted] = React.useState(false);

  React.useEffect(() => {
    const { unobserve } = observeFirstInteraction(() => setInteracted(true));

    return () => {
      unobserve();
    };
  }, []);

  return { interacted };
};

export { useOnFirstInteraction };
