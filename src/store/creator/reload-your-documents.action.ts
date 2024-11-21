import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { getAPI } from 'api-4markdown';

const reloadYourDocuments = async (): Promise<void> => {
  try {
    docsStoreActions.idle();
    docManagementStoreActions.idle();
    docsStoreActions.busy();

    const documents = await getAPI().call(`getYourDocuments`)();

    docsStoreActions.ok(documents);
    docStoreActions.reset();
  } catch (error: unknown) {
    docsStoreActions.fail(error);
  }
};

export { reloadYourDocuments };
