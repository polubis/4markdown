import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import type { GetYourProfileDto } from 'models/user';
import { create } from 'zustand';

type YourProfileStoreState = Transaction<{ user: GetYourProfileDto }>;
type YourProfileStoreOkState = Extract<YourProfileStoreState, { is: 'ok' }>;

const useYourProfileStore = create<YourProfileStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useYourProfileStore;

const set = (state: YourProfileStoreState, replace = true): void => {
  setState(state, replace);
};

const YOUR_PROFILE_STORE_LS_KEY = `your-profile`;

const yourProfileStoreActions = {
  idle: () => {
    localStorage.removeItem(YOUR_PROFILE_STORE_LS_KEY);
    set({ is: `idle` });
  },
  busy: () => set({ is: `busy` }),
  ok: (user: GetYourProfileDto) => {
    const state: YourProfileStoreOkState = { is: `ok`, user };
    localStorage.setItem(YOUR_PROFILE_STORE_LS_KEY, JSON.stringify(state));
    set(state);
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
  sync: (): void => {
    const state = localStorage.getItem(YOUR_PROFILE_STORE_LS_KEY) as
      | string
      | null;

    if (state === null) {
      set({ is: `idle` });
      return;
    }

    try {
      set(JSON.parse(state) as YourProfileStoreOkState);
    } catch {
      set({ is: `idle` });
    }
  },
};

const isOk = (state: YourProfileStoreState): YourProfileStoreOkState => {
  if (state.is !== `ok`) {
    throw Error(`Tried to read state when not allowed`);
  }

  return state;
};

const yourProfileStoreSelectors = {
  state: getState,
  useState: () => useYourProfileStore(),
  ok: () => isOk(getState()),
  useOk: () => useYourProfileStore(isOk),
};

export type { YourProfileStoreState, YourProfileStoreOkState };
export { yourProfileStoreActions, yourProfileStoreSelectors };
