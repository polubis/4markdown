import type { NodeProps } from '@xyflow/react';
import React from 'react';
import type { NestedNodeViewModel } from '../models';
import { HandleX, HandleY } from '../components/handles';
import { NodeTile } from '../components/node-tile';
import { getNestedMindmapAct } from 'acts/get-nested-mindmap.act';

type NestedNodeTileContainerProps = NodeProps<NestedNodeViewModel>;

const NestedNodeTileContainer = ({
  data: { name, description, id: mindmapId },
  selected,
}: NestedNodeTileContainerProps) => {
  return (
    <div onClick={() => getNestedMindmapAct(mindmapId)}>
      <NodeTile selected={selected}>
        <NodeTile.Label>Other Mindmap</NodeTile.Label>
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
