import { getAPI, parseError, setCache } from "api-4markdown";
import type {
  API4MarkdownPayload,
  DocumentDto,
  Atoms,
} from "api-4markdown-contracts";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docStoreActions } from "store/doc/doc.store";
import { docsStoreActions, docsStoreSelectors } from "store/docs/docs.store";
import { addOrBumpEntryAction } from "modules/previous-work";

const buildDefaultName = (): API4MarkdownPayload<"createDocument">["name"] => {
  const today = new Date();
  const isoDate = today.toISOString().slice(0, 10);

  return `new-${isoDate}`;
};

const createEmptyDocumentAct = async (): Promise<DocumentDto | null> => {
  try {
    docManagementStoreActions.busy();

    const createdDocument = await getAPI().call("createDocument")({
      name: buildDefaultName(),
      code: ``,
    });

    docManagementStoreActions.ok();

    docStoreActions.setActive(createdDocument);
    docsStoreActions.addDoc(createdDocument);

    setCache("getYourDocuments", docsStoreSelectors.ok().docs);

    addOrBumpEntryAction({
      type: "document",
      resourceId: createdDocument.id as Atoms["DocumentId"],
      title: createdDocument.name,
      lastTouched: Date.now(),
    });

    return createdDocument;
  } catch (error: unknown) {
    docManagementStoreActions.fail(error);

    return null;
  }
};

export { createEmptyDocumentAct };
