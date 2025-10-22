import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React from "react";
import {
  cancelNodesRemovalAction,
  removeSelectedNodesAction,
} from "store/mindmap-creator/actions";

const NodesRemovalConfirmationContainer = () => {
  return (
    <Modal2 onClose={cancelNodesRemovalAction}>
      <Modal2.Header
        title="Confirm Nodes Removal"
        closeButtonTitle="Cancel nodes removal"
      />
      <Modal2.Body>
        <p className="mb-1">
          You&apos;ve selected some nodes in the mindmap. Confirming this action
          will{` `}
          <strong>permanently remove them</strong>.
        </p>
        <p className="mb-1">Are you sure you want to proceed?</p>
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          className="flex-1"
          i={1}
          s={2}
          auto
          title="Cancel nodes removal"
          onClick={cancelNodesRemovalAction}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          i={2}
          s={2}
          auto
          title="Confirm nodes removal"
          onClick={removeSelectedNodesAction}
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

export { NodesRemovalConfirmationContainer };
