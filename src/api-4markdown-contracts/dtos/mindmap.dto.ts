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

type MakeNode<TType extends string, TData extends Record<string, any>> = {
  id: Id;
  position: {
    x: number;
    y: number;
  };
  type: TType;
  data: Prettify<
    TData & {
      name: string;
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

type MakeMindmap<
  TVisibility extends Visibility,
  TData extends Record<string, any> = {},
> = TData & {
  id: Id;
  cdate: Date;
  mdate: Date;
  name: string;
  orientation: `x` | `y`;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  visibility: TVisibility;
};

type MindmapAuthor = UserProfileDto | null;

type Mindmap =
  | MakeMindmap<Visibility.Private, { description: string | null }>
  | MakeMindmap<
      Visibility.Public,
      { description: string | null; author: MindmapAuthor }
    >
  | MakeMindmap<
      Visibility.Permanent,
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
  NestedNode,
  EmbeddedNode,
  UnvisitedEdge,
  VisitedEdge,
  DoneEdge,
  MindmapEdge,
  MindmapAuthor,
};
