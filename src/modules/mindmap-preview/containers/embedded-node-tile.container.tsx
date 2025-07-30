import type { NodeProps } from "@xyflow/react";
import React from "react";
import { HandleX, HandleY } from "../components/handles";
import { NodeTile } from "../components/node-tile";
import { Button } from "design-system/button";
import { BiBook, BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";
import { openNodePreviewAction } from "store/mindmap-preview/actions";
import { MindmapPreviewEmbeddedNodeWithCompletion } from "../models";

type EmbeddedNodeTileContainerProps =
  NodeProps<MindmapPreviewEmbeddedNodeWithCompletion>;

const EmbeddedNodeTileContainer = ({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: EmbeddedNodeTileContainerProps) => {
  return (
    <NodeTile
      className={
        data.completion ? "border-green-700 dark:border-green-700" : ""
      }
    >
      <NodeTile.Label>Embedded Resource</NodeTile.Label>
      <NodeTile.Name>{data.name}</NodeTile.Name>
      {data.description && (
        <NodeTile.Description>{data.description}</NodeTile.Description>
      )}
      <NodeTile.Toolbox>
        <Button
          title={data.completion ? "Remove from completed" : "Add to completed"}
          i={2}
          s={1}
          onClick={(e) => {
            e.stopPropagation();
            // toggle();
          }}
        >
          {data.completion ? (
            <BiCheckboxMinus size={24} />
          ) : (
            <BiCheckboxChecked size={24} />
          )}
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
