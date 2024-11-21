import { getAPI } from 'api-4markdown';
import { docsStoreActions } from 'store/docs/docs.store';

const getYourDocuments = async (onOk?: () => void): Promise<void> => {
  try {
    docsStoreActions.busy();

    const docs = await getAPI().call(`getYourDocuments`)();

    docsStoreActions.ok(docs);

    onOk?.();
  } catch (error: unknown) {
    docsStoreActions.fail(error);
  }
};

export { getYourDocuments };
