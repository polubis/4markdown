import { getAPI, parseError, setCache } from "api-4markdown";
import type {
  AccessGroupId,
  API4MarkdownDto,
  ManualDocumentDto,
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
} from "api-4markdown-contracts";
import { AsyncResult } from "development-kit/utility-types";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docStoreActions, docStoreSelectors } from "store/doc/doc.store";
import { docsStoreActions, docsStoreSelectors } from "store/docs/docs.store";
import { useDocumentCreatorState } from "store/document-creator";
import { changeWithoutMarkAsUnchangedAction } from "store/document-creator/actions";

type PrivatePayload = Pick<PrivateDocumentDto, "visibility">;
type PublicPayload = Pick<PublicDocumentDto, "visibility">;
type PermanentPayload = Pick<
  PermanentDocumentDto,
  "description" | "name" | "tags" | "visibility"
>;
type ManualPayload = Pick<ManualDocumentDto, "visibility"> & {
  sharedForGroups: AccessGroupId[];
};

const updateDocumentVisibilityAct = async (
  payload: PrivatePayload | PublicPayload | PermanentPayload | ManualPayload,
): AsyncResult => {
  try {
    const { code } = useDocumentCreatorState.get();
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
    changeWithoutMarkAsUnchangedAction(updatedDocument.code);
    docStoreActions.setActiveWithoutCodeChange(updatedDocument);
    docsStoreActions.updateDoc(updatedDocument);

    setCache(`getYourDocuments`, docsStoreSelectors.ok().docs);

    return { is: `ok` };
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);
    return { is: `fail`, error: parseError(error) };
  }
};

export { updateDocumentVisibilityAct };
