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
}: EmbeddedNodeTileContainerProps) => (
  <NodeTile selected={selected}>
    <NodeTile.Label>Embedded Resource</NodeTile.Label>
    <NodeTile.Name>{data.name}</NodeTile.Name>
    {data.description && (
      <NodeTile.Description>{data.description}</NodeTile.Description>
    )}
    <NodeTile.Toolbox>
      <Button
        i={2}
        s={1}
        title="Open node edition"
        onClick={(e) => {
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
        }}
      >
        <BiPencil />
      </Button>
      <Button
        i={2}
        s={1}
        onClick={(e) => {
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
        }}
      >
        <BiBook />
      </Button>
    </NodeTile.Toolbox>
  </NodeTile>
);

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
