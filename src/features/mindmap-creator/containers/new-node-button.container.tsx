import React from 'react';
import { Button } from 'design-system/button';
import { BiAddToQueue } from 'react-icons/bi';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';
import { useKeyPress } from '@xyflow/react';

const NewNodeButtonContainer = () => {
  const newNodePressed = useKeyPress(`n`);

  React.useEffect(() => {
    newNodePressed && mindmapCreatorStoreActions.startAddingNode();
  }, [newNodePressed]);

  return (
    <Button
      i={1}
      className="mb-3"
      s={2}
      title="Create new mindmap node (n)"
      onClick={mindmapCreatorStoreActions.startAddingNode}
    >
      <BiAddToQueue />
    </Button>
  );
};

export { NewNodeButtonContainer };
