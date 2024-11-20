import { getAPI, parseError } from 'api-4markdown';
import { useDocumentPreviewStore } from './document-preview.store';

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

export { loadDocument };
