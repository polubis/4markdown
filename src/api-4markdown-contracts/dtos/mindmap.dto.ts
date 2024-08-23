import type { Edge, Node } from 'reactflow';
import type { Date, Id, Name, Path } from '../atoms';
import type { DocumentDto } from './document.dto';

const MINDMAP_NODE_TYPES = [`internal`, `external`] as const;

type NodeNativeProperties =
  | 'id'
  | 'data'
  | 'height'
  | 'width'
  | 'position'
  | 'type';

type MindmapInternalNode = Required<
  Pick<
    Node<
      {
        document: DocumentDto;
        name: Name;
        description?: string;
      },
      'internal'
    >,
    NodeNativeProperties
  >
>;

type MindmapExternalNode = Required<
  Pick<
    Node<{ url: Path; name: Name; description?: string }, 'external'>,
    NodeNativeProperties
  >
>;

type MindmapNodeType = (typeof MINDMAP_NODE_TYPES)[number];

type MindmapNode = MindmapInternalNode | MindmapExternalNode;

type MindmapDto = {
  id: Id;
  name: Name;
  description?: string;
  cdate: Date;
  mdate: Date;
  nodes: MindmapNode[];
  edges: Edge[];
};

export type {
  MindmapDto,
  MindmapNodeType,
  MindmapNode,
  MindmapInternalNode,
  MindmapExternalNode,
};
