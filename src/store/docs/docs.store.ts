import { create } from 'zustand';

interface DocsStoreActions {
  init(): void;
}

interface DocsStoreSelectors {}

interface DocsStoreStateIdle {
  is: 'idle';
}

interface DocsStoreStateCreateAfterSignIn {
  is: 'create-after-sign-in';
}

type DocsStoreState = DocsStoreStateIdle | DocsStoreStateCreateAfterSignIn;

const useDocsStore = create<DocsStoreState>(() => ({
  is: `idle`,
}));

const { setState: set, getState: get } = useDocsStore;

const docsStoreSelectors: DocsStoreSelectors = {};

const docsStoreActions: DocsStoreActions = {
  init: () => {
    const state = get();

    if (state.is !== `idle`) return;

    set({
      is: `create-after-sign-in`,
    });
  },
};

export { useDocsStore, docsStoreActions, docsStoreSelectors };
