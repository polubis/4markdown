import { useReactFlow } from '@xyflow/react';
import React from 'react';
import { mindmapsCreatorStoreSelectors } from 'store/mindmaps-creator/mindmaps-creator.store';

const useViewCenter = () => {
  const { fitView } = useReactFlow();

  const centerView = React.useCallback(() => {
    const {
      settings: { autoFit },
    } = mindmapsCreatorStoreSelectors.ok();

    if (autoFit) {
      window.requestAnimationFrame(() => {
        fitView();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { centerView };
};

export { useViewCenter };
