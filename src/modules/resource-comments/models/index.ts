import { API4MarkdownPayload } from "api-4markdown-contracts";

type ResourceCommentsDocumentData = Omit<
  Extract<API4MarkdownPayload<"getResourceComments">, { type: "document" }>,
  "cursor" | "limit"
>;

type ResourceCommentsMindmapData = Omit<
  Extract<API4MarkdownPayload<"getResourceComments">, { type: "mindmap" }>,
  "cursor" | "limit"
>;

type ResourceCommentsMindmapNodeData = Omit<
  Extract<API4MarkdownPayload<"getResourceComments">, { type: "mindmap-node" }>,
  "cursor" | "limit"
>;

type ResourceCommentsModuleData =
  | ResourceCommentsDocumentData
  | ResourceCommentsMindmapData
  | ResourceCommentsMindmapNodeData;

export type { ResourceCommentsModuleData };
