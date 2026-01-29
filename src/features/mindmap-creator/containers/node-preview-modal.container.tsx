import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import React from "react";
import { BiPencil } from "react-icons/bi";
import { Atoms } from "api-4markdown-contracts";
import { useMindmapCreatorState } from "store/mindmap-creator";
import {
  closeNodePreviewAction,
  openNodeEditionAction,
} from "store/mindmap-creator/actions";

const MarkdownWidget = React.lazy(() =>
  import("components/markdown-widget").then(({ MarkdownWidget }) => ({
    default: MarkdownWidget,
  })),
);

const NodePreviewModalContainer = () => {
  const nodePreview = useMindmapCreatorState((state) => state.nodePreview);
  const activeMindmapId = useMindmapCreatorState(
    (state) => state.activeMindmapId,
  );
  const historyEnabled = Boolean(activeMindmapId);

  const openNodeEdition = (): void => {
    if (nodePreview.is === `active`) {
      const { is, ...data } = nodePreview;
      openNodeEditionAction(data);
    }
  };

  if (nodePreview.is === `closed`) return null;

  if (!nodePreview.data.content) {
    return (
      <Modal2 onClose={closeNodePreviewAction}>
        <Modal2.Header
          title="No Content For Selected Node"
          closeButtonTitle="Close node preview"
        />
        <Modal2.Body>
          <p>
            There is no content for the selected node. Fill it with data by
            clicking the button below.
          </p>
        </Modal2.Body>
        <Modal2.Footer>
          <Button
            i={2}
            s={2}
            className="ml-auto"
            auto
            title="Go to node content edition"
            onClick={openNodeEdition}
          >
            <BiPencil />
            Edit Node Content
          </Button>
        </Modal2.Footer>
      </Modal2>
    );
  }

  return (
    <React.Suspense>
      <MarkdownWidget
        chunksActive={false}
        headerControls={
          <Button
            i={2}
            s={1}
            title="Start node edition"
            onClick={openNodeEdition}
          >
            <BiPencil />
          </Button>
        }
        onClose={closeNodePreviewAction}
        markdown={nodePreview.data.content}
        resourceId={
          historyEnabled
            ? (nodePreview.id as Atoms["MindmapNodeId"])
            : undefined
        }
        resourceType={historyEnabled ? "mindmap-node" : undefined}
      />
    </React.Suspense>
  );
};

export { NodePreviewModalContainer };
