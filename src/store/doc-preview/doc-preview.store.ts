import type { API4MarkdownPayload, DocumentDto } from 'api-4markdown-contracts';
import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import { useAuthStore } from 'store/auth/auth.store';
import { create } from 'zustand';

type DocPreviewStoreState = Transaction<{ doc: DocumentDto }>;

const useDocPreviewStore = create<DocPreviewStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocPreviewStore;

const set = (state: DocPreviewStoreState): void => {
  setState(state, true);
};

const docPreviewStoreActions = {
  load: async (payload: API4MarkdownPayload<'getPublicDoc'>): Promise<void> => {
    const authStore = useAuthStore.getState();

    if (authStore.is === `idle`)
      throw Error(`Attempt to load Firebase data on idle`);

    try {
      set({ is: `busy` });

      const doc = await authStore.getPublicDoc(payload);

      set({ is: `ok`, doc });
    } catch (error: unknown) {
      set({ is: `fail`, error: parseError(error) });
    }
  },
} as const;

export { useDocPreviewStore, docPreviewStoreActions };
