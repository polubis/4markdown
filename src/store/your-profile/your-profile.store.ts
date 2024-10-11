import type { Date, UserProfileDto } from 'api-4markdown-contracts';
import { parseErrorV2 } from 'development-kit/parse-error-v2';
import type { Transaction } from 'development-kit/utility-types';
import { create } from 'zustand';

type YourProfileStoreState = Transaction<{
  user: UserProfileDto | null;
  mdate: Date | null;
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
  ok: ({ mdate, user }: Pick<YourProfileStoreOkState, 'mdate' | 'user'>) => {
    set({ is: `ok`, user, mdate });
  },
  fail: (error: unknown) => set({ is: `fail`, error: parseErrorV2(error) }),
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
