import type {
  EmbeddedNode,
  ExternalNode,
  MindmapDto,
  SolidEdge,
} from "api-4markdown-contracts";
import type { Transaction } from "development-kit/utility-types";

type NodeBase = {
  measured?: {
    height: number;
    width: number;
  };
  selected?: boolean;
  dragging?: boolean;
};

type MindmapCreatorEmbeddedNode = EmbeddedNode & NodeBase;
type MindmapCreatorExternalNode = ExternalNode & NodeBase;

type MindmapCreatorSolidEdge = SolidEdge;
type MindmapCreatorEdge = MindmapCreatorSolidEdge;

type MindmapCreatorNode =
  | MindmapCreatorEmbeddedNode
  | MindmapCreatorExternalNode;

type MindmapCreatorState = {
  orientation: MindmapDto["orientation"];
  nodes: MindmapCreatorNode[];
  edges: MindmapCreatorEdge[];
  nodeForm:
    | { is: `closed` }
    | { is: `active` }
    | ({ is: `edition` } & MindmapCreatorNode);
  nodesRemovalConfirmation: { is: `closed` } | { is: `active` };
  changesCount: number;
  mindmapForm:
    | { is: `closed` }
    | { is: `active` }
    | ({ is: `edition` } & MindmapDto);
  activeMindmapId: MindmapDto["id"] | null;
  mindmaps: Transaction<{ data: MindmapDto[] }>;
  yourMindmapsView: { is: `closed` } | { is: `active` };
  nodePreview:
    | { is: `closed` }
    | ({ is: `active` } & MindmapCreatorEmbeddedNode);
  operation: Transaction;
  mindmapDetails: { is: `on` } | { is: `off` };
  headerVisible: boolean;
};

export type {
  MindmapCreatorState,
  MindmapCreatorNode,
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
  MindmapCreatorEdge,
  MindmapCreatorSolidEdge,
};
