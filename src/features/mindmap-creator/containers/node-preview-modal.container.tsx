import { ChaptersModal } from 'components/chapters-modal';
import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import React from 'react';
import { BiEdit, BiSolidPen } from 'react-icons/bi';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  closeNodePreviewAction,
  openNodeFormAction,
} from 'store/mindmap-creator/actions';

const NodePreviewModalContainer = () => {
  const nodePreview = useMindmapCreatorState((state) => state.nodePreview);

  const openNodeEdition = (): void => {
    if (nodePreview.is === `active`) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { is, ...data } = nodePreview;
      openNodeFormAction(data);
      closeNodePreviewAction();
    }
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
          onClick={openNodeEdition}
        >
          <BiEdit />
          Edit Node Content
        </Button>
      </Modal>
    );
  }

  return (
    <ChaptersModal
      controls={
        <Button i={2} s={1} auto title="Start node edition">
          <BiEdit />
        </Button>
      }
      onClose={closeNodePreviewAction}
    >
      {nodePreview.data.content}
    </ChaptersModal>
  );
};

export { NodePreviewModalContainer };
