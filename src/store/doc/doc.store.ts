import type { Doc } from 'models/doc';
import { create } from 'zustand';

interface DocStoreIdleState extends Pick<Doc, 'name'> {
  is: 'idle';
}

interface DocStoreActiveState extends Pick<Doc, 'name'> {
  is: 'active';
}

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

interface DocStoreActions {
  changeName(name: string): void;
  sync(): void;
  reset(): void;
}

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
  name: ``,
}));

const { setState: set } = useDocStore;
const DOC_STORE_LS_KEY = `doc`;

const docStoreValidators = {
  name: (name: string): boolean => name.trim().length < 2,
};

const docStoreActions: DocStoreActions = {
  changeName: (name) => {
    const newState: DocStoreState = {
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
      name: ``,
    });
    localStorage.removeItem(DOC_STORE_LS_KEY);
  },
};

export { useDocStore, docStoreActions, DOC_STORE_LS_KEY, docStoreValidators };
