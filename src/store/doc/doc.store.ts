import type { Doc } from 'models/doc';
import { create } from 'zustand';

interface DocStoreIdleState {
  is: 'idle';
}

interface DocStoreActiveState extends Pick<Doc, 'name' | 'id'> {
  is: 'active';
}

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

interface DocStoreActions {
  changeName(id: Doc['id'], name: Doc['name']): void;
  reset(): void;
  sync(): void;
}

interface DocStoreSelectors {
  active(): DocStoreActiveState;
  useActive(): DocStoreActiveState;
}

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
}));

const { setState: set } = useDocStore;
const DOC_STORE_LS_KEY = `doc`;

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
  changeName: (id, name) => {
    const newState: DocStoreState = {
      id,
      name,
      is: `active`,
    };
    set(newState);
    localStorage.setItem(DOC_STORE_LS_KEY, JSON.stringify(newState));
  },
  sync: () => {
    const state = localStorage.getItem(DOC_STORE_LS_KEY) as string | null;

    if (state === null) {
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
