import type { DocumentCreatorViewModel } from 'models/view-models';
import { creatorStoreActions } from 'store/creator/creator.store';
import { create } from 'zustand';

interface DocStoreIdleState {
  is: 'idle';
}

type DocStoreActiveState = DocumentCreatorViewModel['document'] & {
  is: 'active';
};

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

const useDocStore = create<DocStoreState>(() => ({
  is: `idle`,
}));

const { setState } = useDocStore;

const set = (state: DocStoreState) => {
  setState(state, true);
};

const getActiveState = (state: DocStoreState): DocStoreActiveState => {
  if (state.is === `idle`) throw Error(`Tried to read in not allowed state`);

  return state;
};

const docStoreSelectors = {
  active: () => getActiveState(useDocStore.getState()),
  useActive: () => useDocStore(getActiveState),
  state: () => useDocStore.getState(),
  useState: () => useDocStore(),
};

const docStoreActions = {
  setActive: (doc: DocumentCreatorViewModel['document']) => {
    const newState: DocStoreActiveState = {
      is: `active`,
      ...doc,
    };
    set(newState);
    creatorStoreActions.change(doc.code);
    creatorStoreActions.asUnchanged();
  },
  reset: () => set({ is: `idle` }),
};

export type { DocStoreState, DocStoreActiveState };
export { useDocStore, docStoreActions, docStoreSelectors };
