import { create } from 'zustand';

type CreatorStoreStateIdle = { is: 'idle' };
type CreatorStoreStateReady = { is: 'ready' } & {
  initialCode: string;
  code: string;
  changed: boolean;
};

type CreatorStoreState = CreatorStoreStateIdle | CreatorStoreStateReady;

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
  useState: () => useCreatorStore(),
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
  },
  changeWithoutMarkAsUnchanged: (code: string) => {
    const { is, initialCode, changed } = creatorStoreSelectors.ready();
    const newState: CreatorStoreStateReady = {
      is,
      code,
      initialCode,
      changed,
    };

    set(newState);
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
  },
} as const;

export { useCreatorStore, creatorStoreActions, creatorStoreSelectors };
