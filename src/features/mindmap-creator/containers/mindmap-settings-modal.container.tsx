import React from 'react';
import Modal from 'design-system/modal';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { mindmapCreatorStoreActions } from 'store/mindmap-creator/mindmap-creator.store';

const MindmapSettingsModalContainer = () => {
  return (
    <Modal onEscape={mindmapCreatorStoreActions.closeSettings}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Settings</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close mindmap settings"
          onClick={mindmapCreatorStoreActions.closeSettings}
        >
          <BiX />
        </Button>
      </div>
    </Modal>
  );
};

export { MindmapSettingsModalContainer };
