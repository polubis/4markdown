import React from "react";
import { Atoms } from "api-4markdown-contracts";
import { DocumentCommentsContainer } from "./containers/document-comments.container";
import { DocumentCommentsProvider } from "./providers/document-comments.provider";

type DocumentCommentsModuleProps = {
  className?: string;
  documentId: Atoms["DocumentId"];
  commentsCount: number;
};

const DocumentCommentsModule = ({
  className,
  commentsCount,
  documentId,
}: DocumentCommentsModuleProps) => {
  return (
    <DocumentCommentsProvider
      documentId={documentId}
      commentsCount={commentsCount}
    >
      <DocumentCommentsContainer className={className} />
    </DocumentCommentsProvider>
  );
};

export { DocumentCommentsModule };
