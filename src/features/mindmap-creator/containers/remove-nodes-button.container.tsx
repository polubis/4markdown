import React from 'react';
import { Button } from 'design-system/button';
import { BiTrash } from 'react-icons/bi';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';
import { useKeyPress } from '@xyflow/react';

const RemoveNodesButtonContainer = () => {
  const nodesRemovedPressed = useKeyPress(`d`);

  React.useEffect(() => {
    if (nodesRemovedPressed) {
      mindmapCreatorStoreActions.startNodesRemoval();
    }
  }, [nodesRemovedPressed]);

  return (
    <Button
      i={1}
      className="mb-3"
      s={2}
      title="Delete selected mindmap nodes (d)"
      onClick={mindmapCreatorStoreActions.startNodesRemoval}
    >
      <BiTrash />
    </Button>
  );
};

export { RemoveNodesButtonContainer };
