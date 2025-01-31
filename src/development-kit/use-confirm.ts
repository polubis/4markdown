import React from 'react';
import { useSimpleFeature } from '@greenonsoftware/first-class-hooks';

const useConfirm = (action: () => void) => {
  const toggler = useSimpleFeature();
  const timeout = React.useRef<null | any>(null);

  const cleanTimeouts = (): void => {
    const t = timeout.current;

    t && clearTimeout(t);
  };

  const confirm = (): void => {
    cleanTimeouts();

    if (toggler.isOn) {
      action();
      toggler.off();
      return;
    }

    toggler.on();

    timeout.current = setTimeout(() => {
      toggler.off();
    }, 4000);
  };

  React.useEffect(() => {
    return () => {
      cleanTimeouts();
    };
  }, []);

  return {
    ...toggler,
    confirm,
  };
};

export { useConfirm };
