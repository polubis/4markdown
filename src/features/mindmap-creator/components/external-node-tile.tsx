import React from 'react';
import { HandleX, HandleY } from './handles';
import { type NodeProps } from '@xyflow/react';
import { NodeTile } from './node-tile';
import { Button } from 'design-system/button';
import { BiWorld } from 'react-icons/bi';
import type { MindmapCreatorExternalNode } from 'store/mindmap-creator/models';

type ExternalNodeTileProps = NodeProps<MindmapCreatorExternalNode>;

const ExternalNodeTile = ({
  selected,
  data: { url, description, name },
}: ExternalNodeTileProps) => {
  return (
    <NodeTile selected={selected}>
      <NodeTile.Label>External Resource</NodeTile.Label>
      <NodeTile.Name>{name}</NodeTile.Name>
      {description && (
        <NodeTile.Description>{description}</NodeTile.Description>
      )}
      <NodeTile.Toolbox>
        <a
          href={url}
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
