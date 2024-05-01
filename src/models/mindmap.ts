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

type InternalMindmapNodeData = { doc: Doc; name: Name; description: string };
type ExternalMindmapNodeData = { url: Path; name: Name; description: string };

interface InternalMindmapNode
  extends Required<
    Pick<Node<InternalMindmapNodeData, 'internal'>, NodeNativeProperties>
  > {}

type ExternalMindmapNode = Required<
  Pick<Node<ExternalMindmapNodeData, 'external'>, NodeNativeProperties>
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

export type {
  Mindmap,
  ExternalMindmapNode,
  InternalMindmapNodeData,
  ExternalMindmapNodeData,
  InternalMindmapNode,
  MindmapNode,
};
