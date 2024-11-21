import { parseError } from 'api-4markdown';
import type { Transaction } from 'development-kit/utility-types';
import type { DocumentCreatorViewModel } from 'models/view-models';
import { create } from 'zustand';

type DocsStoreState = Transaction<{
  docs: DocumentCreatorViewModel['document'][];
}>;
type DocsStoreOkState = Extract<DocsStoreState, { is: 'ok' }>;

const useDocsStore = create<DocsStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useDocsStore;

const set = (state: DocsStoreState) => {
  setState(state, true);
};

const getOkState = (state: DocsStoreState): DocsStoreOkState => {
  if (state.is !== `ok`) throw Error(`Tried to read state when not allowed`);

  return state;
};

const docsStoreSelectors = {
  state: () => getState(),
  ok: () => getOkState(getState()),
};

const docsStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: (docs: DocumentCreatorViewModel['document'][]) => set({ is: `ok`, docs }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
  updateDoc: (doc: DocumentCreatorViewModel['document']) => {
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
  addDoc: (doc: DocumentCreatorViewModel['document']) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: [doc, ...state.docs],
    });
  },
  deleteDoc: (id: DocumentCreatorViewModel['document']['id']) => {
    const state = docsStoreSelectors.ok();

    set({
      ...state,
      docs: state.docs.filter((doc) => doc.id !== id),
    });
  },
};

export type { DocsStoreOkState };
export { useDocsStore, docsStoreActions, docsStoreSelectors };
