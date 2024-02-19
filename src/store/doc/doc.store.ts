import type { Doc, PermanentDoc } from 'models/doc';
import { creatorStoreActions } from 'store/creator/creator.store';
import { create } from 'zustand';

interface DocStoreIdleState {
  is: 'idle';
}

type DocStoreActiveState = Doc & {
  is: 'active';
};

type DocStoreState = DocStoreIdleState | DocStoreActiveState;

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
  name: (name: Doc['name']): boolean =>
    typeof name === `string` &&
    name.length === name.trim().length &&
    name.length >= 2 &&
    name.length <= 100 &&
    /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/.test(name.trim()),
  description: (description: PermanentDoc['description']): boolean => {
    if (typeof description !== `string`) {
      return false;
    }

    return (
      description.length === description.trim().length &&
      description.length >= 50 &&
      description.length <= 250
    );
  },
  tags: (tags: string): boolean => {
    if (typeof tags !== `string` || tags.length !== tags.trim().length) {
      return false;
    }

    const splitted = tags.split(`,`);

    return (
      splitted.length >= 0 &&
      splitted.length <= 10 &&
      splitted.length === new Set([...splitted]).size &&
      splitted.every(
        (tag) =>
          tag.length >= 2 && tag.length <= 50 && /^[a-zA-Z0-9,-]+$/.test(tag),
      )
    );
  },
} as const;

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

const docStoreActions = {
  setActive: (doc: Doc): void => {
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

export {
  useDocStore,
  docStoreActions,
  DOC_STORE_LS_KEY,
  docStoreValidators,
  docStoreSelectors,
};
