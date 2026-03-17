import React from "react";
import { HandleX, HandleY } from "./handles";
import { type NodeProps } from "@xyflow/react";
import { NodeTile } from "./node-tile";
import { Button } from "design-system/button";
import { BiPencil, BiWorld } from "react-icons/bi";
import type { MindmapCreatorExternalNode } from "store/mindmap-creator/models";
import { openNodeEditionAction } from "store/mindmap-creator/actions";

type ExternalNodeTileProps = NodeProps<MindmapCreatorExternalNode>;

const ExternalNodeTile = ({
  selected,
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: ExternalNodeTileProps) => {
  const handleEdit = React.useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      openNodeEditionAction({
        type: `external`,
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

  const handleEditKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleEdit(e);
      }
    },
    [handleEdit],
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

const ExternalNodeTileX = (props: ExternalNodeTileProps) => (
  <HandleX>
    <ExternalNodeTile {...props} />
  </HandleX>
);

const ExternalNodeTileY = (props: ExternalNodeTileProps) => (
  <HandleY>
    <ExternalNodeTile {...props} />
  </HandleY>
);

export { ExternalNodeTileX, ExternalNodeTileY };
