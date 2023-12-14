import React from 'react';
import { useToggle } from './use-toggle';

const useConfirm = (action: () => void) => {
  const toggler = useToggle();
  const timeout = React.useRef<null | any>(null);

  const cleanTimeouts = (): void => {
    const t = timeout.current;

    t && clearTimeout(t);
  };

  const confirm = (): void => {
    cleanTimeouts();

    if (toggler.opened) {
      action();
      toggler.close();
      return;
    }

    toggler.open();

    timeout.current = setTimeout(() => {
      toggler.close();
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
