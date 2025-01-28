import type {
  DocumentDto,
  Id,
  MarkdownContent,
  Url,
} from 'api-4markdown-contracts';
import type { Prettify } from 'development-kit/utility-types';

type Node<TType extends string, TData extends Record<string, unknown>> = {
  id: Id;
  position: {
    x: number;
    y: number;
  };
  type: TType;
  data: Prettify<
    TData & {
      name: string;
      description: string;
    }
  >;
};

type Edge<TType extends string> = {
  id: Id;
  type: TType;
  source: Id;
  target: Id;
};

type DocumentNode = Node<`document`, { document: DocumentDto }>;
type ExternalNode = Node<`external`, { url: Url }>;
type EmbeddedNode = Node<`embedded`, { content: MarkdownContent }>;
type NestedNode = Node<`nested`, { id: Id }>;
type MindmapNode = DocumentNode | ExternalNode | EmbeddedNode | NestedNode;

type UnvisitedEdge = Edge<`unvisited`>;
type VisitedEdge = Edge<`visited`>;
type CheckedEdge = Edge<`checked`>;
type MindmapEdge = UnvisitedEdge | VisitedEdge | CheckedEdge;

type Mindmap = {
  id: Id;
  name: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
};

export type { Mindmap, MindmapNode, DocumentNode, ExternalNode, EmbeddedNode };
