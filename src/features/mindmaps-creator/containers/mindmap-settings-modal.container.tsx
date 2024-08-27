import React from 'react';
import Modal from 'design-system/modal';
import { Button } from 'design-system/button';
import { BiX } from 'react-icons/bi';
import {
  closeMindmapSettings,
  toggleMindmapAutoFit,
} from 'store/mindmap/mindmap.actions';
import { Checkbox } from 'design-system/checkbox';
import { useMindmapStore } from 'store/mindmap/mindmap.store';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';

const MindmapSettingsModalContainer = () => {
  const { settings } = useMindmapStore();

  return (
    <Modal onEscape={closeMindmapSettings}>
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

      <Field
        hint={
          <Hint trigger="After a node is changed, the application will zoom out to display all nodes." />
        }
      >
        <Checkbox
          label="Auto Zoom"
          checked={settings.autoFit}
          onClick={toggleMindmapAutoFit}
        />
      </Field>
    </Modal>
  );
};

export { MindmapSettingsModalContainer };
