import React from 'react';
import { HandleX, HandleY } from './handles';
import { type NodeProps } from '@xyflow/react';
import { NodeTile } from './node-tile';
import { type ExternalNode } from 'api-4markdown-contracts';

type ExternalNodeTileProps = NodeProps<ExternalNode>;

const ExternalNodeTile = ({
  selected,
  data: { url, description, name },
}: ExternalNodeTileProps) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <NodeTile selected={selected}>
        <NodeTile.Label>External Resource</NodeTile.Label>
        <NodeTile.Name>{name}</NodeTile.Name>
        {description && (
          <NodeTile.Description>{description}</NodeTile.Description>
        )}
      </NodeTile>
    </a>
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
