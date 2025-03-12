import { docStoreActions } from 'store/doc/doc.store';
import { changeWithoutMarkAsUnchangedAction } from 'store/document-creator/actions';
import type { DocumentCreatorState } from 'store/document-creator/models';
import { setDocumentCodeAction } from 'store/metadata/actions';

const openInDocumentCreatorAct = (
  documentCode: DocumentCreatorState['code'],
): void => {
  docStoreActions.reset();
  changeWithoutMarkAsUnchangedAction(documentCode);
  setDocumentCodeAction(documentCode);
};

export { openInDocumentCreatorAct };
