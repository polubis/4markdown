import { getAPI, setCache } from "api-4markdown";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docStoreActions, docStoreSelectors } from "store/doc/doc.store";
import { docsStoreActions, docsStoreSelectors } from "store/docs/docs.store";
import { resetAction } from "store/document-creator/actions";

const deleteDocument = async (onOk?: () => void): Promise<void> => {
  try {
    const id = docStoreSelectors.active().id;

    docManagementStoreActions.busy();
    await getAPI().call(`deleteDocument`)({ id });

    docManagementStoreActions.ok();
    docsStoreActions.deleteDoc(id);
    docStoreActions.reset();
    resetAction();

    setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);

    onOk?.();
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
  }
};

export { deleteDocument };
