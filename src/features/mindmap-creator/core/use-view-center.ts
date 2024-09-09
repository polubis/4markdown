import { useReactFlow } from '@xyflow/react';
import React from 'react';

const useViewCenter = () => {
  const { fitView } = useReactFlow();

  const centerView = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      fitView();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { centerView };
};

export { useViewCenter };
