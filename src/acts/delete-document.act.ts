import { getAPI, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { asBusy, asFail } from 'store/documents-creator/actions';

const { getState: get, setState: set } = useDocumentsCreatorState;

const deleteDocumentAct = async (): AsyncResult => {
  try {
    asBusy();

    const { activeDocumentId, documents, initialCode } = get();

    if (activeDocumentId === null)
      throw Error(`Cannot find document to remove`);

    await getAPI().call(`deleteDocument`)({ id: activeDocumentId });

    const newDocuments = documents.filter(
      (document) => document.id !== activeDocumentId,
    );

    set({
      busy: false,
      code: initialCode,
      activeDocumentId: null,
      documents: newDocuments,
      changed: false,
    });

    setCache(`getYourDocuments`, newDocuments);

    return { is: `ok` };
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { deleteDocumentAct };
