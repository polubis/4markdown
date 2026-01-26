import React from "react";
import { useDocumentLayoutContext } from "providers/document-layout.provider";
import { ResourceActivityContainer } from "modules/resource-activity";
import { Atoms } from "api-4markdown-contracts";

type DocumentChangeHistoryContainerProps = {
  onClose(): void;
};

const DocumentChangeHistoryContainer = ({
  onClose,
}: DocumentChangeHistoryContainerProps) => {
  const [{ document }] = useDocumentLayoutContext();

  return (
    <ResourceActivityContainer
      resourceId={document.id as Atoms["DocumentId"]}
      resourceType="document"
      onClose={onClose}
    />
  );
};

export { DocumentChangeHistoryContainer };
