import type {
  Date,
  DocumentDto,
  Id,
  MarkdownContent,
  Path,
  Tags,
  Url,
  UserProfileDto,
  Visibility,
} from 'api-4markdown-contracts';
import type { Prettify } from 'development-kit/utility-types';

const MINDMAP_NODE_TYPES = [
  `document`,
  `external`,
  `embedded`,
  `nested`,
] as const;

type MindmapNodeType = (typeof MINDMAP_NODE_TYPES)[number];

type MakeNode<
  TType extends MindmapNodeType,
  TData extends Record<string, any>,
> = {
  id: Id;
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
  data: Prettify<
    TData & {
      name: string;
      path: Path;
      loading: boolean;
      description: string | null;
    }
  >;
};

type MakeEdge<TType extends string> = {
  id: Id;
  type: TType;
  source: Id;
  target: Id;
};

type DocumentNode = MakeNode<`document`, { document: DocumentDto }>;
type ExternalNode = MakeNode<`external`, { url: Url }>;
type EmbeddedNode = MakeNode<`embedded`, { content: MarkdownContent }>;
type NestedNode = MakeNode<`nested`, { id: Id }>;
type MindmapNode = DocumentNode | ExternalNode | EmbeddedNode | NestedNode;

type UnvisitedEdge = MakeEdge<`unvisited`>;
type VisitedEdge = MakeEdge<`visited`>;
type DoneEdge = MakeEdge<`done`>;
type MindmapEdge = UnvisitedEdge | VisitedEdge | DoneEdge;

type MindmapAuthor = UserProfileDto | null;

type MindmapDto = {
  id: Id;
  cdate: Date;
  mdate: Date;
  name: string;
  orientation: `x` | `y`;
  path: Path;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  visibility: Visibility;
  author: MindmapAuthor;
  description: string | null;
  tags: Tags | null;
};

export { MINDMAP_NODE_TYPES };
export type {
  MindmapNodeType,
  MindmapDto,
  MindmapNode,
  DocumentNode,
  ExternalNode,
  NestedNode,
  EmbeddedNode,
  UnvisitedEdge,
  VisitedEdge,
  DoneEdge,
  MindmapEdge,
  MindmapAuthor,
};
