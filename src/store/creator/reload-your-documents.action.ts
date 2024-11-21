import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';
import { getYourDocuments } from './get-your-documents.action';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';

const reloadYourDocuments = (): void => {
  docsStoreActions.idle();
  docManagementStoreActions.idle();
  getYourDocuments(docStoreActions.reset);
};

export { reloadYourDocuments };
