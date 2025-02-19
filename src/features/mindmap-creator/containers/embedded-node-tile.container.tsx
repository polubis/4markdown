import type { NodeProps } from '@xyflow/react';
import React from 'react';
import { HandleX, HandleY } from '../components/handles';
import { NodeTile } from '../components/node-tile';
import { Button } from 'design-system/button';
import { BiArrowToRight } from 'react-icons/bi';
import type { MindmapCreatorEmbeddedNode } from '../store/models';

type EmbeddedNodeTileContainerProps = NodeProps<MindmapCreatorEmbeddedNode>;

const EmbeddedNodeTileContainer = ({
  selected,
  data: { name, description },
}: EmbeddedNodeTileContainerProps) => (
  <NodeTile selected={selected}>
    <NodeTile.Label>Embedded Resource</NodeTile.Label>
    <NodeTile.Name>{name}</NodeTile.Name>
    {description && <NodeTile.Description>{description}</NodeTile.Description>}
    <NodeTile.Toolbox>
      <Button
        i={2}
        s={1}
        onClick={(e) => {
          e.stopPropagation();
          //   toggleMindmapNodeAction(id);
        }}
      >
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
