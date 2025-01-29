import type { NodeProps } from '@xyflow/react';
import React from 'react';
import type { DocumentNodeViewModel } from '../models';
import { HandleX, HandleY } from '../components/handles';
import { NodeTile } from '../components/node-tile';
import { meta } from '../../../../meta';
import { toggleMindmapNodeAction } from 'store/mindmap-creator/actions';

type DocumentNodeTileContainerProps = NodeProps<DocumentNodeViewModel>;

const DocumentNodeTileContainer = ({
  id,
  data: { name, description },
  selected,
}: DocumentNodeTileContainerProps) => (
  <div onClick={() => toggleMindmapNodeAction(id)}>
    <NodeTile selected={selected}>
      <NodeTile.Label>{meta.appName} Document</NodeTile.Label>
      <NodeTile.Name>{name}</NodeTile.Name>
      {description && (
        <NodeTile.Description>{description}</NodeTile.Description>
      )}
    </NodeTile>
  </div>
);

const DocumentNodeTileContainerX = (props: DocumentNodeTileContainerProps) => (
  <HandleX>
    <DocumentNodeTileContainer {...props} />
  </HandleX>
);

const DocumentNodeTileContainerY = (props: DocumentNodeTileContainerProps) => (
  <HandleY>
    <DocumentNodeTileContainer {...props} />
  </HandleY>
);

export { DocumentNodeTileContainerX, DocumentNodeTileContainerY };
