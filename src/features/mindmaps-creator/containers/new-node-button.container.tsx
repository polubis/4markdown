import React from 'react';
import { Button } from 'design-system/button';
import { BiPlus } from 'react-icons/bi';
import { mindmapsCreatorStoreActions } from 'store/mindmaps-creator/mindmaps-creator.store';
import { useKeyPress } from '@xyflow/react';

const NewNodeButtonContainer = () => {
  const newNodePressed = useKeyPress(`n`);

  React.useEffect(() => {
    newNodePressed && mindmapsCreatorStoreActions.startAddingNode();
  }, [newNodePressed]);

  return (
    <Button
      i={1}
      className="mb-3"
      s={2}
      title="Create new mindmap node (n)"
      onClick={mindmapsCreatorStoreActions.startAddingNode}
    >
      <BiPlus />
    </Button>
  );
};

export { NewNodeButtonContainer };
