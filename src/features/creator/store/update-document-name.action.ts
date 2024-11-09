import { getAPI } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { creatorStoreSelectors } from 'store/creator/creator.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';

const updateDocumentName = async (
  name: API4MarkdownPayload<'updateDocumentName'>['name'],
): Promise<void> => {
  try {
    const { code } = creatorStoreSelectors.ready();
    const activeDocument = docStoreSelectors.active();
    docManagementStoreActions.busy();
    const response = await getAPI().call(`updateDocumentName`)({
      mdate: activeDocument.mdate,
      id: activeDocument.id,
      name,
    });
    const updatedDocument = {
      ...activeDocument,
      code,
      name: response.name,
      mdate: response.mdate,
    };

    docManagementStoreActions.ok();
    docStoreActions.setActive(updatedDocument, false);
    docsStoreActions.updateDoc(updatedDocument);
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
    throw error;
  }
};

export { updateDocumentName };
