import { getAPI, setCache } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { asBusy, asFail } from 'store/documents-creator/actions';
import { selectActiveDocument } from 'store/documents-creator/selectors';

const { getState: get, setState: set } = useDocumentsCreatorState;

const updateDocumentNameAct = async (
  name: API4MarkdownPayload<'updateDocumentName'>['name'],
): AsyncResult => {
  try {
    asBusy();

    const state = get();
    const activeDocument = selectActiveDocument(state);

    const response = await getAPI().call(`updateDocumentName`)({
      mdate: activeDocument.mdate,
      id: activeDocument.id,
      name,
    });

    const newDocuments = state.documents.map((document) =>
      document.id === activeDocument.id
        ? { ...document, ...response }
        : document,
    );

    set({
      busy: false,
      documents: newDocuments,
    });

    setCache(`getYourDocuments`, newDocuments);

    return { is: `ok` };
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { updateDocumentNameAct };
