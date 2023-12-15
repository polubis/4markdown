import type { Doc } from 'models/doc';
import { create } from 'zustand';

interface DocStoreIdleState extends Pick<Doc, 'name'> {
  is: 'idle';
  invalid: boolean;
}

interface DocStoreActiveState extends Pick<Doc, 'name'> {
  is: 'active';
  invalid: boolean;
}

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

interface DocStoreActions {
  changeName(name: string): void;
  create(): void;
  sync(): void;
}

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
  name: ``,
  invalid: true,
}));

const { setState: set, getState: get } = useDocStore;
const DOC_STORE_LS_KEY = `doc`;

const docStoreActions: DocStoreActions = {
  changeName: (name) => {
    const { is } = get();
    const newState: DocStoreState = {
      is,
      name,
      invalid: name.trim().length < 3,
    };
    set(newState);
    localStorage.setItem(DOC_STORE_LS_KEY, JSON.stringify(newState));
  },
  create: () => {
    const newState: DocStoreState = {
      ...get(),
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
};

export { useDocStore, docStoreActions, DOC_STORE_LS_KEY };
