import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'models/transaction';
import { UserProfile } from 'models/user';
import { create } from 'zustand';

type UserProfileStoreState = Transaction<UserProfile>;
type UserProfileStoreOkState = Extract<UserProfileStoreState, { is: 'ok' }>;

const useUserProfileStore = create<UserProfileStoreState>(() => ({
  is: `idle`,
}));

const { setState, getState } = useUserProfileStore;

const set = (state: UserProfileStoreState, replace = true): void => {
  setState(state, replace);
};

const userProfileStoreActions = {
  idle: () => set({ is: `idle` }),
  busy: () => set({ is: `busy` }),
  ok: (data: UserProfile) => set({ is: `ok`, ...data }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
};

const isOk = (state: UserProfileStoreState): UserProfileStoreOkState => {
  if (state.is !== `ok`) {
    throw Error(`Tried to read state when not allowed`);
  }

  return state;
};

const userProfileStoreSelectors = {
  state: getState,
  useState: () => useUserProfileStore(),
  ok: () => isOk(getState()),
  useOk: () => useUserProfileStore(isOk),
};

export type { UserProfileStoreState, UserProfileStoreOkState };
export { userProfileStoreActions, userProfileStoreSelectors };
