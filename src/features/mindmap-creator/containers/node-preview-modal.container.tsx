import { ChaptersModal } from 'components/chapters-modal';
import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { BiEdit } from 'react-icons/bi';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  closeNodePreviewAction,
  openNodeFormAction,
} from 'store/mindmap-creator/actions';

const NodePreviewModalContainer = () => {
  const nodePreview = useMindmapCreatorState((state) => state.nodePreview);

  const goToNodeEdition = (): void => {
    openNodeFormAction();
    closeNodePreviewAction();
  };

  if (nodePreview.is === `closed`) return null;

  if (!nodePreview.data.content) {
    return (
      <Modal onClose={closeNodePreviewAction}>
        <Modal.Header
          title="No Content For Selected Node"
          closeButtonTitle="Close node preview"
        />
        <p>
          There is no content for the selected node. Fill it with data by
          clicking the button below.
        </p>
        <Button
          i={2}
          s={2}
          className="ml-auto mt-8"
          auto
          title="Go to node content edition"
          onClick={goToNodeEdition}
        >
          <BiEdit />
          Edit Node Content
        </Button>
      </Modal>
    );
  }

  return (
    <ChaptersModal onClose={closeNodePreviewAction}>
      {nodePreview.data.content}
    </ChaptersModal>
  );
};

export { NodePreviewModalContainer };
