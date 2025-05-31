import { getAPI, parseError } from 'api-4markdown';
import { useDocumentPreviewStore } from './document-preview.store';
import type { UserId } from 'api-4markdown-contracts';

const { setState } = useDocumentPreviewStore;

// @TODO[PRIO=4]: [Separate routing logic from api call - it should not be here].
const loadDocument = async (): Promise<void> => {
  try {
    setState({ is: `busy` });

    const params = new URLSearchParams(window.location.search);
    const documentId = params.get(`id`);
    const authorId = params.get(`authorId`);

    if (!documentId || !authorId) throw Error(`Wrong id parameter`);

    const document = await getAPI().call(`getAccessibleDocument`)({
      documentId,
      authorId: authorId as UserId,
    });

    setState({ is: `ok`, document });
  } catch (error: unknown) {
    setState({ is: `fail`, error: parseError(error) });
  }
};

export { loadDocument };
