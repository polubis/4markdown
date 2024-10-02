import type {
  API4MarkdownPayload,
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import { useAuthStore } from 'store/auth/auth.store';
import { create } from 'zustand';

type DocPreviewStoreState = Transaction<{
  doc: PublicDocumentDto | PermanentDocumentDto;
}>;
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
    set({ is: `busy` });

    const doc = await authStore.getAccessibleDocument(payload);

    set({ is: `ok`, doc });
  } catch (error: unknown) {
    set({ is: `fail`, error: parseError(error) });
  }
};

export { loadDocument, useDocPreviewStore };
