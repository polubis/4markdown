import React from "react";
import { EducationDocumentsList } from "components/education-documents-list";
import { RichEducationDocumentModel } from "models/page-models";
import { useResourcesCompletionState } from "modules/resources-completion";

type EducationDocumentsListContainerProps = {
  documents: RichEducationDocumentModel[];
};

const EducationDocumentsListContainer = ({
  documents,
}: EducationDocumentsListContainerProps) => {
  const resourcesCompletionState = useResourcesCompletionState();

  return (
    <EducationDocumentsList
      documents={documents}
      completion={
        resourcesCompletionState.is === "ok"
          ? resourcesCompletionState.completion
          : {}
      }
    />
  );
};

export { EducationDocumentsListContainer };
