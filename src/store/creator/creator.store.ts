import { create } from 'zustand';

type CreatorStoreStateIdle = { is: 'idle' };
type CreatorStoreStateReady = { is: 'ready' } & {
  initialCode: string;
  code: string;
  changed: boolean;
};

type CreatorStoreState = CreatorStoreStateIdle | CreatorStoreStateReady;

const CREATOR_STORE_LS_KEY = `code`;

const useCreatorStore = create<CreatorStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState: get } = useCreatorStore;

const isReadyState = (state: CreatorStoreState): CreatorStoreStateReady => {
  if (state.is === `idle`) {
    throw Error(`Reading state when not ready`);
  }

  return state;
};

const creatorStoreSelectors = {
  state: get,
  useReady: () => useCreatorStore(isReadyState),
  ready: () => isReadyState(get()),
} as const;

const set = (state: CreatorStoreState): void => {
  setState(state, true);
};

const creatorStoreActions = {
  hydrate: (initialCode: string) => {
    const state = creatorStoreSelectors.state();

    if (state.is === `idle`)
      set({ is: `ready`, initialCode, code: initialCode, changed: false });
  },
  init: () => {
    const { is, initialCode } = creatorStoreSelectors.ready();

    const newState: CreatorStoreStateReady = {
      is,
      code: initialCode,
      initialCode,
      changed: false,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  change: (code: string) => {
    const { is, initialCode } = creatorStoreSelectors.ready();
    const newState: CreatorStoreStateReady = {
      is,
      code,
      initialCode,
      changed: true,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  asUnchanged: () => {
    const { is, initialCode, code } = creatorStoreSelectors.ready();
    const newState: CreatorStoreStateReady = {
      is,
      code,
      initialCode,
      changed: false,
    };

    set(newState);
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(newState));
  },
  sync: () => {
    const state = localStorage.getItem(CREATOR_STORE_LS_KEY) as string | null;

    if (state === null) {
      set(creatorStoreSelectors.ready());
      return;
    }

    set(JSON.parse(state) as CreatorStoreStateReady);
  },
} as const;

export {
  useCreatorStore,
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
  creatorStoreSelectors,
};
