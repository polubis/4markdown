import { getAPI } from 'api-4markdown';
import { parseErrorV2 } from 'development-kit/parse-error-v2';
import { create } from 'zustand';
import type { DocumentPreviewStoreState } from './document-preview.models';

const useDocumentPreviewStore = create<DocumentPreviewStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocumentPreviewStore;

const loadDocument = async (): Promise<void> => {
  try {
    setState({ is: `busy` });

    const instance = getAPI();

    const params = new URLSearchParams(window.location.search);
    const id = params.get(`id`) ?? ``;

    if (!id) throw Error(`Wrong id parameter`);

    const document = await instance.call(`getAccessibleDocument`)({ id });

    setState({ is: `ok`, document });
  } catch (error: unknown) {
    setState({ is: `fail`, error: parseErrorV2(error) });
  }
};

export { loadDocument, useDocumentPreviewStore };
