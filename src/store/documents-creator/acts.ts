import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { useDocumentsCreatorState } from '.';
import { getAPI, getCache, parseError, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';

const { getState: get, setState: set } = useDocumentsCreatorState;

const handleStart = (): void => {
  set({ busy: true, error: null });
};

const handleError = (
  rawError: unknown,
): Extract<Awaited<AsyncResult>, { is: `fail` }> => {
  const error = parseError(rawError);

  set({ busy: false, error });

  return { is: `fail`, error };
};

const actCreateDocument = async (
  payload: Pick<API4MarkdownPayload<'createDocument'>, 'name'>,
): AsyncResult => {
  try {
    handleStart();

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
    return handleError(error);
  }
};

const actDeleteDocument = async (): AsyncResult => {
  try {
    handleStart();

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
    return handleError(error);
  }
};

const actGetYourDocuments = async (): AsyncResult => {
  try {
    const cachedDocuments = getCache(`getYourDocuments`);

    if (cachedDocuments !== null) {
      set({ documents: cachedDocuments, busy: false });
      return { is: `ok` };
    }

    handleStart();

    const documents = await getAPI().call(`getYourDocuments`)();

    setCache(`getYourDocuments`, documents);

    set({ documents, busy: false });

    return { is: `ok` };
  } catch (error: unknown) {
    return handleError(error);
  }
};

export { actCreateDocument, actDeleteDocument, actGetYourDocuments };
