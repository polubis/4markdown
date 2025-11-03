import { SUID } from "development-kit/suid";
import { Brand, Prettify } from "development-kit/utility-types";

export type Atoms = {
  UTCDate: Brand<string, `UTCDate`>;
  Etag: Brand<string, `Etag`>;
  AccessGroupId: Brand<string, `AccessGroupId`>;
  UserProfileId: Brand<string, `UserProfileId`>;
  DocumentId: Brand<string, `DocumentId`>;
  MindmapId: Brand<string, `MindmapId`>;
  MindmapNodeId: Brand<SUID, `MindmapNodeId`>;
  ResourceId: Atoms["DocumentId"] | Atoms["MindmapId"] | Atoms["MindmapNodeId"];
  ResourceType: "document" | "mindmap" | "mindmap-node";
  ResourceVisibility: "private" | "public" | "permanent" | "manual";
  RatingCategory: "ugly" | "bad" | "decent" | "good" | "perfect";
  ImageId: Brand<string, `ImageId`>;
  Path: Brand<string, `Path`>;
  Slug: Brand<string, `Slug`>;
  Url: Brand<string, `Url`>;
  RewriteAssistantPersona: "cleany" | "grammy" | "teacher";
  CommentId: Brand<string, `CommentId`>;
  AvatarVariantId: Brand<string, `AvatarVariantId`>;
  AvatarVariant: {
    w: number;
    h: number;
    id: Atoms["AvatarVariantId"];
    src: Atoms["Path"];
  };
};

export type AccessGroupDto = {
  id: Atoms["AccessGroupId"];
  cdate: Atoms["UTCDate"];
  etag: Atoms["Etag"];
  mdate: Atoms["UTCDate"];
  name: string;
  description: string | null;
  members: Atoms["UserProfileId"][];
};

export type ResourceCompletionDto = {
  cdate: Atoms["UTCDate"];
  type: Atoms["ResourceType"];
  resourceId: Atoms["ResourceId"];
  parentId?: Atoms["MindmapId"];
};

export type RatingDto = Record<Atoms["RatingCategory"], number>;

export type ImageDto = {
  extension: `png` | `jpeg` | `jpg` | `gif` | `webp`;
  contentType:
    | `image/png`
    | `image/jpeg`
    | `image/jpg`
    | `image/gif`
    | `image/webp`;
  url: Atoms["Path"];
  id: Atoms["ImageId"];
};

export type UserProfileDto = {
  id: Atoms["UserProfileId"];
  cdate: Atoms["UTCDate"];
  mdate: Atoms["UTCDate"];
  displayNameSlug: Atoms["Slug"] | null;
  displayName: string | null;
  bio: string | null;
  avatar: Record<"tn" | "sm" | "md" | "lg", Atoms["AvatarVariant"]> | null;
  githubUrl: Atoms["Url"] | null;
  linkedInUrl: Atoms["Url"] | null;
  twitterUrl: Atoms["Url"] | null;
  fbUrl: Atoms["Url"] | null;
  blogUrl: Atoms["Url"] | null;
};

export type CommentDto = Prettify<
  RatingDto & {
    id: Atoms["CommentId"];
    ownerProfile: UserProfileDto;
    cdate: Atoms["UTCDate"];
    mdate: Atoms["UTCDate"];
    content: string;
  }
>;

export type YourAccountDto = {
  balance: {
    tokens: number;
    refillStatus: "initialized" | "refilled" | "not-refilled";
  };
  trusted: boolean;
};

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

export type ExternalNode = MakeNode<
  `external`,
  NodeBaseData & { url: Atoms["Url"] }
>;
export type EmbeddedNode = MakeNode<
  `embedded`,
  NodeBaseData & { content: string | null }
>;
type MindmapNode = ExternalNode | EmbeddedNode;

export type SolidEdge = MakeEdge<`solid`>;
type MindmapEdge = SolidEdge;

export type MindmapDto = {
  id: Atoms["MindmapId"];
  cdate: Atoms["UTCDate"];
  mdate: Atoms["UTCDate"];
  name: string;
  sharedForGroups?: Atoms["AccessGroupId"][];
  orientation: `x` | `y`;
  path: Atoms["Path"];
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  visibility: Atoms["ResourceVisibility"];
  description: string | null;
  tags: string[] | null;
};

export type FullMindmapDto = MindmapDto & {
  authorId: Atoms["UserProfileId"];
  authorProfile: UserProfileDto | null;
  isAuthorTrusted: boolean;
};

type Base = {
  id: Atoms["DocumentId"];
  name: string;
  code: string;
  mdate: Atoms["UTCDate"];
  cdate: Atoms["UTCDate"];
  sharedForGroups?: Atoms["AccessGroupId"][];
  path: Atoms["Path"];
};

export type PrivateDocumentDto = Base & {
  visibility: "private";
};

export type PublicDocumentDto = Base & {
  visibility: "public";
  author: UserProfileDto | null;
  rating: RatingDto;
};

export type PermanentDocumentDto = Base & {
  visibility: `permanent`;
  description: string;
  tags: string[];
  author: UserProfileDto | null;
  rating: RatingDto;
};

export type ManualDocumentDto = Base & {
  visibility: "manual";
  author: UserProfileDto | null;
  rating: RatingDto;
};

export type DocumentDto =
  | PrivateDocumentDto
  | PublicDocumentDto
  | PermanentDocumentDto
  | ManualDocumentDto;
