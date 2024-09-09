import React from 'react';
import { Button } from 'design-system/button';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';
import { useKeyPress } from '@xyflow/react';
import { useViewCenter } from '../core/use-view-center';
import { BiSolidGrid } from 'react-icons/bi';

const AlignButtonContainer = () => {
  const { centerView } = useViewCenter();
  const itemsAligned = useKeyPress(`a`);

  React.useEffect(() => {
    if (itemsAligned) {
      mindmapCreatorStoreActions.alignNodes();
      centerView();
    }
  }, [itemsAligned, centerView]);

  return (
    <Button
      i={1}
      className="mb-3"
      s={2}
      title="Align items (a)"
      onClick={mindmapCreatorStoreActions.alignNodes}
    >
      <BiSolidGrid />
    </Button>
  );
};

export { AlignButtonContainer };
