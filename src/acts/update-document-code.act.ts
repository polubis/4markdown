import { getAPI, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentsCreatorState } from 'store/documents-creator';

import { asBusy, asFail } from 'store/documents-creator/actions';
import { selectActiveDocument } from 'store/documents-creator/selectors';

const { getState: get, setState: set } = useDocumentsCreatorState;

const updateDocumentCodeAct = async (): AsyncResult => {
  try {
    asBusy();

    const { code, activeDocumentId, documents } = get();
    const activeDocument = selectActiveDocument({
      activeDocumentId,
      documents,
    });

    const newDocument = {
      ...activeDocument,
      code,
    };

    const { mdate } = await getAPI().call(`updateDocumentCode`)({
      id: newDocument.id,
      code: newDocument.code,
      mdate: newDocument.mdate,
    });

    const updatedDocument = {
      ...newDocument,
      mdate,
    };

    const newDocuments = documents.map((document) =>
      document.id === activeDocumentId ? updatedDocument : document,
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
