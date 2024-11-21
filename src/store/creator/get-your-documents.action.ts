import { getAPI, getCache, setCache } from 'api-4markdown';
import { docsStoreActions, docsStoreSelectors } from 'store/docs/docs.store';

const getYourDocuments = async (): Promise<void> => {
  try {
    const { is } = docsStoreSelectors.state();

    if (is !== `idle`) return;

    const cachedDocuments = getCache(`getYourDocuments`);

    if (cachedDocuments !== null) {
      docsStoreActions.ok(cachedDocuments);
      return;
    }

    docsStoreActions.busy();

    const documents = await getAPI().call(`getYourDocuments`)();

    setCache(`getYourDocuments`, documents);

    docsStoreActions.ok(documents);
  } catch (error: unknown) {
    docsStoreActions.fail(error);
  }
};

export { getYourDocuments };
