import type {
  DocumentNode,
  EmbeddedNode,
  ExternalNode,
  Id,
  NestedNode,
} from 'api-4markdown-contracts';

type DocumentNodeViewModel = DocumentNode & { selected: boolean };
type ExternalNodeViewModel = ExternalNode & { selected: boolean };
type EmbeddedNodeViewModel = EmbeddedNode & { selected: boolean };
type NestedNodeViewModel = NestedNode & { selected: boolean };
type PendingNodeViewModel = {
  id: Id;
  position: {
    x: number;
    y: number;
  };
  type: `pending`;
  data: {};
} & { selected: boolean };

type NodeViewModel =
  | DocumentNodeViewModel
  | ExternalNodeViewModel
  | EmbeddedNodeViewModel
  | NestedNodeViewModel
  | PendingNodeViewModel;

export type {
  NodeViewModel,
  DocumentNodeViewModel,
  ExternalNodeViewModel,
  EmbeddedNodeViewModel,
  NestedNodeViewModel,
  PendingNodeViewModel,
};
