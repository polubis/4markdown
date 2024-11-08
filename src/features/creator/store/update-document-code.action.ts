import { getAPI } from 'api-4markdown';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';

const updateDocumentCode = async () => {
  const doc = docStoreSelectors.active();
  const { code } = creatorStoreSelectors.ready();

  const newDoc = {
    ...doc,
    code,
  };

  try {
    docManagementStoreActions.busy();
    const data = await getAPI().call(`updateDocumentCode`)({
      id: newDoc.id,
      code: newDoc.code,
      mdate: newDoc.mdate,
    });
    const updatedDoc = {
      ...newDoc,
      mdate: data.mdate,
    };

    docManagementStoreActions.ok();
    docsStoreActions.updateDoc(updatedDoc);
    docStoreActions.setActive(updatedDoc);
    creatorStoreActions.asUnchanged();
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
  }
};

export { updateDocumentCode };
