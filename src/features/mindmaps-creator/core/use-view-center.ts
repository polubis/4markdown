import { useReactFlow } from '@xyflow/react';
import React from 'react';
import { mindmapsCreatorStoreSelectors } from 'store/mindmaps-creator/mindmaps-creator.store';

const useViewCenter = () => {
  const { fitView } = useReactFlow();

  const centerView = React.useCallback(() => {
    window.requestAnimationFrame(() => {
      fitView();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const centerViewWhenSafe = React.useCallback(() => {
    const {
      saving,
      settings: { autoFit },
    } = mindmapsCreatorStoreSelectors.ok();

    if (!autoFit || saving.is === `busy`) return;

    centerView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerView]);

  return { centerViewWhenSafe, centerView };
};

export { useViewCenter };
