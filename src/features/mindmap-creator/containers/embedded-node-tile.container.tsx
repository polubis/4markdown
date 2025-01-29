import type { NodeProps } from '@xyflow/react';
import React from 'react';
import type { EmbeddedNodeViewModel } from '../models';
import { HandleX, HandleY } from '../components/handles';
import { NodeTile } from '../components/node-tile';
import { toggleMindmapNodeAction } from 'store/mindmap-creator/actions';

type EmbeddedNodeTileContainerProps = NodeProps<EmbeddedNodeViewModel>;

const EmbeddedNodeTileContainer = ({
  id,
  data: { name, description },
  selected,
}: EmbeddedNodeTileContainerProps) => (
  <div onClick={() => toggleMindmapNodeAction(id)}>
    <NodeTile selected={selected}>
      <NodeTile.Label>Embedded Resource</NodeTile.Label>
      <NodeTile.Name>{name}</NodeTile.Name>
      {description && (
        <NodeTile.Description>{description}</NodeTile.Description>
      )}
    </NodeTile>
  </div>
);

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
