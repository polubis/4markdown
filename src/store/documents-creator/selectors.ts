import type { DocumentDto } from 'api-4markdown-contracts';
import type { DocumentsCreatorState } from './models';

const findActiveDocument = ({
  documents,
  activeDocumentId,
}: Pick<
  DocumentsCreatorState,
  'documents' | 'activeDocumentId'
>): DocumentDto | null => {
  if (activeDocumentId === null) return null;

  const found = documents.find((document) => document.id === activeDocumentId);

  if (!found) return null;

  return found;
};

const selectActiveDocument = (state: DocumentsCreatorState): DocumentDto => {
  const found = findActiveDocument(state);

  if (!found) {
    throw Error(`Cannot find a document`);
  }

  return found;
};

export { findActiveDocument, selectActiveDocument };
