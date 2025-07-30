import React from "react";
import { HandleX, HandleY } from "./handles";
import { type NodeProps } from "@xyflow/react";
import { NodeTile } from "./node-tile";
import { Button } from "design-system/button";
import { BiCheckboxChecked, BiCheckboxMinus, BiWorld } from "react-icons/bi";
import { MindmapPreviewExternalNodeWithCompletion } from "../models";

type ExternalNodeTileProps =
  NodeProps<MindmapPreviewExternalNodeWithCompletion>;

const ExternalNodeTile = ({ data }: ExternalNodeTileProps) => {
  return (
    <NodeTile>
      <NodeTile.Label>External Resource</NodeTile.Label>
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
