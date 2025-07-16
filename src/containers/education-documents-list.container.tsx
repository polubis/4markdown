import React from "react";
import { EducationDocumentsList } from "components/education-documents-list";
import { RichEducationDocumentModel } from "models/page-models";
import {
  rawResourcesCompletionSelector,
  useResourcesCompletionState,
} from "modules/resources-completion";

type EducationDocumentsListContainerProps = {
  documents: RichEducationDocumentModel[];
};

const EducationDocumentsListContainer = ({
  documents,
}: EducationDocumentsListContainerProps) => {
  const completion = useResourcesCompletionState(
    rawResourcesCompletionSelector,
  );

  return (
    <EducationDocumentsList documents={documents} completion={completion} />
  );
};

export { EducationDocumentsListContainer };
