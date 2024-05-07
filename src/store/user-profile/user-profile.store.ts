import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'models/transaction';
import { UpdateUserProfileDto } from 'models/user';
import { create } from 'zustand';

type UserProfileStoreState = Transaction<UpdateUserProfileDto>;

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
  ok: (data: UpdateUserProfileDto) => set({ is: `ok`, ...data }),
  fail: (error: unknown) => set({ is: `fail`, error: parseError(error) }),
};

const userProfileStoreSelectors = {
  state: getState,
  useState: () => useUserProfileStore(),
};

export {
  useUserProfileStore,
  userProfileStoreActions,
  userProfileStoreSelectors,
};
