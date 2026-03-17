import React from "react";
import { useDocumentLayoutContext } from "providers/document-layout.provider";
import { Atoms } from "api-4markdown-contracts";

type DocumentChangeHistoryContainerProps = {
  onClose(): void;
};

const ResourceActivityContainer = React.lazy(() =>
  import("modules/resource-activity").then(({ ResourceActivityContainer }) => ({
    default: ResourceActivityContainer,
  })),
);

const DocumentChangeHistoryContainer = ({
  onClose,
}: DocumentChangeHistoryContainerProps) => {
  const [{ document }] = useDocumentLayoutContext();

  return (
    <React.Suspense>
      <ResourceActivityContainer
        resourceId={document.id as Atoms["DocumentId"]}
        resourceType="document"
        resourceCdate={document.cdate}
        onClose={onClose}
      />
    </React.Suspense>
  );
};

export { DocumentChangeHistoryContainer };
