import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { useDocumentsCreatorState } from '.';
import { getAPI, parseError, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';

const { getState: get, setState: set } = useDocumentsCreatorState;

const actCreateDocument = async (
  payload: Pick<API4MarkdownPayload<'createDocument'>, 'name'>,
): AsyncResult => {
  const { code, documents } = get();

  try {
    set({ busy: true, error: null });

    const createdDocument = await getAPI().call(`createDocument`)({
      ...payload,
      code,
    });

    const newDocuments = [...documents, createdDocument];

    set({
      busy: false,
      activeDocumentId: createdDocument.id,
      documents: newDocuments,
      changed: false,
    });

    setCache(`getYourDocuments`, newDocuments);

    return { is: `ok` };
  } catch (rawError: unknown) {
    const error = parseError(rawError);
    set({ busy: false, error });

    return { is: `fail`, error };
  }
};

export { actCreateDocument };
