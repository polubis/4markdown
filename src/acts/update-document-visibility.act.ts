import { getAPI, setCache } from 'api-4markdown';
import type {
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import type { AsyncResult } from 'development-kit/utility-types';
import { useDocumentsCreatorState } from 'store/documents-creator';
import { asBusy, asFail } from 'store/documents-creator/actions';
import { selectActiveDocument } from 'store/documents-creator/selectors';

type PrivatePayload = Pick<PrivateDocumentDto, 'visibility'>;
type PublicPayload = Pick<PublicDocumentDto, 'visibility'>;
type PermanentPayload = Pick<
  PermanentDocumentDto,
  'description' | 'name' | 'tags' | 'visibility'
>;

const { getState: get, setState: set } = useDocumentsCreatorState;

const updateDocumentVisibilityAct = async (
  payload: PrivatePayload | PublicPayload | PermanentPayload,
): AsyncResult => {
  try {
    asBusy();

    const state = get();
    const activeDocument = selectActiveDocument(state);

    const response = await getAPI().call(`updateDocumentVisibility`)({
      ...payload,
      id: activeDocument.id,
      mdate: activeDocument.mdate,
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

export { updateDocumentVisibilityAct };
