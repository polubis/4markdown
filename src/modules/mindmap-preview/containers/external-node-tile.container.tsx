import React from "react";
import { HandleX, HandleY } from "../components/handles";
import { type NodeProps } from "@xyflow/react";
import { NodeTile } from "../components/node-tile";
import { Button } from "design-system/button";
import { BiCheckboxChecked, BiCheckboxMinus, BiWorld } from "react-icons/bi";
import { MindmapPreviewExternalNodeWithCompletion } from "../models";
import {
  useResourceCompletionToggle,
  useResourcesCompletionState,
} from "modules/resource-completions";
import { MindmapNodeId } from "api-4markdown-contracts";

type ExternalNodeTileContainerProps =
  NodeProps<MindmapPreviewExternalNodeWithCompletion>;

const ExternalNodeTileContainer = ({
  id,
  data,
}: ExternalNodeTileContainerProps) => {
  const resourcesCompletionState = useResourcesCompletionState();
  const [state, completion, toggle] = useResourceCompletionToggle({
    type: "mindmap-node",
    resourceId: id as MindmapNodeId,
    parentId: data.mindmapId,
  });

  return (
    <NodeTile
      className={completion ? "border-green-700 dark:border-green-700" : ""}
    >
      <NodeTile.Label>External Resource</NodeTile.Label>
      <NodeTile.Name>{data.name}</NodeTile.Name>
      {data.description && (
        <NodeTile.Description>{data.description}</NodeTile.Description>
      )}
      <NodeTile.Toolbox>
        <Button
          title={completion ? "Remove from completed" : "Add to completed"}
          i={2}
          disabled={
            state.is === "busy" || resourcesCompletionState.is === "busy"
          }
          s={1}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        >
          {completion ? (
            <BiCheckboxMinus size={24} />
          ) : (
            <BiCheckboxChecked size={24} />
          )}
        </Button>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open linked material in a new tab"
        >
          <Button
            i={2}
            s={1}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <BiWorld />
          </Button>
        </a>
      </NodeTile.Toolbox>
    </NodeTile>
  );
};

const ExternalNodeTileContainerX = (props: ExternalNodeTileContainerProps) => (
  <HandleX>
    <ExternalNodeTileContainer {...props} />
  </HandleX>
);

const ExternalNodeTileContainerY = (props: ExternalNodeTileContainerProps) => (
  <HandleY>
    <ExternalNodeTileContainer {...props} />
  </HandleY>
);

export { ExternalNodeTileContainerX, ExternalNodeTileContainerY };
