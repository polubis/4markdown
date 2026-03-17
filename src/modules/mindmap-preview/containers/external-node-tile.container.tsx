import React from "react";
import { HandleX, HandleY } from "../components/handles";
import { type NodeProps } from "@xyflow/react";
import { NodeTile } from "../components/node-tile";
import { Button } from "design-system/button";
import {
  BiCheckSquare,
  BiWorld,
  BiStar,
  BiSolidCheckSquare,
  BiSolidStar,
} from "react-icons/bi";
import { MindmapPreviewExternalNodeWithCompletion } from "../models";
import {
  useResourceCompletionToggle,
  useResourcesCompletionState,
} from "modules/resource-completions";
import {
  useResourceLikeToggle,
  useResourcesLikeState,
} from "modules/resource-likes";
import { Atoms } from "api-4markdown-contracts";

type ExternalNodeTileContainerProps =
  NodeProps<MindmapPreviewExternalNodeWithCompletion>;

const ExternalNodeTileContainer = ({
  id,
  data,
}: ExternalNodeTileContainerProps) => {
  const resourcesCompletionState = useResourcesCompletionState();
  const [completionState, completion, toggleCompletion] =
    useResourceCompletionToggle({
      type: "mindmap-node",
      resourceId: id as Atoms["MindmapNodeId"],
      parentId: data.mindmapId,
      title: data.name,
      description: data.description ?? undefined,
    });

  const resourcesLikeState = useResourcesLikeState();
  const [likeState, like, toggleLike] = useResourceLikeToggle({
    type: "mindmap-node",
    resourceId: id as Atoms["MindmapNodeId"],
    parentId: data.mindmapId,
    title: data.name,
    description: data.description ?? undefined,
  });

  const handleToggleCompletion = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      toggleCompletion();
    },
    [toggleCompletion],
  );

  const handleToggleLike = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      toggleLike();
    },
    [toggleLike],
  );

  const handleToggleCompletionKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggleCompletion(e);
      }
    },
    [handleToggleCompletion],
  );

  const handleToggleLikeKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggleLike(e);
      }
    },
    [handleToggleLike],
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
          aria-label={completion ? "Uncomplete" : "Complete"}
          i={1}
          disabled={
            completionState.is === "busy" ||
            resourcesCompletionState.is === "busy"
          }
          s={1}
          onClick={handleToggleCompletion}
          onKeyDown={handleToggleCompletionKeyDown}
        >
          {completion ? (
            <BiSolidCheckSquare aria-hidden="true" size={24} />
          ) : (
            <BiCheckSquare aria-hidden="true" size={24} />
          )}
        </Button>
        <Button
          aria-label={like ? "Unlike" : "Like"}
          i={1}
          disabled={likeState.is === "busy" || resourcesLikeState.is === "busy"}
          s={1}
          onClick={handleToggleLike}
          onKeyDown={handleToggleLikeKeyDown}
        >
          {like ? (
            <BiSolidStar aria-hidden="true" />
          ) : (
            <BiStar aria-hidden="true" />
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
