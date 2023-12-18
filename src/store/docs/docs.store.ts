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

const DOCS_STORE_LS_KEY = `docs`;

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
} as const;

export { useDocsStore, docsStoreActions, DOCS_STORE_LS_KEY };
