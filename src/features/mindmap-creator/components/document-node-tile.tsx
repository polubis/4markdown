import type { NodeProps } from '@xyflow/react';
import React from 'react';
import type { DocumentNodeViewModel } from '../models';
import { HandleX, HandleY } from './handles';
import { NodeTile } from './node-tile';
import { meta } from '../../../../meta';

type DocumentNodeTileProps = NodeProps<DocumentNodeViewModel>;

const DocumentNodeTile = ({
  data: { name, description },
  selected,
}: DocumentNodeTileProps) => (
  <NodeTile selected={selected}>
    <NodeTile.Label>{meta.appName} Document</NodeTile.Label>
    <NodeTile.Name>{name}</NodeTile.Name>
    {description && <NodeTile.Description>{description}</NodeTile.Description>}
  </NodeTile>
);

const DocumentNodeTileX = (props: DocumentNodeTileProps) => (
  <HandleX>
    <DocumentNodeTile {...props} />
  </HandleX>
);

const DocumentNodeTileY = (props: DocumentNodeTileProps) => (
  <HandleY>
    <DocumentNodeTile {...props} />
  </HandleY>
);

export { DocumentNodeTileX, DocumentNodeTileY };
