import React from "react";
import { DocumentCommentsContainer } from "./containers/document-comments.container";
import { DocumentCommentsProvider } from "./providers/document-comments.provider";
import { DocumentCommentsModuleProps } from "./models";

const DocumentCommentsModule = ({
  className,
  commentsCount,
  documentId,
  onCountChange,
}: DocumentCommentsModuleProps) => {
  return (
    <DocumentCommentsProvider
      documentId={documentId}
      commentsCount={commentsCount}
      onCountChange={onCountChange}
    >
      <DocumentCommentsContainer className={className} />
    </DocumentCommentsProvider>
  );
};

export { DocumentCommentsModule };
