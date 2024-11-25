import { getAPI, setCache } from 'api-4markdown';
import type {
  API4MarkdownDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import {
  creatorStoreActions,
  creatorStoreSelectors,
} from 'store/creator/creator.store';
import { docManagementStoreActions } from 'store/doc-management/doc-management.store';
import { docStoreActions, docStoreSelectors } from 'store/doc/doc.store';
import { docsStoreActions, docsStoreSelectors } from 'store/docs/docs.store';

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
    const updatedDocument: API4MarkdownDto<`getYourDocuments`>[number] = {
      ...response,
      code,
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

export { updateDocumentVisibility };