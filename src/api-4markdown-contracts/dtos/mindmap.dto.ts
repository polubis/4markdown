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

export const mindmapNodeTypes = [
  `document`,
  `external`,
  `embedded`,
  `nested`,
] as const;

export type MindmapNodeType = (typeof mindmapNodeTypes)[number];

type MakeNode<
  TType extends MindmapNodeType,
  TData extends Record<string, any>,
> = {
  id: Id;
  position: {
    x: number;
    y: number;
  };
  type: TType;
  selected: boolean;
  data: Prettify<
    TData & {
      name: string;
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

type PrivateMindmapDto = MakeMindmap<
  Visibility.Private,
  { description: string | null }
>;

type PublicMindmapDto = MakeMindmap<
  Visibility.Public,
  { description: string | null; author: MindmapAuthor }
>;

type PermanentMindmapDto = MakeMindmap<
  Visibility.Permanent,
  {
    path: Path;
    description: string;
    tags: Tags;
    author: MindmapAuthor;
  }
>;

type MindmapDto = PrivateMindmapDto | PublicMindmapDto | PermanentMindmapDto;

export type {
  PrivateMindmapDto,
  PublicMindmapDto,
  PermanentMindmapDto,
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
