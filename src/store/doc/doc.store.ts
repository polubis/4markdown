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
}

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
  name: ``,
  invalid: true,
}));

const { setState: set } = useDocStore;

const docStoreActions: DocStoreActions = {
  changeName: (name) => {
    set({ name, invalid: name.trim().length < 3 });
  },
  create: () => {
    set({ is: `active` });
  },
};

export { useDocStore, docStoreActions };
