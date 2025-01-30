import React from 'react';
import type { PendingNodeViewModel } from '../models';
import type { NodeProps } from '@xyflow/react';
import { NodeTile } from './node-tile';
import { HandleX, HandleY } from './handles';

type PendingNodeTileProps = NodeProps<PendingNodeViewModel>;

const PendingNodeTile = (_: PendingNodeTileProps) => {
  return (
    <NodeTile selected={false}>
      <NodeTile.Label>Loading Mindmap</NodeTile.Label>
    </NodeTile>
  );
};

const PendingNodeTileX = (props: PendingNodeTileProps) => (
  <HandleX>
    <PendingNodeTile {...props} />
  </HandleX>
);

const PendingNodeTileY = (props: PendingNodeTileProps) => (
  <HandleY>
    <PendingNodeTile {...props} />
  </HandleY>
);

export { PendingNodeTileX, PendingNodeTileY };
