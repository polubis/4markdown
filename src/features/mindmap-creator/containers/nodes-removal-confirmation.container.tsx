import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import {
  cancelNodesRemovalAction,
  removeSelectedNodesAction,
} from 'store/mindmap-creator/actions';

const NodesRemovalConfirmationContainer = () => {
  return (
    <Modal onClose={cancelNodesRemovalAction}>
      <Modal.Header
        title="Confirm Nodes Removal"
        closeButtonTitle="Cancel nodes removal"
      />
      <p className="mt-4 mb-1">
        You&apos;ve selected some nodes in the mindmap. Confirming this action
        will{` `}
        <strong>permanently remove them</strong>.
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
          onClick={cancelNodesRemovalAction}
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
          onClick={removeSelectedNodesAction}
        >
          Confirm
        </Button>
      </footer>
    </Modal>
  );
};

export { NodesRemovalConfirmationContainer };
