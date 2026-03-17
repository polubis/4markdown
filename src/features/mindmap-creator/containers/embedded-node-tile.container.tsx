import type { NodeProps } from "@xyflow/react";
import React from "react";
import { HandleX, HandleY } from "../components/handles";
import { NodeTile } from "../components/node-tile";
import { Button } from "design-system/button";
import { BiBook, BiPencil } from "react-icons/bi";
import type { MindmapCreatorEmbeddedNode } from "store/mindmap-creator/models";
import {
  openNodeEditionAction,
  openNodePreviewAction,
} from "store/mindmap-creator/actions";

type EmbeddedNodeTileContainerProps = NodeProps<MindmapCreatorEmbeddedNode>;

const EmbeddedNodeTileContainer = ({
  selected,
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: EmbeddedNodeTileContainerProps) => {
  const handleEdit = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      openNodeEditionAction({
        type: `embedded`,
        id,
        position: {
          x: positionAbsoluteX,
          y: positionAbsoluteY,
        },
        data,
      });
    },
    [id, positionAbsoluteX, positionAbsoluteY, data],
  );

  const handlePreview = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      openNodePreviewAction({
        type: `embedded`,
        id,
        data,
        position: {
          x: positionAbsoluteX,
          y: positionAbsoluteY,
        },
      });
    },
    [id, positionAbsoluteX, positionAbsoluteY, data],
  );

  const handleEditKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEdit(e);
      }
    },
    [handleEdit],
  );

  const handlePreviewKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePreview(e);
      }
    },
    [handlePreview],
  );

  return (
    <NodeTile selected={selected}>
      <NodeTile.Name>{data.name}</NodeTile.Name>
      {data.description && (
        <NodeTile.Description>{data.description}</NodeTile.Description>
      )}
      <NodeTile.Actions>
        <Button
          i={1}
          s={1}
          aria-label="Edit node"
          onClick={handleEdit}
          onKeyDown={handleEditKeyDown}
        >
          <BiPencil aria-hidden="true" />
        </Button>
        <Button
          i={1}
          s={1}
          aria-label="Preview node"
          onClick={handlePreview}
          onKeyDown={handlePreviewKeyDown}
        >
          <BiBook aria-hidden="true" />
        </Button>
      </NodeTile.Actions>
    </NodeTile>
  );
};

const EmbeddedNodeTileContainerX = (props: EmbeddedNodeTileContainerProps) => (
  <HandleX>
    <EmbeddedNodeTileContainer {...props} />
  </HandleX>
);

const EmbeddedNodeTileContainerY = (props: EmbeddedNodeTileContainerProps) => (
  <HandleY>
    <EmbeddedNodeTileContainer {...props} />
  </HandleY>
);

export { EmbeddedNodeTileContainerX, EmbeddedNodeTileContainerY };
