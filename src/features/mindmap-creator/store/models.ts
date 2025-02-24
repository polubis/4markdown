import type {
  EmbeddedNode,
  ExternalNode,
  SolidEdge,
} from 'api-4markdown-contracts';

type NodeBase = {
  measured?: {
    height: number;
    width: number;
  };
  selected?: boolean;
};

type MindmapCreatorEmbeddedNode = EmbeddedNode & NodeBase;
type MindmapCreatorExternalNode = ExternalNode & NodeBase;

type MindmapCreatorSolidEdge = SolidEdge;
type MindmapCreatorEdge = MindmapCreatorSolidEdge;

type MindmapCreatorNode =
  | MindmapCreatorEmbeddedNode
  | MindmapCreatorExternalNode;

type MindmapCreatorState = {
  orientation: `x` | `y`;
  nodes: MindmapCreatorNode[];
  edges: MindmapCreatorEdge[];
  nodeForm: { is: `closed` } | { is: `active` };
  nodesRemovalConfirmation: { is: `closed` } | { is: `active` };
  mindmapForm: { is: `closed` } | { is: `active` };
};

export type {
  MindmapCreatorState,
  MindmapCreatorNode,
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
  MindmapCreatorEdge,
  MindmapCreatorSolidEdge,
};
