import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { useMindmapModalsContext } from '../providers/mindmap-widgets.provider';
import { removeSelectedNodesAction } from 'store/mindmap-creator/actions';

const RemoveNodesModalContainer = () => {
  const { nodesRemovalConfirm } = useMindmapModalsContext();

  const confirmNodesRemoval = (): void => {
    removeSelectedNodesAction();
    nodesRemovalConfirm.off();
  };

  return (
    <Modal onClose={nodesRemovalConfirm.off}>
      <Modal.Header
        title="Confirm Nodes Removal"
        closeButtonTitle="Cancel nodes removal"
      />
      <p className="mt-4 mb-1">
        Setting visibility to <strong>permanent</strong> makes your document
        available on <strong>Google</strong> with a static URL based on its
        name.
      </p>
      <p className="mb-1">
        You can change the document status later, but indexing or removal from
        {` `}
        Google may take <strong>1-14 days</strong>.
      </p>
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
