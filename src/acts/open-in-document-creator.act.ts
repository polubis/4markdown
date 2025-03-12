import { docStoreActions } from 'store/doc/doc.store';
import { useDocumentCreatorState } from 'store/document-creator';
import type { DocumentCreatorState } from 'store/document-creator/models';

const openInDocumentCreatorAct = (code: DocumentCreatorState['code']): void => {
  docStoreActions.reset();
  useDocumentCreatorState.set({ changed: false, code });
};

export { openInDocumentCreatorAct };
