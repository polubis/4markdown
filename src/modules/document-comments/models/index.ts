import { Atoms } from "api-4markdown-contracts";
import { DocumentCommentFormContainerProps } from "../containers/document-comment-form.container";

type DocumentCommentsModuleProps = {
  className?: string;
  documentId: Atoms["DocumentId"];
  commentsCount: number;
  onCountChange(count: number): void;
};

type DocumentCommentFormData = Pick<
  DocumentCommentFormContainerProps,
  "mode" | "content" | "commentId"
>;

export type { DocumentCommentFormData, DocumentCommentsModuleProps };
