import { parseError } from 'development-kit/parse-error';
import type { Doc } from 'models/doc';
import type { Transaction } from 'models/transaction';
import { create } from 'zustand';

type DocsStoreState = Transaction<{ docs: Doc[] }>;
type DocsStoreOkState = Extract<DocsStoreState, { is: 'ok' }>;

const useDocsStore = create<DocsStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocsStore;

const set = (state: DocsStoreState): void => {
  setState(state, true);
};

const getOkState = (state: DocsStoreState): DocsStoreOkState => {
  if (state.is !== `ok`) {
    throw Error(`Tried to read state when not allowed`);
  }

  return state;
};

const DOCS_STORE_LS_KEY = `docs`;

const docsStoreSelectors = {
  ok: () => getOkState(useDocsStore.getState()),
  useOk: () => useDocsStore(getOkState),
};

const docsStoreActions = {
  idle: () => {
    set({ is: `idle` });
    localStorage.removeItem(DOCS_STORE_LS_KEY);
  },
  busy: () => set({ is: `busy` }),
  ok: (docs: Doc[]) => {
    const newState: DocsStoreOkState = { is: `ok`, docs };

    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
  sync: () => {
    const state = localStorage.getItem(DOCS_STORE_LS_KEY) as string | null;

    if (state === null) {
      docsStoreActions.idle();
      return;
    }

    set(JSON.parse(state) as DocsStoreOkState);
  },
  updateDoc: (doc: Doc) => {
    const state = docsStoreSelectors.ok();
    const newState: DocsStoreOkState = {
      ...state,
      docs: state.docs.map((d) => (d.id === doc.id ? doc : d)),
    };
    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
  addDoc: (doc: Doc) => {
    const state = docsStoreSelectors.ok();
    const newState: DocsStoreOkState = {
      ...state,
      docs: [doc, ...state.docs],
    };
    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
  deleteDoc: (id: Doc['id']) => {
    const state = docsStoreSelectors.ok();
    const newState: DocsStoreOkState = {
      ...state,
      docs: state.docs.filter((doc) => doc.id !== id),
    };
    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
} as const;

export type { DocsStoreOkState };
export {
  useDocsStore,
  docsStoreActions,
  DOCS_STORE_LS_KEY,
  docsStoreSelectors,
};
