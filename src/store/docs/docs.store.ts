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
};

const docsStoreActions = {
  idle: () => {
    set({ is: `idle` });
    localStorage.removeItem(DOCS_STORE_LS_KEY);
  },
  busy: () => set({ is: `busy` }),
  ok: (docs: DocumentDto[]) => {
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
  updateDoc: (doc: DocumentDto) => {
    const state = docsStoreSelectors.ok();
    const newState: DocsStoreOkState = {
      ...state,
      docs: state.docs
        .map((d) => (d.id === doc.id ? doc : d))
        .sort((prev, curr) => {
          if (prev.mdate > curr.mdate) return -1;
          if (prev.mdate === curr.mdate) return 0;
          return 1;
        }),
    };
    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
  addDoc: (doc: DocumentDto) => {
    const state = docsStoreSelectors.ok();
    const newState: DocsStoreOkState = {
      ...state,
      docs: [doc, ...state.docs],
    };
    set(newState);
    localStorage.setItem(DOCS_STORE_LS_KEY, JSON.stringify(newState));
  },
  deleteDoc: (id: DocumentDto['id']) => {
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
