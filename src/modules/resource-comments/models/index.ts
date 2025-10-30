import { API4MarkdownPayload } from "api-4markdown-contracts";

type OnChange = (
  type: "add" | "delete",
  meta: { commentsCount: number },
) => void;

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

type ResourceCommentsProviderProps = (
  | ResourceCommentsDocumentData
  | ResourceCommentsMindmapData
  | ResourceCommentsMindmapNodeData
) & { commentsCount: number; onChange: OnChange };

export type { ResourceCommentsProviderProps };
