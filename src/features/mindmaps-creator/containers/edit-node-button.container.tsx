import React from 'react';
import { Button } from 'design-system/button';
import { BiEdit } from 'react-icons/bi';
import { mindmapsCreatorStoreActions } from 'store/mindmaps-creator/mindmaps-creator.store';
import { useKeyPress } from '@xyflow/react';

const EditNodeButtonContainer = () => {
  const nodeToEditPressed = useKeyPress(`e`);

  React.useEffect(() => {
    if (nodeToEditPressed) {
      mindmapsCreatorStoreActions.beginNodeEdition();
    }
  }, [nodeToEditPressed]);

  return (
    <Button
      i={1}
      className="mb-3"
      s={2}
      title="Edit selected node (e)"
      onClick={mindmapsCreatorStoreActions.beginNodeEdition}
    >
      <BiEdit />
    </Button>
  );
};

export { EditNodeButtonContainer };
