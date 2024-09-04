import React from 'react';
import { Button } from 'design-system/button';
import { BiCog } from 'react-icons/bi';
import { mindmapsCreatorStoreActions } from 'store/mindmaps-creator/mindmaps-creator.store';

const SettingsButtonContainer = () => {
  return (
    <Button
      i={1}
      s={2}
      className="mt-auto"
      title="Open mindmap settings"
      onClick={mindmapsCreatorStoreActions.openSettings}
    >
      <BiCog />
    </Button>
  );
};

export { SettingsButtonContainer };
