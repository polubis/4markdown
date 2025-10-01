import { SUID } from "development-kit/suid";
import { Brand } from "development-kit/utility-types";

type Id = string;
type Name = string;
type MarkdownCode = string;
type Date = string;
type Tags = string[];
type Path = string;
type MarkdownContent = string;
type Description = string;
type Base64 = string;
type Slug = string;
type Url = string;

type UserProfileId = Brand<Id, `UserProfileId`>;
type CommentId = Brand<Id, `CommentId`>;
type DocumentId = Brand<Id, `DocumentId`>;
type MindmapNodeId = Brand<SUID, `MindmapNodeId`>;
type MindmapId = Brand<Id, `MindmapId`>;

const RESOURCE_VISIBILITIES = [
  "private",
  "public",
  "permanent",
  "manual",
] as const;

type ResourceVisibility = (typeof RESOURCE_VISIBILITIES)[number];

type ResourceId = DocumentId | MindmapNodeId | MindmapId;

const RESOURCE_TYPES = ["document", "mindmap", "mindmap-node"] as const;

type ResourceType = (typeof RESOURCE_TYPES)[number];

export { RESOURCE_TYPES, RESOURCE_VISIBILITIES };
export type {
  Id,
  Name,
  MarkdownCode,
  MarkdownContent,
  Url,
  Date,
  Tags,
  Path,
  Description,
  Base64,
  Slug,
  UserProfileId,
  CommentId,
  ResourceId,
  DocumentId,
  MindmapId,
  ResourceVisibility,
  MindmapNodeId,
  ResourceType,
};
