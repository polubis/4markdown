import { context, useFeature } from "@greenonsoftware/react-kit";
import { loadDocumentCommentsAct } from "../acts/load-document-comments.act";
import { Atoms } from "api-4markdown-contracts";
import { type DocumentCommentFormData } from "../models";
import { useQuery2 } from "core/use-query-2";

const [DocumentCommentsProvider, useDocumentCommentsContext] = context(
  ({
    documentId,
    commentsCount,
  }: {
    documentId: Atoms["DocumentId"];
    commentsCount: number;
  }) => {
    const commentForm = useFeature<DocumentCommentFormData>();

    const commentsQuery = useQuery2({
      initialize: false,
      resetable: false,
      handler: () =>
        loadDocumentCommentsAct({
          resourceId: documentId,
          nextCursor: null,
          limit: 10,
        }),
    });

    return {
      commentForm,
      commentsQuery,
      commentsCount,
      documentId,
    };
  },
);

export { DocumentCommentsProvider, useDocumentCommentsContext };
