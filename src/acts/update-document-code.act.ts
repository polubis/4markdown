import { getAPI, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentsCreatorState } from 'store/documents-creator';

import { asBusy, asFail } from 'store/documents-creator/actions';
import { selectActiveDocument } from 'store/documents-creator/selectors';

const { getState: get, setState: set } = useDocumentsCreatorState;

const updateDocumentCodeAct = async (): AsyncResult => {
  try {
    asBusy();

    const state = get();
    const activeDocument = selectActiveDocument(state);

    const response = await getAPI().call(`updateDocumentCode`)({
      id: activeDocument.id,
      code: state.code,
      mdate: activeDocument.mdate,
    });

    const { documents } = get();
    const newDocuments = documents.map((document) =>
      document.id === activeDocument.id
        ? { ...document, ...response }
        : document,
    );

    set({
      changed: false,
      busy: false,
      documents: newDocuments,
    });

    setCache(`getYourDocuments`, newDocuments);

    return { is: `ok` };
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { updateDocumentCodeAct };
