import type { NodeProps } from '@xyflow/react';
import React from 'react';
import { HandleX, HandleY } from '../components/handles';
import { NodeTile } from '../components/node-tile';
import { getNestedMindmapAct } from 'acts/get-nested-mindmap.act';
import type { NestedNode } from 'api-4markdown-contracts';

type NestedNodeTileContainerProps = NodeProps<NestedNode>;

const NestedNodeTileContainer = ({
  id: nodeId,
  data: { name, description, loading },
  selected,
}: NestedNodeTileContainerProps) => {
  return (
    <div onClick={() => getNestedMindmapAct(nodeId)}>
      <NodeTile selected={selected}>
        <NodeTile.Label>
          {loading ? `Loading and Rendering...` : `Other Mindmap`}
        </NodeTile.Label>
        <NodeTile.Name>{name}</NodeTile.Name>
        {description && (
          <NodeTile.Description>{description}</NodeTile.Description>
        )}
      </NodeTile>
    </div>
  );
};

const NestedNodeTileContainerX = (props: NestedNodeTileContainerProps) => (
  <HandleX>
    <NestedNodeTileContainer {...props} />
  </HandleX>
);

const NestedNodeTileContainerY = (props: NestedNodeTileContainerProps) => (
  <HandleY>
    <NestedNodeTileContainer {...props} />
  </HandleY>
);

export { NestedNodeTileContainerX, NestedNodeTileContainerY };
