import { parseError } from 'development-kit/parse-error';
import type { Doc } from 'models/doc';
import type { Transaction } from 'models/transaction';
import { create } from 'zustand';

type DocsStoreState = Transaction<{ docs: Doc[] }>;
type DocStoreOkState = Extract<DocsStoreState, { is: 'ok' }>;

const useDocsStore = create<DocsStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocsStore;

const set = (state: DocsStoreState): void => {
  setState(state, true);
};

const getOkState = (state: DocsStoreState): DocStoreOkState => {
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
    const newState: DocStoreOkState = { is: `ok`, docs };

    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
  sync: () => {
    const state = localStorage.getItem(DOCS_STORE_LS_KEY) as string | null;

    if (state === null) {
      return;
    }

    set(JSON.parse(state) as DocStoreOkState);
  },
  updateDoc: (doc: Doc) => {
    const state = docsStoreSelectors.ok();
    const newState: DocStoreOkState = {
      ...state,
      docs: state.docs.map((d) => (d.id === doc.id ? doc : d)),
    };
    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
  addDoc: (doc: Doc) => {
    const state = docsStoreSelectors.ok();
    const newState: DocStoreOkState = {
      ...state,
      docs: [...state.docs, doc],
    };
    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
} as const;

export {
  useDocsStore,
  docsStoreActions,
  DOCS_STORE_LS_KEY,
  docsStoreSelectors,
};
