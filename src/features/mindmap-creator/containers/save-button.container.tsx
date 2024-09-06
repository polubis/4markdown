import React from 'react';
import { Button } from 'design-system/button';
import { BiSave } from 'react-icons/bi';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';
import { useKeyPress } from '@xyflow/react';

const SaveButtonContainer = () => {
  const savePressed = useKeyPress(`s`);

  React.useEffect(() => {
    savePressed && mindmapCreatorStoreActions.save();
  }, [savePressed]);

  return (
    <Button
      i={1}
      s={2}
      className="mb-3"
      title="Save mindmap (s)"
      onClick={mindmapCreatorStoreActions.save}
    >
      <BiSave />
    </Button>
  );
};

export { SaveButtonContainer };
