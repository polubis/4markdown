import type { NodeProps } from "@xyflow/react";
import React from "react";
import { HandleX, HandleY } from "../components/handles";
import { NodeTile } from "../components/node-tile";
import { Button } from "design-system/button";
import {
  BiBook,
  BiCheckboxChecked,
  BiCheckboxMinus,
  BiStar,
  BiSolidStar,
} from "react-icons/bi";
import { openNodePreviewAction } from "store/mindmap-preview/actions";
import { MindmapPreviewEmbeddedNodeWithCompletion } from "../models";
import {
  useResourceCompletionToggle,
  useResourcesCompletionState,
} from "modules/resource-completions";
import {
  useResourceLikeToggle,
  useResourcesLikeState,
} from "modules/resource-likes";
import { Atoms } from "api-4markdown-contracts";

type EmbeddedNodeTileContainerProps =
  NodeProps<MindmapPreviewEmbeddedNodeWithCompletion>;

const EmbeddedNodeTileContainer = ({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: EmbeddedNodeTileContainerProps) => {
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
            completionState.is === "busy" ||
            resourcesCompletionState.is === "busy"
          }
          s={1}
          onClick={handleToggleCompletion}
          onKeyDown={handleToggleCompletionKeyDown}
        >
          {completion ? (
            <BiCheckboxMinus aria-hidden="true" size={24} />
          ) : (
            <BiCheckboxChecked aria-hidden="true" size={24} />
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
