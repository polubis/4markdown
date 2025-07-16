import { Brand } from "development-kit/utility-types";

type Id = string;
type Name = string;
type MarkdownCode = string;
type DateStamp = string;
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

type ResourceId = DocumentId | MindmapNodeId;

type ResourceCompletionType = "document" | "mindmap" | "mindmap-node";

export type {
  Id,
  Name,
  MarkdownCode,
  MarkdownContent,
  Url,
  DateStamp,
  Tags,
  Path,
  Description,
  Base64,
  Slug,
  UserProfileId,
  CommentId,
  ResourceId,
  ResourceCompletionType,
};
