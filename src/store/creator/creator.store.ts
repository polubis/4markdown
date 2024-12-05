import { create } from 'zustand';
import { createInitialCode } from '../../../create-initial-code';

type CreatorStoreState = {
  initialCode: string;
  code: string;
  changed: boolean;
};

const CREATOR_STORE_LS_KEY = `code`;

const initialCode = createInitialCode();

const useCreatorStore = create<CreatorStoreState>(() => ({
  initialCode,
  code: initialCode,
  changed: false,
}));

const { setState, getState: get } = useCreatorStore;

const creatorStoreSelectors = {
  useState: () => useCreatorStore(),
  state: get,
} as const;

const set = (state: CreatorStoreState): void => {
  setState(state, true);
};

const creatorStoreActions = {
  init: () => {
    const { initialCode } = creatorStoreSelectors.state();

    const newState: CreatorStoreState = {
      code: initialCode,
      initialCode,
      changed: false,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  changeWithoutMarkAsUnchanged: (code: string) => {
    const { initialCode, changed } = creatorStoreSelectors.state();

    const newState: CreatorStoreState = {
      code,
      initialCode,
      changed,
    };

    set(newState);

    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  change: (code: string) => {
    const { initialCode } = creatorStoreSelectors.state();
    const newState: CreatorStoreState = {
      code,
      initialCode,
      changed: true,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  asUnchanged: () => {
    const { initialCode, code } = creatorStoreSelectors.state();
    const newState: CreatorStoreState = {
      code,
      initialCode,
      changed: false,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  sync: () => {
    const state = localStorage.getItem(CREATOR_STORE_LS_KEY) as string | null;

    if (state === null) return;

    set(JSON.parse(state) as CreatorStoreState);
  },
} as const;

export {
  useCreatorStore,
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
  creatorStoreSelectors,
};
