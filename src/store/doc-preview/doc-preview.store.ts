import { parseError } from 'development-kit/parse-error';
import type { Doc, GetDocPayload } from 'models/doc';
import type { Transaction } from 'models/transaction';
import { useAuthStore } from 'store/auth/auth.store';
import { create } from 'zustand';

type DocPreviewStoreState = Transaction<{ doc: Doc }>;

const useDocPreviewStore = create<DocPreviewStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState: get } = useDocPreviewStore;

const set = (state: DocPreviewStoreState): void => {
  setState(state, true);
};

const docPreviewStoreActions = {
  load: async (payload: GetDocPayload) => {
    const authStore = useAuthStore.getState();

    if (authStore.is === `idle`)
      throw Error(`Attempt to load Firebase data on idle`);

    const docPreviewStore = get();

    if (docPreviewStore.is === `ok` && docPreviewStore.doc.id === payload.id) {
      return;
    }

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
