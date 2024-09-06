import React from 'react';
import { Button } from 'design-system/button';
import { BiCog } from 'react-icons/bi';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';

const SettingsButtonContainer = () => {
  return (
    <Button
      i={1}
      s={2}
      className="mt-auto"
      title="Open mindmap settings"
      onClick={mindmapCreatorStoreActions.openSettings}
    >
      <BiCog />
    </Button>
  );
};

export { SettingsButtonContainer };
