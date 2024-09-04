import React from 'react';
import { Button } from 'design-system/button';
import { BiSave } from 'react-icons/bi';
import { mindmapsCreatorStoreActions } from 'store/mindmaps-creator/mindmaps-creator.store';
import { useKeyPress } from '@xyflow/react';

const SaveButtonContainer = () => {
  const savePressed = useKeyPress(`s`);

  React.useEffect(() => {
    savePressed && mindmapsCreatorStoreActions.save();
  }, [savePressed]);

  return (
    <Button
      i={1}
      s={2}
      className="mb-3"
      title="Save mindmap (s)"
      onClick={mindmapsCreatorStoreActions.save}
    >
      <BiSave />
    </Button>
  );
};

export { SaveButtonContainer };
