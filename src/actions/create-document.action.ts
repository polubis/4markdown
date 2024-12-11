import { getAPI, setCache } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions } from 'store/doc/doc.store';
import { docsStoreActions, docsStoreSelectors } from 'store/docs/docs.store';
import { useDocumentCreatorState } from 'store/document-creator';
import { markAsUnchangedAction } from 'store/document-creator/actions';

const createDocument = async (
  payload: Pick<API4MarkdownPayload<'createDocument'>, 'name'>,
): Promise<void> => {
  const { code } = useDocumentCreatorState.get();

  try {
    docManagementStoreActions.busy();
    const createdDoc = await getAPI().call(`createDocument`)({
      ...payload,
      code,
    });
    docManagementStoreActions.ok();
    docStoreActions.setActive(createdDoc);
    docsStoreActions.addDoc(createdDoc);
    markAsUnchangedAction();

    setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
    throw error;
  }
};

export { createDocument };
