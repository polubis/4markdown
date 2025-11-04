import { context, useFeature } from "@greenonsoftware/react-kit";
import { loadDocumentCommentsAct } from "../acts/load-document-comments.act";
import {
  DocumentCommentsModuleProps,
  type DocumentCommentFormData,
} from "../models";
import { useQuery2 } from "core/use-query-2";

const [DocumentCommentsProvider, useDocumentCommentsContext] = context(
  ({
    documentId,
    commentsCount,
    onCountChange,
  }: Pick<
    DocumentCommentsModuleProps,
    "documentId" | "commentsCount" | "onCountChange"
  >) => {
    const commentForm = useFeature<DocumentCommentFormData>();

    const commentsQuery = useQuery2({
      initialize: false,
      handler: () =>
        loadDocumentCommentsAct({
          resourceId: documentId,
          nextCursor: null,
          limit: 10,
        }),
      onOk: (newData) => {
        onCountChange(newData.comments.length);
      },
    });

    return {
      commentForm,
      commentsQuery,
      commentsCount,
      documentId,
      onCountChange,
    };
  },
);

export { DocumentCommentsProvider, useDocumentCommentsContext };
