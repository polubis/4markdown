import { getAPI } from 'api-4markdown';
import type {
  API4MarkdownPayload,
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import { type ParsedError, parseErrorV2 } from 'development-kit/parse-error-v2';
import type { Transaction } from 'development-kit/utility-types';
import { useAuthStore } from 'store/auth/auth.store';
import { create } from 'zustand';

type DocPreviewStoreState = Transaction<
  {
    doc: PublicDocumentDto | PermanentDocumentDto;
  },
  ParsedError
>;
type DocPreviewStoreOkState = Extract<DocPreviewStoreState, { is: 'ok' }>;

const useDocPreviewStore = create<DocPreviewStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocPreviewStore;

const set = (state: DocPreviewStoreState): void => {
  setState(state, true);
};

const isOk = (state: DocPreviewStoreState): DocPreviewStoreOkState => {
  if (state.is !== `ok`) {
    throw Error(`Tried to read state when not allowed`);
  }

  return state;
};

const loadDocument = async (): Promise<void> => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get(`id`) ?? ``;

    if (!id) throw Error(`Wrong id parameter`);

    const instance = getAPI();

    set({ is: `busy` });

    const doc = await instance.call(`getAccessibleDocument`)(payload);

    set({ is: `ok`, doc });
  } catch (error: unknown) {
    set({ is: `fail`, error: parseError(error) });
  }
};

export { loadDocument, useDocPreviewStore };
