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
import { Atoms } from "api-4markdown-contracts";

type ExternalNodeTileContainerProps =
  NodeProps<MindmapPreviewExternalNodeWithCompletion>;

const ExternalNodeTileContainer = ({
  id,
  data,
}: ExternalNodeTileContainerProps) => {
  const resourcesCompletionState = useResourcesCompletionState();
  const [state, completion, toggle] = useResourceCompletionToggle({
    type: "mindmap-node",
    resourceId: id as Atoms["MindmapNodeId"],
    parentId: data.mindmapId,
  });

  const handleToggle = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      toggle();
    },
    [toggle],
  );

  const handleToggleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle(e);
      }
    },
    [handleToggle],
  );

  return (
    <NodeTile
      className={completion ? "border-green-700 dark:border-green-700" : ""}
    >
      <NodeTile.Name>{data.name}</NodeTile.Name>
      {data.description && (
        <NodeTile.Description>{data.description}</NodeTile.Description>
      )}
      <NodeTile.Actions>
        <Button
          aria-label={completion ? "Unfinish" : "Finish"}
          i={1}
          disabled={
            state.is === "busy" || resourcesCompletionState.is === "busy"
          }
          s={1}
          onClick={handleToggle}
          onKeyDown={handleToggleKeyDown}
        >
          {completion ? (
            <BiCheckboxMinus aria-hidden="true" size={24} />
          ) : (
            <BiCheckboxChecked aria-hidden="true" size={24} />
          )}
        </Button>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open linked material in a new tab"
          className="flex items-center justify-center h-8 w-8 rounded-md text-black hover:bg-gray-400/20 dark:text-white dark:hover:bg-slate-800/50 focus-visible:outline focus-visible:outline-2.5 focus-visible:outline-black dark:focus-visible:outline-white shrink-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <BiWorld aria-hidden="true" className="text-xl" />
        </a>
      </NodeTile.Actions>
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
