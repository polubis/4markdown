import { getAPI, setCache } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { asBusy, asFail } from 'store/documents-creator/actions';

const { getState: get, setState: set } = useDocumentsCreatorState;

const createDocumentAct = async (
  payload: Pick<API4MarkdownPayload<'createDocument'>, 'name'>,
): AsyncResult => {
  try {
    asBusy();

    const { code, documents } = get();

    const createdDocument = await getAPI().call(`createDocument`)({
      ...payload,
      code,
    });

    const newDocuments = [createdDocument, ...documents];

    set({
      busy: false,
      activeDocumentId: createdDocument.id,
      documents: newDocuments,
      changed: false,
    });

    setCache(`getYourDocuments`, newDocuments);

    return { is: `ok` };
  } catch (error: unknown) {
    return asFail(error);
  }
};

export { createDocumentAct };
