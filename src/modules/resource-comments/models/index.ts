import {
  API4MarkdownDto,
  CommentId,
  Etag,
  MindmapId,
  ParsedError,
  ResourceId,
  ResourceType,
} from "api-4markdown-contracts";

type ResourceComment =
  API4MarkdownDto<"getResourceComments">["comments"][number] & {
    rated?: boolean;
  };

type ResourceCommentsState = {
  comments: ResourceComment[];
  hasMore: boolean;
  nextCursor: API4MarkdownDto<"getResourceComments">["nextCursor"];
  idle: boolean;
  loading: boolean;
  busy: boolean;
  operationError: ParsedError | null;
  error: ParsedError | null;
  deleteCommentData: { id: CommentId; etag: Etag } | null;
  commentFormData: {
    type: "add" | "edit";
    data?: { id: CommentId; etag: Etag; content?: string };
  } | null;
};

type ResourceCommentsMeta = {
  type: ResourceType;
  resourceId: ResourceId;
  parentId?: MindmapId;
};

export type { ResourceCommentsState, ResourceCommentsMeta };
