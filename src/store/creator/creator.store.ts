import { create } from 'zustand';

type CreatorStoreState = {
  initialCode: string;
  code: string;
  changed: boolean;
};

const CREATOR_STORE_LS_KEY = `code`;

const useCreatorStore = create<CreatorStoreState>(() => ({
  initialCode: ``,
  code: ``,
  changed: false,
}));

const { setState, getState } = useCreatorStore;

const creatorStoreActions = {
  setInitialCode: (initialCode: string) => {
    setState({ initialCode });
  },
  init: (): void => {
    const { initialCode } = getState();

    setState({
      initialCode,
      changed: false,
    });

    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(getState()));
  },
  change: (code: string): void => {
    setState({
      code,
      changed: true,
    });

    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(getState()));
  },
  asUnchanged: (): void => {
    setState({ changed: false });
    localStorage.setItem(CREATOR_STORE_LS_KEY, JSON.stringify(getState()));
  },
  sync: (): void => {
    const state = localStorage.getItem(CREATOR_STORE_LS_KEY) as string | null;

    if (state === null) return;

    setState(JSON.parse(state));
  },
} as const;

const creatorStoreSelectors = {
  state: getState,
  useState: () => useCreatorStore(),
} as const;

export {
  CREATOR_STORE_LS_KEY,
  creatorStoreActions,
  useCreatorStore,
  creatorStoreSelectors,
};
