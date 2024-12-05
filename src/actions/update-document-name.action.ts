import { getAPI, setCache } from 'api-4markdown';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import { docsStoreActions, docsStoreSelectors } from 'store/docs/docs.store';

const updateDocumentName = async (
  name: API4MarkdownPayload<'updateDocumentName'>['name'],
): Promise<void> => {
  try {
    const { code } = creatorStoreSelectors.state();
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
    creatorStoreActions.changeWithoutMarkAsUnchanged(updatedDocument.code);
    docStoreActions.setActiveWithoutCodeChange(updatedDocument);
    docsStoreActions.updateDoc(updatedDocument);

    setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
    throw error;
  }
};

export { updateDocumentName };
