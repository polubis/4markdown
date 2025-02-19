import type { SUID } from 'development-kit/suid';

type NodeDataBase = {
  name: string;
  path: `/${string}/`;
  description: string | null;
};

type MakeEdge<TType extends string> = {
  id: SUID;
  type: TType;
  source: SUID;
  target: SUID;
};

type MakeNode<TType extends string, TData extends Record<string, any>> = {
  id: SUID;
  position: {
    x: number;
    y: number;
  };
  measured?: {
    height: number;
    width: number;
  };
  type: TType;
  selected: boolean;
  data: TData;
};

type MindmapCreatorEmbeddedNode = MakeNode<
  `embedded`,
  NodeDataBase & { content: string | null }
>;

type MindmapCreatorExternalNode = MakeNode<
  `external`,
  NodeDataBase & { url: string }
>;

type MindmapCreatorSolidEdge = MakeEdge<`solid`>;

type MindmapCreatorEdge = MindmapCreatorSolidEdge;
type MindmapCreatorNode =
  | MindmapCreatorEmbeddedNode
  | MindmapCreatorExternalNode;

type MindmapCreatorStore = {
  orientation: `x` | `y`;
  nodes: MindmapCreatorNode[];
  edges: MindmapCreatorEdge[];
  nodeForm: { is: `closed` } | { is: `active` };
};

export type {
  MindmapCreatorStore,
  MindmapCreatorNode,
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
  MindmapCreatorEdge,
  MindmapCreatorSolidEdge,
};
