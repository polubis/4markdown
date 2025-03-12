import { docStoreActions } from 'store/doc/doc.store';
import { changeWithoutMarkAsUnchangedAction } from 'store/document-creator/actions';
import type { DocumentCreatorState } from 'store/document-creator/models';

const openInDocumentCreatorAct = (code: DocumentCreatorState['code']): void => {
  docStoreActions.reset();
  changeWithoutMarkAsUnchangedAction(code);
};

export { openInDocumentCreatorAct };
