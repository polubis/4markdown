import type {
  Date,
  DocumentDto,
  Id,
  MarkdownContent,
  Path,
  Tags,
  Url,
  UserProfileDto,
} from 'api-4markdown-contracts';
import type { Prettify } from 'development-kit/utility-types';

type MakeNode<TType extends string, TData extends Record<string, unknown>> = {
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
type CheckedEdge = MakeEdge<`checked`>;
type MindmapEdge = UnvisitedEdge | VisitedEdge | CheckedEdge;

type MakeMindmap<
  TVisibility extends string,
  TData extends Record<string, unknown> = {},
> = TData & {
  id: Id;
  cdate: Date;
  mdate: Date;
  name: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  visibility: TVisibility;
};

type MindmapAuthor = UserProfileDto | null;

type Mindmap =
  | MakeMindmap<`private`>
  | MakeMindmap<`public`, { author: MindmapAuthor }>
  | MakeMindmap<
      `permanent`,
      {
        path: Path;
        description: string;
        tags: Tags;
        author: MindmapAuthor;
      }
    >;

export type {
  Mindmap,
  MindmapNode,
  DocumentNode,
  ExternalNode,
  EmbeddedNode,
  UnvisitedEdge,
  VisitedEdge,
  CheckedEdge,
  MindmapEdge,
  MindmapAuthor,
};
