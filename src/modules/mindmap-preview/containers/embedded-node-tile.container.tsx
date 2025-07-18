import type { NodeProps } from "@xyflow/react";
import React from "react";
import { HandleX, HandleY } from "../components/handles";
import { NodeTile } from "../components/node-tile";
import { Button } from "design-system/button";
import {
  BiBook,
  BiCheckbox,
  BiCheckboxChecked,
  BiCheckboxMinus,
} from "react-icons/bi";
import type { MindmapPreviewEmbeddedNode } from "store/mindmap-preview/models";
import { openNodePreviewAction } from "store/mindmap-preview/actions";
import { ResourceId } from "api-4markdown-contracts";
import {
  useResourceCompletionCheck,
  useResourcesCompletion,
} from "modules/resources-completion";

type EmbeddedNodeTileContainerProps = NodeProps<MindmapPreviewEmbeddedNode>;

const EmbeddedNodeTileContainer = ({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: EmbeddedNodeTileContainerProps) => {
  const { isCompleted, toggle } = useResourcesCompletion(
    id as ResourceId,
    "mindmap-node",
  );

  return (
    <NodeTile
      className={isCompleted ? "border-green-700 dark:border-green-700" : ""}
    >
      <NodeTile.Label>Embedded Resource</NodeTile.Label>
      <NodeTile.Name>{data.name}</NodeTile.Name>
      {data.description && (
        <NodeTile.Description>{data.description}</NodeTile.Description>
      )}
      <NodeTile.Toolbox>
        <Button
          title={isCompleted ? "Remove from completed" : "Add to completed"}
          i={2}
          s={1}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        >
          {isCompleted ? (
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
