import { getAPI } from 'api-4markdown';
import { docsStoreActions, docsStoreSelectors } from 'store/docs/docs.store';

const getYourDocuments = async (): Promise<void> => {
  try {
    const { is } = docsStoreSelectors.state();

    if (is !== `idle`) return;

    docsStoreActions.busy();

    const documents = await getAPI().call(`getYourDocuments`)();

    docsStoreActions.ok(documents);
  } catch (error: unknown) {
    docsStoreActions.fail(error);
  }
};

export { getYourDocuments };
