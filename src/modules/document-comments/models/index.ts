import { DocumentCommentFormContainerProps } from "../containers/document-comment-form.container";

type DocumentCommentFormData = Pick<
  DocumentCommentFormContainerProps,
  "mode" | "content" | "commentId"
>;

export type { DocumentCommentFormData };
