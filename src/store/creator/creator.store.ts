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

const { getState: get } = useCreatorStore;

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

export { useCreatorStore, creatorStoreSelectors };
