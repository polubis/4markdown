import type { NodeProps } from '@xyflow/react';
import React from 'react';
import { HandleX, HandleY } from '../components/handles';
import { NodeTile } from '../components/node-tile';
import { toggleMindmapNodeAction } from 'store/mindmap-creator/actions';
import { type EmbeddedNode } from 'api-4markdown-contracts';
import { Button } from 'design-system/button';
import { BiArrowToRight } from 'react-icons/bi';

type EmbeddedNodeTileContainerProps = NodeProps<EmbeddedNode>;

const EmbeddedNodeTileContainer = ({
  id,
  data: { name, description },
  selected,
}: EmbeddedNodeTileContainerProps) => (
  <NodeTile selected={selected}>
    <NodeTile.Label>Embedded Resource</NodeTile.Label>
    <NodeTile.Name>{name}</NodeTile.Name>
    {description && <NodeTile.Description>{description}</NodeTile.Description>}
    <NodeTile.Toolbox>
      <Button i={1} s={1} rounded onClick={() => toggleMindmapNodeAction(id)}>
        <BiArrowToRight />
      </Button>
    </NodeTile.Toolbox>
  </NodeTile>
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
