import React from 'react';
import Modal from 'design-system/modal';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { Checkbox } from 'design-system/checkbox';
import {
  mindmapsCreatorStoreActions,
  mindmapsCreatorStoreSelectors,
} from 'store/mindmaps-creator/mindmaps-creator.store';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';

const MindmapSettingsModalContainer = () => {
  const { settings } = mindmapsCreatorStoreSelectors.useOk();

  return (
    <Modal onEscape={mindmapsCreatorStoreActions.closeSettings}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Settings</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close mindmap settings"
          onClick={mindmapsCreatorStoreActions.closeSettings}
        >
          <BiX />
        </Button>
      </div>

      <Field
        hint={
          <Hint trigger="When important interactions, such as adding a new node or changing the orientation are performed, the view will be automatically aligned." />
        }
      >
        <Checkbox
          label="Auto Fit View"
          checked={settings.autoFit}
          onClick={mindmapsCreatorStoreActions.toggleAutoFit}
        />
      </Field>
    </Modal>
  );
};

export { MindmapSettingsModalContainer };
