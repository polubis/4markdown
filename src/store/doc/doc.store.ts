import type { DocumentDto } from 'api-4markdown-contracts';
import { creatorStoreActions } from 'store/creator/creator.store';
import { create } from 'zustand';

interface DocStoreIdleState {
  is: 'idle';
}

type DocStoreActiveState = DocumentDto & {
  is: 'active';
};

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocStore;
const DOC_STORE_LS_KEY = `doc`;

const set = (state: DocStoreState): void => {
  setState(state, true);
};

const getActiveState = (state: DocStoreState): DocStoreActiveState => {
  if (state.is === `idle`) {
    throw Error(`Tried to read in not allowed state`);
  }

  return state;
};

const docStoreSelectors = {
  active: () => getActiveState(useDocStore.getState()),
  useActive: () => useDocStore(getActiveState),
} as const;

const docStoreActions = {
  setActive: (doc: DocumentDto): void => {
    const newState: DocStoreActiveState = {
      is: `active`,
      ...doc,
    };
    set(newState);
    creatorStoreActions.change(doc.code);
    creatorStoreActions.asUnchanged();
    localStorage.setItem(DOC_STORE_LS_KEY, JSON.stringify(newState));
  },
  sync: (): void => {
    const state = localStorage.getItem(DOC_STORE_LS_KEY) as string | null;

    if (state === null) {
      docStoreActions.reset();
      return;
    }

    set(JSON.parse(state) as DocStoreState);
  },
  reset: (): void => {
    set({ is: `idle` });
    localStorage.removeItem(DOC_STORE_LS_KEY);
  },
} as const;

export type { DocStoreState, DocStoreActiveState };
export { useDocStore, docStoreActions, DOC_STORE_LS_KEY, docStoreSelectors };
