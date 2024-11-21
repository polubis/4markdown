import { getAPI } from 'api-4markdown';
import type {
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import type { DocumentCreatorViewModel } from 'models/view-models';
import { creatorStoreSelectors } from 'store/creator/creator.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import { docsStoreActions } from 'store/docs/docs.store';

type PrivatePayload = Pick<PrivateDocumentDto, 'visibility'>;
type PublicPayload = Pick<PublicDocumentDto, 'visibility'>;
type PermanentPayload = Pick<
  PermanentDocumentDto,
  'description' | 'name' | 'tags' | 'visibility'
>;

const updateDocumentVisibility = async (
  payload: PrivatePayload | PublicPayload | PermanentPayload,
): Promise<void> => {
  try {
    const { code } = creatorStoreSelectors.ready();
    const { id, mdate } = docStoreSelectors.active();
    docManagementStoreActions.busy();

    const response = await getAPI().call(`updateDocumentVisibility`)({
      id,
      mdate,
      ...payload,
    });
    const updatedDocument: DocumentCreatorViewModel['document'] = {
      ...response,
      code,
    };
    docManagementStoreActions.ok();
    docStoreActions.setActive(updatedDocument, false);
    docsStoreActions.updateDoc(updatedDocument);
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
    throw error;
  }
};

export { updateDocumentVisibility };
