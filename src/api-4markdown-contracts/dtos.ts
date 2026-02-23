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
  ScoreValue: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  ImageId: Brand<string, `ImageId`>;
  Path: Brand<string, `Path`>;
  Slug: Brand<string, `Slug`>;
  Url: Brand<string, `Url`>;
  RewriteAssistantPersona: "cleany" | "grammy" | "teacher";
  UserProfileCommentId: Brand<string, `UserProfileCommentId`>;
  AvatarVariantId: Brand<string, `AvatarVariantId`>;
  AvatarVariant: {
    w: number;
    h: number;
    id: Atoms["AvatarVariantId"];
    src: Atoms["Path"];
  };
  DocumentCommentId: Brand<string, `DocumentCommentId`>;
  MindmapNodeCommentId: Brand<string, `MindmapNodeCommentId`>;
  ResourceActivityId: Brand<string, `ResourceActivityId`>;
  Rating: Record<Atoms["RatingCategory"], number>;
  Score: {
    scoreAverage: number;
    scoreCount: number;
    scoreValues: Atoms["ScoreValue"][];
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

export type ResourceLikeDto = {
  cdate: Atoms["UTCDate"];
  type: Atoms["ResourceType"];
  resourceId: Atoms["ResourceId"];
  parentId?: Atoms["MindmapId"];
  title: string;
  description?: string;
};

/** One item in the setUserResourceLike request payload. */
export type SetUserResourceLikeItem =
  | {
      type: "document";
      resourceId: Atoms["DocumentId"];
      title: string;
      description?: string;
      liked: boolean;
    }
  | {
      type: "mindmap";
      resourceId: Atoms["MindmapId"];
      title: string;
      description?: string;
      liked: boolean;
    }
  | {
      type: "mindmap-node";
      resourceId: Atoms["MindmapNodeId"];
      parentId: Atoms["MindmapId"];
      title: string;
      description?: string;
      liked: boolean;
    };

/** One item in the setUserResourceLike response (batch result). */
export type SetUserResourceLikeResultItem = ResourceLikeDto & {
  removed: boolean;
};

/** Single item payload without `liked` (e.g. for toggle hook). */
export type SetUserResourceLikePayloadWithoutLiked =
  | {
      type: "document";
      resourceId: Atoms["DocumentId"];
      title: string;
      description?: string;
    }
  | {
      type: "mindmap";
      resourceId: Atoms["MindmapId"];
      title: string;
      description?: string;
    }
  | {
      type: "mindmap-node";
      resourceId: Atoms["MindmapNodeId"];
      parentId: Atoms["MindmapId"];
      title: string;
      description?: string;
    };

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

export type UserProfileDto = Prettify<
  {
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
  } & Partial<Atoms["Rating"]> &
    Partial<Atoms["Score"]>
>;

export type UserProfileCommentDto = Prettify<
  Atoms["Rating"] & {
    id: Atoms["UserProfileCommentId"];
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

type Base = Prettify<{
  id: Atoms["DocumentId"];
  name: string;
  commentsCount: number;
  code: string;
  mdate: Atoms["UTCDate"];
  cdate: Atoms["UTCDate"];
  sharedForGroups?: Atoms["AccessGroupId"][];
  path: Atoms["Path"];
  score: {
    average: number;
    count: number;
    values: Atoms["ScoreValue"][];
  };
}>;

export type PrivateDocumentDto = Prettify<
  Base & {
    visibility: "private";
  }
>;

export type PublicDocumentDto = Prettify<
  Base & {
    visibility: "public";
    author: UserProfileDto | null;
    rating: Atoms["Rating"];
  }
>;

export type PermanentDocumentDto = Prettify<
  Base & {
    visibility: `permanent`;
    description: string;
    tags: string[];
    author: UserProfileDto | null;
    rating: Atoms["Rating"];
  }
>;

export type ManualDocumentDto = Prettify<
  Base & {
    visibility: "manual";
    author: UserProfileDto | null;
    rating: Atoms["Rating"];
  }
>;

export type DocumentDto =
  | PrivateDocumentDto
  | PublicDocumentDto
  | PermanentDocumentDto
  | ManualDocumentDto;

export type DocumentCommentDto = Prettify<
  Atoms["Rating"] & {
    id: Atoms["DocumentCommentId"];
    ownerProfile: UserProfileDto;
    cdate: Atoms["UTCDate"];
    mdate: Atoms["UTCDate"];
    content: string;
    etag: Atoms["Etag"];
    resourceId: Atoms["DocumentId"];
  }
>;

export type MindmapNodeCommentDto = Prettify<
  Atoms["Rating"] & {
    id: Atoms["MindmapNodeCommentId"];
    ownerProfile: UserProfileDto;
    cdate: Atoms["UTCDate"];
    mdate: Atoms["UTCDate"];
    content: string;
    etag: Atoms["Etag"];
    resourceId: Atoms["MindmapNodeId"];
  }
>;

export type ResourceActivityDto =
  | {
      id: Atoms["ResourceActivityId"];
      type: "created";
      resourceId: Atoms["ResourceId"];
      resourceType: Atoms["ResourceType"];
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
    }
  | {
      id: Atoms["ResourceActivityId"];
      type: "content-changed";
      resourceId: Atoms["ResourceId"];
      resourceType: Atoms["ResourceType"];
      previousContent: string;
      newContent: string;
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
    }
  | {
      id: Atoms["ResourceActivityId"];
      type: "visibility-changed";
      resourceId: Atoms["ResourceId"];
      resourceType: Atoms["ResourceType"];
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousVisibility: Atoms["ResourceVisibility"];
      newVisibility: Atoms["ResourceVisibility"];
    }
  | {
      id: Atoms["ResourceActivityId"];
      type: "metadata-updated";
      resourceId: Atoms["ResourceId"];
      resourceType: Atoms["ResourceType"];
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousMeta: {
        tags: string[];
        description: string | null;
      };
      newMeta: {
        tags: string[];
        description: string | null;
      };
    }
  | {
      id: Atoms["ResourceActivityId"];
      type: "comment-added";
      resourceId: Atoms["ResourceId"];
      resourceType: Atoms["ResourceType"];
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      comment: UserProfileCommentDto;
    }
  | {
      id: Atoms["ResourceActivityId"];
      type: "rating-changed";
      resourceId: Atoms["ResourceId"];
      resourceType: Atoms["ResourceType"];
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousRating: Atoms["Rating"];
      newRating: Atoms["Rating"];
    }
  | {
      id: Atoms["ResourceActivityId"];
      type: "score-changed";
      resourceId: Atoms["ResourceId"];
      resourceType: Atoms["ResourceType"];
      cdate: Atoms["UTCDate"];
      authorProfile: UserProfileDto | null;
      previousScore: Atoms["Score"];
      newScore: Atoms["Score"];
    };
