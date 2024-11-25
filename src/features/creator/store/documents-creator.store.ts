import { create } from 'zustand';
import type { DocumentsCreatorState } from './documents-creator.models';
import type { DocumentDto } from 'api-4markdown-contracts';

const useDocumentsCreatorState = create<DocumentsCreatorState>(() => ({
  documents: [],
  activeDocumentId: null,
  initialCode: ``,
  code: ``,
  changed: false,
  display: `both`,
  busy: false,
  error: null,
}));

const { setState: set, getState: get } = useDocumentsCreatorState;

const setCode = (code: DocumentsCreatorState['code']): void => {
  set({ code });
};

const setDisplay = (display: DocumentsCreatorState['display']): void => {
  set({ display });
};

const divideDisplay = (): void => {
  const { display } = get();

  if (display === `both`) {
    setDisplay(`code`);
    return;
  }

  if (display === `code`) {
    setDisplay(`preview`);
    return;
  }

  setDisplay(`both`);
};

const findActiveDocument = ({
  documents,
  activeDocumentId,
}: Pick<
  DocumentsCreatorState,
  'documents' | 'activeDocumentId'
>): DocumentDto | null => {
  if (activeDocumentId === null) {
    return null;
  }

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

export {
  useDocumentsCreatorState,
  setCode,
  setDisplay,
  divideDisplay,
  selectActiveDocument,
};
