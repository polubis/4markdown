import type {
  EmbeddedNode,
  ExternalNode,
  MindmapDto,
} from 'api-4markdown-contracts';

type NodeBase = {
  measured?: {
    height: number;
    width: number;
  };
  selected: boolean;
};

type MindmapCreatorEmbeddedNode = EmbeddedNode & NodeBase;
type MindmapCreatorExternalNode = ExternalNode & NodeBase;

type MindmapCreatorNode =
  | MindmapCreatorEmbeddedNode
  | MindmapCreatorExternalNode;

type MindmapCreatorState = {
  orientation: `x` | `y`;
  nodes: MindmapCreatorNode[];
  edges: MindmapDto['edges'];
  nodeForm: { is: `closed` } | { is: `active` };
  nodesRemovalConfirmation: { is: `closed` } | { is: `active` };
  mindmapForm: { is: `closed` } | { is: `active` };
};

export type {
  MindmapCreatorState,
  MindmapCreatorNode,
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
};
