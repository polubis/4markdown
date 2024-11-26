import { getAPI, getCache, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { asBusy, asFail } from 'store/documents-creator/actions';

const { setState: set } = useDocumentsCreatorState;

const getYourDocumentsAct = async (): AsyncResult => {
  try {
    const cachedDocuments = getCache(`getYourDocuments`);

    if (cachedDocuments !== null) {
      set({ documents: cachedDocuments, busy: false });
      return { is: `ok` };
    }

    asBusy();

    const documents = await getAPI().call(`getYourDocuments`)();

    setCache(`getYourDocuments`, documents);

    set({ documents, busy: false });

    return { is: `ok` };
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { getYourDocumentsAct };
