import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import { removeMindmapNodesAct } from 'acts/remove-mindmap-nodes.act';

const RemoveNodesModalContainer = () => {
  const { nodesRemovalConfirm } = useMindmapModalsContext();

  const confirmNodesRemoval = async (): Promise<void> => {
    const result = await removeMindmapNodesAct();
    result.is === `ok` && nodesRemovalConfirm.off();
  };

  return (
    <Modal onClose={nodesRemovalConfirm.off}>
      <Modal.Header
        title="Confirm Nodes Removal"
        closeButtonTitle="Cancel nodes removal"
      />
      <p className="mt-4 mb-1">
        You&apos;ve selected some nodes in the mind map. Confirming this action
        will{` `}
        <strong>permanently remove them</strong> and trigger{` `}
        <strong>a save</strong>.
      </p>
      <p className="mb-1">Are you sure you want to proceed?</p>
      <footer className="mt-6 flex">
        <Button
          className="ml-auto"
          type="button"
          i={1}
          s={2}
          auto
          title="Cancel nodes removal"
          onClick={nodesRemovalConfirm.off}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="ml-2"
          i={2}
          s={2}
          auto
          title="Confirm nodes removal"
          onClick={confirmNodesRemoval}
        >
          Confirm
        </Button>
      </footer>
    </Modal>
  );
};

export { RemoveNodesModalContainer };
