import React from 'react';
import Modal from 'design-system/modal';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import { Checkbox } from 'design-system/checkbox';
import {
  mindmapCreatorStoreActions,
  mindmapCreatorStoreSelectors,
} from 'store/mindmap-creator/mindmap-creator.store';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';

const MindmapSettingsModalContainer = () => {
  const { settings } = mindmapCreatorStoreSelectors.useOk();

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

      <Field
        hint={
          <Hint trigger="When important interactions, such as adding a new node or changing the orientation are performed, the view will be automatically aligned." />
        }
      >
        <Checkbox
          label="Auto Fit View"
          checked={settings.autoFit}
          onClick={mindmapCreatorStoreActions.toggleAutoFit}
        />
      </Field>
    </Modal>
  );
};

export { MindmapSettingsModalContainer };
