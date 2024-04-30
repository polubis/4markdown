import { Edge, Node } from 'reactflow';
import { Date, Id, Name, Path } from './general';
import { Doc } from './doc';

type NodeNativeProperties =
  | 'id'
  | 'data'
  | 'height'
  | 'width'
  | 'position'
  | 'type';

interface InternalMindmapNode
  extends Required<
    Pick<
      Node<{ doc: Doc; name: Name; description: string }, 'internal'>,
      NodeNativeProperties
    >
  > {}

type ExternalMindmapNode = Required<
  Pick<
    Node<{ url: Path; name: Name; description: string }, 'external'>,
    NodeNativeProperties
  >
>;

type MindmapNode = InternalMindmapNode | ExternalMindmapNode;

interface Mindmap {
  id: Id;
  name: Name;
  description: string;
  cdate: Date;
  mdate: Date;
  nodes: MindmapNode[];
  edges: Edge[];
}

export type { Mindmap, ExternalMindmapNode, InternalMindmapNode, MindmapNode };
