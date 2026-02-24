import { getAPI, parseError } from "api-4markdown";
import { useDocumentPreviewStore } from "./document-preview.store";
import { Atoms } from "api-4markdown-contracts";
import { addOrBumpEntryAction } from "modules/previous-work";

const { setState } = useDocumentPreviewStore;

const loadDocument = async (): Promise<void> => {
  try {
    setState({ is: `busy` });

    const params = new URLSearchParams(window.location.search);
    const documentId = params.get(`id`) ?? ``;

    if (!documentId) throw Error(`Wrong id parameter`);

    const document = await getAPI().call(`getAccessibleDocument`)({
      documentId: documentId as Atoms["DocumentId"],
    });

    setState({ is: `ok`, document });
    addOrBumpEntryAction({
      type: `document`,
      resourceId: document.id as Atoms["DocumentId"],
      title: document.name,
      lastTouched: Date.now(),
    });
  } catch (error: unknown) {
    setState({ is: `fail`, error: parseError(error) });
  }
};

export { loadDocument };
