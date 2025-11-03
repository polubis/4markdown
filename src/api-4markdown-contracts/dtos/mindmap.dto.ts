import type {
  AccessGroupId,
  Date,
  Id,
  MarkdownContent,
  Path,
  ResourceVisibility,
  Tags,
  Url,
} from "api-4markdown-contracts";
import { type SUID } from "development-kit/suid";

type MindmapNodeType = `external` | `embedded`;

type NodeBaseData = {
  name: string;
  path: `/${string}/`;
  description: string | null;
};

type MakeNode<
  TType extends MindmapNodeType,
  TData extends Record<string, any>,
> = {
  id: SUID;
  position: {
    x: number;
    y: number;
  };
  type: TType;
  data: TData;
};

type MakeEdge<TType extends string> = {
  id: SUID;
  type: TType;
  source: SUID;
  target: SUID;
};

type ExternalNode = MakeNode<`external`, NodeBaseData & { url: Url }>;
type EmbeddedNode = MakeNode<
  `embedded`,
  NodeBaseData & { content: MarkdownContent | null }
>;
type MindmapNode = ExternalNode | EmbeddedNode;

type SolidEdge = MakeEdge<`solid`>;
type MindmapEdge = SolidEdge;

type MindmapDto = {
  id: Id;
  cdate: Date;
  mdate: Date;
  name: string;
  sharedForGroups?: AccessGroupId[];
  orientation: `x` | `y`;
  path: Path;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  visibility: ResourceVisibility;
  description: string | null;
  tags: Tags | null;
};

export type {
  MindmapNodeType,
  MindmapDto,
  MindmapNode,
  ExternalNode,
  EmbeddedNode,
  SolidEdge,
  MindmapEdge,
};
