import type { Doc } from 'models/doc';
import { creatorStoreActions } from 'store/creator/creator.store';
import { create } from 'zustand';

interface DocStoreIdleState {
  is: 'idle';
}

interface DocStoreActiveState extends Doc {
  is: 'active';
}

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

interface DocStoreActions {
  reset(): void;
  sync(): void;
  setActive(doc: Doc): void;
}

interface DocStoreSelectors {
  active(): DocStoreActiveState;
  useActive(): DocStoreActiveState;
}

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocStore;
const DOC_STORE_LS_KEY = `doc`;

const set = (state: DocStoreState): void => {
  setState(state, true);
};

const docStoreValidators = {
  name: (name: string): boolean => name.trim().length < 2,
};

const getActiveState = (state: DocStoreState): DocStoreActiveState => {
  if (state.is === `idle`) {
    throw Error(`Tried to read in not allowed state`);
  }

  return state;
};

const docStoreSelectors: DocStoreSelectors = {
  active: () => getActiveState(useDocStore.getState()),
  useActive: () => useDocStore(getActiveState),
};

const docStoreActions: DocStoreActions = {
  setActive: (doc) => {
    const newState: DocStoreActiveState = {
      is: `active`,
      ...doc,
    };
    set(newState);
    creatorStoreActions.change(doc.code);
    localStorage.setItem(DOC_STORE_LS_KEY, JSON.stringify(newState));
  },
  sync: () => {
    const state = localStorage.getItem(DOC_STORE_LS_KEY) as string | null;

    if (state === null) {
      docStoreActions.reset();
      return;
    }

    set(JSON.parse(state) as DocStoreState);
  },
  reset: () => {
    set({
      is: `idle`,
    });
    localStorage.removeItem(DOC_STORE_LS_KEY);
  },
};

export {
  useDocStore,
  docStoreActions,
  DOC_STORE_LS_KEY,
  docStoreValidators,
  docStoreSelectors,
};
