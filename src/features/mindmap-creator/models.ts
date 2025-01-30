import type {
  DocumentNode,
  EmbeddedNode,
  ExternalNode,
  NestedNode,
} from 'api-4markdown-contracts';

type DocumentNodeViewModel = DocumentNode & { selected: boolean };
type ExternalNodeViewModel = ExternalNode & { selected: boolean };
type EmbeddedNodeViewModel = EmbeddedNode & { selected: boolean };
type NestedNodeViewModel = NestedNode & { selected: boolean };

type NodeViewModel =
  | DocumentNodeViewModel
  | ExternalNodeViewModel
  | EmbeddedNodeViewModel
  | NestedNodeViewModel;

export type {
  NodeViewModel,
  DocumentNodeViewModel,
  ExternalNodeViewModel,
  EmbeddedNodeViewModel,
  NestedNodeViewModel,
};
