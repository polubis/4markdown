import React from 'react';
import Modal from 'design-system/modal';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import {
  changeMindmapSettings,
  closeMindmapSettings,
} from 'store/mindmaps-creator/mindmaps-creator.actions';
import { Checkbox } from 'design-system/checkbox';
import { useMindmapsCreatorStore } from 'store/mindmaps-creator/mindmaps-creator.store';
import { Field } from 'design-system/field';

const MindmapSettingsModalContainer = () => {
  const { settings } = useMindmapsCreatorStore();

  return (
    <Modal>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Settings</h6>
        <Button
          type="button"
          i={2}
          s={1}
          title="Close mindmap settings"
          onClick={closeMindmapSettings}
        >
          <BiX />
        </Button>
      </div>

      <Field hint="After a node is changed, the application will zoom out to display all nodes.">
        <Checkbox
          label="Auto Zoom"
          checked={settings.autoFit}
          onClick={() =>
            changeMindmapSettings((settings) => ({
              autoFit: !settings.autoFit,
            }))
          }
        />
      </Field>
    </Modal>
  );
};

export { MindmapSettingsModalContainer };
