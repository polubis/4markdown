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
type MindmapNodeId = Brand<Id, `MindmapNodeId`>;
type MindmapId = Brand<Id, `MindmapId`>;

type ResourceId = DocumentId | MindmapNodeId | MindmapId;

const RESOURCE_TYPES = ["document", "mindmap", "mindmap-node"] as const;

type ResourceType = (typeof RESOURCE_TYPES)[number];

export { RESOURCE_TYPES };
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
  MindmapNodeId,
  ResourceType,
};
