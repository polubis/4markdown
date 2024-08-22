import type { DocumentDto } from 'api-4markdown-contracts';
import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type DocsStoreState = Transaction<{ docs: DocumentDto[] }>;
type DocsStoreOkState = Extract<DocsStoreState, { is: 'ok' }>;

const useDocsStore = create<DocsStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocsStore;

const set = (state: DocsStoreState) => {
  setState(state, true);
};

const getOkState = (state: DocsStoreState): DocsStoreOkState => {
  if (state.is !== `ok`) throw Error(`Tried to read state when not allowed`);

  return state;
};

const docsStoreSelectors = {
  ok: () => getOkState(useDocsStore.getState()),
  useOk: () => useDocsStore(getOkState),
};

const docsStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: (docs: DocumentDto[]) => set({ is: `ok`, docs }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
  updateDoc: (doc: DocumentDto) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: state.docs
        .map((d) => (d.id === doc.id ? doc : d))
        .sort((prev, curr) => {
          if (prev.mdate > curr.mdate) return -1;
          if (prev.mdate === curr.mdate) return 0;
          return 1;
        }),
    });
  },
  addDoc: (doc: DocumentDto) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: [doc, ...state.docs],
    });
  },
  deleteDoc: (id: DocumentDto['id']) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: state.docs.filter((doc) => doc.id !== id),
    });
  },
};

export type { DocsStoreOkState };
export { useDocsStore, docsStoreActions, docsStoreSelectors };
