import { Atoms } from "api-4markdown-contracts";

type MindmapNodeCommentsModuleProps = {
  className?: string;
  commentsCount: number;
  mindmapId: Atoms["MindmapId"];
  mindmapNodeId: Atoms["MindmapNodeId"];
  onCountChange: (count: number) => void;
};

type MindmapNodeCommentFormData = {
  mode: "edit" | "add";
  commentId?: Atoms["MindmapNodeCommentId"];
  content?: string;
};

export type { MindmapNodeCommentsModuleProps, MindmapNodeCommentFormData };
