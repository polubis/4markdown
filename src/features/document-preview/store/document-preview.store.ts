import { getAPI } from 'api-4markdown';
import { parseError } from 'development-kit/parse-error';
import { create } from 'zustand';
import type { DocumentPreviewStoreState } from './document-preview.models';

const useDocumentPreviewStore = create<DocumentPreviewStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocumentPreviewStore;

const loadDocument = async (): Promise<void> => {
  try {
    setState({ is: `busy` });

    const params = new URLSearchParams(window.location.search);
    const id = params.get(`id`) ?? ``;

    if (!id) throw Error(`Wrong id parameter`);

    const document = await getAPI().call(`getAccessibleDocument`)({ id });

    setState({ is: `ok`, document });
  } catch (error: unknown) {
    setState({ is: `fail`, error: parseError(error) });
  }
};

export { loadDocument, useDocumentPreviewStore };
