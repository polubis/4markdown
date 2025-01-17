import { parseError } from 'api-4markdown';
import type { API4MarkdownDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type YourProfileStoreState = Transaction<{
  user: API4MarkdownDto<'getYourUserProfileV2'>;
}>;
type YourProfileStoreOkState = Extract<YourProfileStoreState, { is: 'ok' }>;

const useYourProfileStore = create<YourProfileStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useYourProfileStore;

const set = (state: YourProfileStoreState, replace = true): void => {
  setState(state, replace);
};

const yourProfileStoreActions = {
  idle: () => {
    set({ is: `idle` });
  },
  busy: () => set({ is: `busy` }),
  ok: (user: YourProfileStoreOkState['user']) => {
    set({ is: `ok`, user });
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
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
